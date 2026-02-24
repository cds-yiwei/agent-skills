#!/usr/bin/env node

/**
 * Enhanced strict mode enabler with granular control
 * Tracks progress and provides rollback capability
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const readline = require('readline');
const {
  formatSuccess,
  formatWarning
} = require('./error-utils');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const strictLevels = [
  {
    name: 'noImplicitAny',
    description: 'Disallow implicit any types',
    options: { noImplicitAny: true },
    priority: 1
  },
  {
    name: 'strictNullChecks',
    description: 'Enable strict null and undefined checks',
    options: { strictNullChecks: true },
    priority: 2
  },
  {
    name: 'strictFunctionTypes',
    description: 'Enable strict function type checking',
    options: { strictFunctionTypes: true },
    priority: 3
  },
  {
    name: 'strictBindCallApply',
    description: 'Enable strict bind/call/apply checking',
    options: { strictBindCallApply: true },
    priority: 4
  },
  {
    name: 'strictPropertyInitialization',
    description: 'Enable strict class property initialization',
    options: { strictPropertyInitialization: true },
    priority: 5
  },
  {
    name: 'noImplicitThis',
    description: 'Disallow implicit any for this',
    options: { noImplicitThis: true },
    priority: 6
  },
  {
    name: 'alwaysStrict',
    description: 'Enable strict mode in emitted JS',
    options: { alwaysStrict: true },
    priority: 7
  },
  {
    name: 'strict',
    description: 'Enable all strict type-checking options',
    options: { 
      strict: true,
      noUnusedLocals: true,
      noUnusedParameters: true,
      noImplicitReturns: true,
      noFallthroughCasesInSwitch: true
    },
    priority: 8
  }
];

function loadTsConfig(rootDir) {
  const configPath = path.join(rootDir, 'tsconfig.json');
  if (!fs.existsSync(configPath)) {
    throw new Error('tsconfig.json not found');
  }
  return JSON.parse(fs.readFileSync(configPath, 'utf-8'));
}

function saveTsConfig(rootDir, config) {
  const configPath = path.join(rootDir, 'tsconfig.json');
  fs.writeFileSync(configPath, JSON.stringify(config, null, 2));
}

function backupTsConfig(rootDir) {
  const configPath = path.join(rootDir, 'tsconfig.json');
  const backupPath = path.join(rootDir, 'tsconfig.json.backup');
  fs.copyFileSync(configPath, backupPath);
  console.error('✓ Backup created: tsconfig.json.backup');
}

function checkTypeErrors(rootDir, packageManager) {
  const npxCmd = packageManager === 'pnpm' ? 'pnpx' : 'npx';
  
  try {
    const output = execSync(`${npxCmd} tsc --noEmit 2>&1`, { 
      encoding: 'utf-8',
      cwd: rootDir,
      stdio: ['pipe', 'pipe', 'pipe']
    });
    
    return { success: true, errorCount: 0, output };
  } catch (error) {
    const output = error.stdout?.toString() || error.message;
    const errorMatches = output.match(/error TS\d+/g) || [];
    return {
      success: false,
      errorCount: errorMatches.length,
      output
    };
  }
}

function countAnyTypes(rootDir) {
  const anyPatterns = [
    /:\s*any\b(?!\w)/g,
    /as\s+any/g,
    /Array<any>/g,
    /any\[\]/g,
    /Record<string,\s*any>/g,
    /Promise<any>/g
  ];
  
  let totalCount = 0;
  const filesWithAny = [];
  
  function walk(dir) {
    try {
      const entries = fs.readdirSync(dir, { withFileTypes: true });
      
      for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);
        
        if (entry.isDirectory()) {
          const skipDirs = ['node_modules', 'dist', 'build', '.git', 'coverage'];
          if (!skipDirs.includes(entry.name)) {
            walk(fullPath);
          }
        } else if (entry.isFile() && /\.(ts|tsx)$/.test(entry.name)) {
          const content = fs.readFileSync(fullPath, 'utf-8');
          let fileCount = 0;
          
          for (const pattern of anyPatterns) {
            const matches = content.match(pattern);
            if (matches) {
              fileCount += matches.length;
            }
          }
          
          if (fileCount > 0) {
            totalCount += fileCount;
            filesWithAny.push({
              file: path.relative(rootDir, fullPath),
              count: fileCount
            });
          }
        }
      }
    } catch (error) {
      // Skip directories we can't read
    }
  }
  
  const srcDir = path.join(rootDir, 'src');
  if (fs.existsSync(srcDir)) {
    walk(srcDir);
  } else {
    walk(rootDir);
  }
  
  return { totalCount, filesWithAny };
}

function getCurrentLevel(config) {
  for (let i = strictLevels.length - 1; i >= 0; i--) {
    const level = strictLevels[i];
    const key = Object.keys(level.options)[0];
    if (config.compilerOptions[key] === true) {
      return i + 1;
    }
  }
  return 0;
}

function getEnabledLevels(config) {
  return strictLevels.filter(level => {
    const key = Object.keys(level.options)[0];
    return config.compilerOptions[key] === true;
  });
}

function promptUser(question) {
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      resolve(answer.trim().toLowerCase());
    });
  });
}

async function main() {
  const rootDir = process.cwd();
  
  // Get package manager
  let packageManager = 'npm';
  const analysisPath = path.join(rootDir, '.migration-analysis.json');
  if (fs.existsSync(analysisPath)) {
    const analysis = JSON.parse(fs.readFileSync(analysisPath, 'utf-8'));
    packageManager = analysis.packageManager;
  }
  
  console.error('=== TypeScript Strict Mode Progression ===\n');
  
  let config;
  try {
    config = loadTsConfig(rootDir);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
  
  const currentLevel = getCurrentLevel(config);
  const enabledLevels = getEnabledLevels(config);
  
  console.error(`Current Progress: Level ${currentLevel}/${strictLevels.length}`);
  console.error(`Enabled strict options: ${enabledLevels.length}`);
  
  if (enabledLevels.length > 0) {
    console.error('\n✓ Already enabled:');
    enabledLevels.forEach(level => {
      console.error(`   - ${level.name}: ${level.description}`);
    });
  }
  
  if (currentLevel >= strictLevels.length) {
    console.error('\n✅ All strict mode options are enabled!');
    rl.close();
    return;
  }
  
  console.error('\n📋 Remaining levels:');
  strictLevels.slice(currentLevel).forEach((level, idx) => {
    console.error(`   ${currentLevel + idx + 1}. ${level.name}`);
    console.error(`      ${level.description}`);
  });
  
  const nextLevel = strictLevels[currentLevel];
  console.error(`\n🎯 Next: Level ${currentLevel + 1} - ${nextLevel.name}`);
  console.error(`   ${nextLevel.description}`);
  
  // Check for any types before enabling noImplicitAny or strict
  if (nextLevel.name === 'noImplicitAny' || nextLevel.name === 'strict') {
    console.error('\n🔍 Checking for explicit "any" types...');
    const anyCheck = countAnyTypes(rootDir);
    
    if (anyCheck.totalCount > 0) {
      console.error(formatWarning(`\n⚠️  Found ${anyCheck.totalCount} explicit "any" types in ${anyCheck.filesWithAny.length} files`));
      console.error('\nFiles with most any types:');
      anyCheck.filesWithAny
        .sort((a, b) => b.count - a.count)
        .slice(0, 5)
        .forEach(f => console.error(`   - ${f.file}: ${f.count}`));
      
      console.error('\n💡 Recommendation:');
      console.error('   Run these scripts before enabling strict mode:');
      console.error('   1. node scripts/fix-implicit-any.js    # Fix implicit any');
      console.error('   2. node scripts/replace-any-types.js   # Fix explicit any');
      console.error('   3. node scripts/run-tests-and-fix.js   # Fix test errors');
      console.error('\n⚠️  Enabling strict mode with many any types will cause many errors.');
    } else {
      console.error(formatSuccess('✓ No explicit any types found'));
    }
  }
  
  const shouldProceed = await promptUser('\nProceed? (Y/n/rollback): ');
  
  if (shouldProceed === 'rollback') {
    if (fs.existsSync(path.join(rootDir, 'tsconfig.json.backup'))) {
      fs.copyFileSync(
        path.join(rootDir, 'tsconfig.json.backup'),
        path.join(rootDir, 'tsconfig.json')
      );
      console.error('✓ Rolled back to previous configuration');
    } else {
      console.error('No backup found');
    }
    rl.close();
    return;
  }
  
  if (shouldProceed !== 'y' && shouldProceed !== 'yes' && shouldProceed !== '') {
    console.error('Skipped');
    rl.close();
    return;
  }
  
  // Create backup before making changes
  backupTsConfig(rootDir);
  
  // Apply next level
  config.compilerOptions = {
    ...config.compilerOptions,
    ...nextLevel.options
  };
  
  saveTsConfig(rootDir, config);
  console.error(`\n✓ Enabled ${nextLevel.name}`);
  
  // Check for errors
  console.error('\n🔍 Checking TypeScript errors...');
  const result = checkTypeErrors(rootDir, packageManager);
  
  console.error(`\n📊 Results:`);
  console.error(`   Error count: ${result.errorCount}`);
  
  if (result.success) {
    console.error('   ✅ No errors!');
    console.error(`\n🎉 Level ${currentLevel + 1} complete!`);
    console.error('Run this script again to enable the next level.');
  } else {
    console.error('   ⚠️  Errors found');
    console.error('\n💡 Next steps:');
    console.error('   1. Fix the type errors in your code');
    console.error('   2. Run this script again to continue');
    console.error('   3. Or run with "rollback" to undo this change');
    
    // Show sample of errors
    const errorLines = result.output.split('\n').filter(line => line.includes('error TS')).slice(0, 5);
    if (errorLines.length > 0) {
      console.error('\n📝 Sample errors:');
      errorLines.forEach(line => console.error(`   ${line.substring(0, 100)}...`));
    }
  }
  
  // Save progress
  const progressPath = path.join(rootDir, '.migration-strict-progress.json');
  const progress = {
    currentLevel: currentLevel + 1,
    totalLevels: strictLevels.length,
    enabledOptions: [...enabledLevels, nextLevel].map(l => l.name),
    errorCount: result.errorCount,
    lastRun: new Date().toISOString()
  };
  fs.writeFileSync(progressPath, JSON.stringify(progress, null, 2));
  
  console.error(`\n💾 Progress saved to .migration-strict-progress.json`);
  rl.close();
}

main();
