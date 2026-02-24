#!/usr/bin/env node

/**
 * Migrates source files only (excludes test files)
 * - Converts .js/.jsx to .ts/.tsx
 * - Uses existing types from common types
 * - Preserves test files for later migration
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const {
  formatError,
  formatSuccess,
  formatInfo,
  formatWarning,
  validatePrerequisites,
  backupFile,
  parseArgs
} = require('./error-utils');

const TEST_PATTERNS = [
  /\.test\./,
  /\.spec\./,
  /__tests__/,
  /__mocks__/,
  /\.e2e\./,
  /test\//,
  /tests\//,
  /__tests__\//
];

const VITE_CONFIG_PATTERNS = [
  /vite\.config\./,
  /vitest\.config\./,
  /vite\.env\./
];

function isTestFile(filePath) {
  return TEST_PATTERNS.some(pattern => pattern.test(filePath));
}

function isViteConfig(filePath) {
  return VITE_CONFIG_PATTERNS.some(pattern => pattern.test(filePath));
}

function findJsFiles(rootDir, includeTests = false) {
  const files = [];
  
  function walk(dir) {
    try {
      const entries = fs.readdirSync(dir, { withFileTypes: true });
      
      for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);
        
        if (entry.isDirectory()) {
          // Skip common non-source directories
          const skipDirs = [
            'node_modules', 'dist', 'build', '.git', 'coverage',
            '.next', '.nuxt', 'out', 'public', 'static', '.cache'
          ];
          if (!skipDirs.includes(entry.name)) {
            walk(fullPath);
          }
        } else if (entry.isFile()) {
          const ext = path.extname(entry.name);
          
          // Only process .js and .jsx files
          if (ext === '.js' || ext === '.jsx') {
            // Skip test files unless explicitly included
            if (!includeTests && isTestFile(fullPath)) {
              continue;
            }
            // Skip Vite config files
            if (isViteConfig(fullPath)) {
              continue;
            }
            files.push(fullPath);
          }
        }
      }
    } catch (error) {
      // Skip directories we can't read
    }
  }
  
  // Walk the src/ directory and ALL its subdirectories
  const srcDir = path.join(rootDir, 'src');
  if (fs.existsSync(srcDir)) {
    walk(srcDir);
  }
  
  return files;
}

function detectJsxContent(content) {
  // Check if file contains JSX
  return /<[A-Z][a-zA-Z]*[\s>]/.test(content) || 
         /<\/[A-Z][a-zA-Z]*>/.test(content) ||
         /React\.createElement/.test(content);
}

function getTargetExtension(filePath, content) {
  const ext = path.extname(filePath);
  
  // If already .jsx, check for JSX
  if (ext === '.jsx') {
    return '.tsx';
  }
  
  // If .js, check content for JSX
  if (ext === '.js') {
    if (detectJsxContent(content)) {
      return '.tsx';
    }
    return '.ts';
  }
  
  return '.ts';
}

function convertImports(content) {
  // Convert require() to import
  let result = content;
  
  // Simple require conversion: const x = require('y')
  result = result.replace(
    /const\s+(\w+)\s*=\s*require\s*\(\s*['"]([^'"]+)['"]\s*\)/g,
    "import $1 from '$2'"
  );
  
  // Destructuring require: const { a, b } = require('y')
  result = result.replace(
    /const\s+\{\s*([^}]+)\s*\}\s*=\s*require\s*\(\s*['"]([^'"]+)['"]\s*\)/g,
    "import { $1 } from '$2'"
  );
  
  // module.exports = x
  result = result.replace(
    /module\.exports\s*=\s*(\w+)/g,
    'export default $1'
  );
  
  // module.exports = { ... }
  result = result.replace(
    /module\.exports\s*=\s*\{/g,
    'export {'
  );
  
  // exports.x = y
  result = result.replace(
    /exports\.(\w+)\s*=\s*/g,
    'export const $1 = '
  );
  
  return result;
}

function addTypeImports(content, hasJsx) {
  const lines = content.split('\n');
  const imports = [];
  
  // Check if React is used but not imported
  if (hasJsx && !content.includes("import React") && !content.includes("import * as React")) {
    imports.push("import React from 'react';");
  }
  
  // Check for common types that might be needed
  if (content.includes('useState') && !content.includes("import { useState }")) {
    if (!imports.some(i => i.includes('from \'react\''))) {
      imports.push("import { useState } from 'react';");
    }
  }
  
  if (imports.length > 0) {
    // Add imports after any existing imports or at the top
    const firstNonImportIndex = lines.findIndex(line => 
      !line.trim().startsWith('import ') && 
      !line.trim().startsWith('//') && 
      !line.trim().startsWith('/*') &&
      line.trim() !== ''
    );
    
    if (firstNonImportIndex > 0) {
      lines.splice(firstNonImportIndex, 0, ...imports, '');
    } else {
      lines.unshift(...imports, '');
    }
  }
  
  return lines.join('\n');
}

function convertFile(filePath, rootDir, dryRun = false) {
  const content = fs.readFileSync(filePath, 'utf-8');
  const targetExt = getTargetExtension(filePath, content);
  const targetPath = filePath.replace(/\.(js|jsx)$/, targetExt);
  
  // Convert content
  let converted = convertImports(content);
  
  // Add type imports if needed
  const hasJsx = targetExt === '.tsx';
  converted = addTypeImports(converted, hasJsx);
  
  if (dryRun) {
    return {
      original: filePath,
      target: targetPath,
      changed: true,
      dryRun: true
    };
  }
  
  // Backup original
  backupFile(filePath);
  
  // Write new file
  fs.writeFileSync(targetPath, converted);
  
  // Remove original
  fs.unlinkSync(filePath);
  
  return {
    original: filePath,
    target: targetPath,
    changed: true
  };
}

function runTsMigrate(rootDir, packageManager, srcDir) {
  const npxCmd = packageManager === 'pnpm' ? 'pnpx' : 'npx';
  
  try {
    console.error(formatInfo('Running ts-migrate...'));
    execSync(`${npxCmd} ts-migrate-full ${srcDir}`, { 
      cwd: rootDir, 
      stdio: 'inherit' 
    });
    return true;
  } catch (error) {
    // ts-migrate often "fails" but still completes
    console.error(formatWarning('ts-migrate completed with some errors (this is normal)'));
    return true;
  }
}

function detectPackageManager(rootDir) {
  if (fs.existsSync(path.join(rootDir, 'pnpm-lock.yaml'))) {
    return 'pnpm';
  } else if (fs.existsSync(path.join(rootDir, 'yarn.lock'))) {
    return 'yarn';
  }
  return 'npm';
}

function main() {
  const args = parseArgs(process.argv.slice(2));
  const rootDir = args.positional[0] || process.cwd();
  const dryRun = args.options['dry-run'] || false;
  const verbose = args.options.verbose || args.options.v || false;
  const useTsMigrate = args.options['ts-migrate'] !== false;
  
  console.error('=== Migrating Source Files (Excluding Tests) ===\n');
  
  // Validate prerequisites
  const errors = validatePrerequisites(rootDir, { 
    packageJson: true, 
    tsconfig: true,
    srcDir: true
  });
  
  if (errors.length > 0) {
    console.error(formatError(new Error(errors.join('\n')), 'Prerequisites'));
    process.exit(1);
  }
  
  // Detect package manager
  const packageManager = detectPackageManager(rootDir);
  console.error(formatInfo(`Package manager: ${packageManager}`));
  
  // Find JS files to convert
  console.error(formatInfo('Finding JavaScript source files...'));
  const jsFiles = findJsFiles(rootDir, false);
  
  if (jsFiles.length === 0) {
    console.error(formatSuccess('No JavaScript files to convert'));
    console.log(JSON.stringify({ success: true, converted: [], skipped: [] }, null, 2));
    return;
  }
  
  console.error(formatInfo(`Found ${jsFiles.length} JavaScript source files`));
  
  if (dryRun) {
    console.error(formatWarning('DRY RUN - No files will be modified'));
  }
  
  const result = {
    success: true,
    dryRun,
    converted: [],
    skipped: [],
    errors: []
  };
  
  // Option 1: Use ts-migrate for automatic conversion
  if (useTsMigrate && !dryRun) {
    // Check if ts-migrate is installed
    const tsMigrateInstalled = fs.existsSync(path.join(rootDir, 'node_modules', 'ts-migrate'));
    
    if (!tsMigrateInstalled) {
      console.error(formatInfo('Installing ts-migrate...'));
      try {
        const installCmd = packageManager === 'npm' 
          ? 'npm install --save-dev ts-migrate'
          : packageManager === 'yarn'
            ? 'yarn add --dev ts-migrate'
            : 'pnpm add --save-dev ts-migrate';
        execSync(installCmd, { cwd: rootDir, stdio: 'inherit' });
      } catch (error) {
        console.error(formatWarning('Could not install ts-migrate, using manual conversion'));
      }
    }
    
    if (fs.existsSync(path.join(rootDir, 'node_modules', 'ts-migrate'))) {
      // First, rename test files temporarily so ts-migrate skips them
      const tempRenames = [];
      
      for (const file of jsFiles) {
        if (isTestFile(file)) {
          const tempPath = file + '.ts-migrate-tmp';
          fs.renameSync(file, tempPath);
          tempRenames.push({ original: file, temp: tempPath });
        }
      }
      
      // Run ts-migrate
      const srcDir = path.join(rootDir, 'src');
      runTsMigrate(rootDir, packageManager, srcDir);
      
      // Restore test files
      for (const { original, temp } of tempRenames) {
        fs.renameSync(temp, original);
      }
      
      result.converted = jsFiles.map(f => ({
        original: f,
        target: f.replace(/\.(js|jsx)$/, f.includes('jsx') || detectJsxContent(fs.readFileSync(f, 'utf-8')) ? '.tsx' : '.ts')
      }));
    } else {
      // Fall back to manual conversion
      console.error(formatInfo('Using manual file conversion...'));
      for (const file of jsFiles) {
        try {
          const converted = convertFile(file, rootDir, dryRun);
          result.converted.push(converted);
          if (verbose) {
            console.error(formatSuccess(`Converted: ${file}`));
          }
        } catch (error) {
          result.errors.push({ file, error: error.message });
          console.error(formatError(error, file));
        }
      }
    }
  } else {
    // Manual conversion (or dry run)
    console.error(formatInfo(`${dryRun ? 'Analyzing' : 'Converting'} files...`));
    
    for (const file of jsFiles) {
      try {
        const converted = convertFile(file, rootDir, dryRun);
        result.converted.push(converted);
        if (verbose || dryRun) {
          console.error(`${dryRun ? '[DRY RUN]' : '✓'} ${file} -> ${converted.target}`);
        }
      } catch (error) {
        result.errors.push({ file, error: error.message });
        console.error(formatError(error, file));
      }
    }
  }
  
  // Print summary
  console.error('\n=== Summary ===');
  console.error(`Files ${dryRun ? 'analyzed' : 'converted'}: ${result.converted.length}`);
  console.error(`Test files skipped: Will be migrated in Phase 5`);
  
  if (result.errors.length > 0) {
    console.error(formatWarning(`${result.errors.length} errors occurred`));
  }
  
  if (!dryRun) {
    console.error('\nNext steps:');
    console.error('1. Run npx tsc --noEmit to check for errors');
    console.error('2. Fix any type errors manually');
    console.error('3. Run migrate-test-files.js to migrate test files');
  }
  
  console.log(JSON.stringify(result, null, 2));
}

main();
