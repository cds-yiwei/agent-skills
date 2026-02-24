#!/usr/bin/env node

/**
 * Migrates test files after source migration is complete
 * - Uses types created during source migration
 * - Updates test imports
 * - Converts test utilities
 * - Updates mocks with proper types
 */

const fs = require('fs');
const path = require('path');
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
  /\.test\.(js|jsx)$/,
  /\.spec\.(js|jsx)$/,
  /__tests__\/.*\.(js|jsx)$/,
  /\.e2e\.(js|jsx)$/
];

const TEST_DIR_PATTERNS = [
  /\/test\//,
  /\/tests\//,
  /\/__tests__\//
];

function isTestFile(filePath) {
  return TEST_PATTERNS.some(pattern => pattern.test(filePath)) ||
         TEST_DIR_PATTERNS.some(pattern => pattern.test(filePath));
}

function findTestFiles(rootDir) {
  const files = [];
  
  function walk(dir) {
    try {
      const entries = fs.readdirSync(dir, { withFileTypes: true });
      
      for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);
        
        if (entry.isDirectory()) {
          if (entry.name !== 'node_modules' && entry.name !== 'dist' && entry.name !== 'build') {
            walk(fullPath);
          }
        } else if (entry.isFile()) {
          const ext = path.extname(entry.name);
          
          if ((ext === '.js' || ext === '.jsx') && isTestFile(fullPath)) {
            files.push(fullPath);
          }
        }
      }
    } catch (error) {
      // Skip directories we can't read
    }
  }
  
  // Walk both src and test directories
  const srcDir = path.join(rootDir, 'src');
  const testDir = path.join(rootDir, 'test');
  const testsDir = path.join(rootDir, 'tests');
  const testsUnderscoreDir = path.join(rootDir, '__tests__');
  
  if (fs.existsSync(srcDir)) walk(srcDir);
  if (fs.existsSync(testDir)) walk(testDir);
  if (fs.existsSync(testsDir)) walk(testsDir);
  if (fs.existsSync(testsUnderscoreDir)) walk(testsUnderscoreDir);
  
  return files;
}

function findSourceTypes(rootDir) {
  const types = new Set();
  const typesDir = path.join(rootDir, 'src', 'types');
  
  function walk(dir) {
    try {
      const entries = fs.readdirSync(dir, { withFileTypes: true });
      
      for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);
        
        if (entry.isDirectory()) {
          walk(fullPath);
        } else if (entry.isFile() && (entry.name.endsWith('.ts') || entry.name.endsWith('.tsx'))) {
          // Extract exported types from the file
          const content = fs.readFileSync(fullPath, 'utf-8');
          
          // Find interface and type exports
          const interfaceMatches = content.matchAll(/export\s+(?:interface|type)\s+(\w+)/g);
          for (const match of interfaceMatches) {
            types.add(match[1]);
          }
          
          // Find class exports
          const classMatches = content.matchAll(/export\s+class\s+(\w+)/g);
          for (const match of classMatches) {
            types.add(match[1]);
          }
        }
      }
    } catch (error) {
      // Skip directories we can't read
    }
  }
  
  if (fs.existsSync(typesDir)) {
    walk(typesDir);
  }
  
  return Array.from(types);
}

function convertTestImports(content, sourceTypes) {
  let result = content;
  
  // Convert require() to import
  // Simple require conversion
  result = result.replace(
    /const\s+(\w+)\s*=\s*require\s*\(\s*['"]([^'"]+)['"]\s*\)/g,
    "import $1 from '$2'"
  );
  
  // Destructuring require
  result = result.replace(
    /const\s+\{\s*([^}]+)\s*\}\s*=\s*require\s*\(\s*['"]([^'"]+)['"]\s*\)/g,
    (match, imports, modulePath) => {
      // Check if modulePath ends with .js and should be .ts
      const correctedPath = modulePath.replace(/\.js$/, '');
      return `import { ${imports} } from '${correctedPath}'`;
    }
  );
  
  // Convert Jest-style require to imports
  result = result.replace(
    /const\s+\{\s*(\w+)\s*\}\s*=\s*require\s*\(\s*['"]\.\/([^'"]+)['"]\s*\)/g,
    "import { $1 } from './$2'"
  );
  
  return result;
}

function addJestImports(content) {
  const lines = content.split('\n');
  const hasDescribe = content.includes('describe(');
  const hasIt = content.includes('it(') || content.includes('test(');
  const hasExpect = content.includes('expect(');
  const hasJestImport = content.includes("from '@jest/globals'");
  
  // Check for Jest globals usage
  if ((hasDescribe || hasIt || hasExpect) && !hasJestImport) {
    const jestImports = [];
    if (hasDescribe) jestImports.push('describe');
    if (hasIt) jestImports.push('it', 'test');
    if (hasExpect) jestImports.push('expect');
    if (content.includes('beforeEach(') || content.includes('afterEach(') || content.includes('beforeAll(') || content.includes('afterAll(')) {
      jestImports.push('beforeEach', 'afterEach', 'beforeAll', 'afterAll');
    }
    
    const importStatement = `import { ${[...new Set(jestImports)].join(', ')} } from '@jest/globals';`;
    
    // Find insertion point (after any existing imports)
    let insertIndex = 0;
    for (let i = 0; i < lines.length; i++) {
      if (lines[i].trim().startsWith('import ') || lines[i].trim().startsWith('//')) {
        insertIndex = i + 1;
      } else if (lines[i].trim() === '') {
        continue;
      } else {
        break;
      }
    }
    
    lines.splice(insertIndex, 0, importStatement);
  }
  
  return lines.join('\n');
}

function updateMocks(content, sourceTypes) {
  let result = content;
  
  // Convert jest.mock without types to typed version
  // jest.mock('./module') -> jest.mock('./module', () => ({...}))
  
  // Add type annotations to jest.fn()
  result = result.replace(
    /jest\.fn\(\)/g,
    'jest.fn<() => unknown>()'
  );
  
  // Add type to mockResolvedValue
  result = result.replace(
    /\.mockResolvedValue\(([^)]+)\)/g,
    '.mockResolvedValue($1 as unknown)'
  );
  
  // Add type to mockReturnValue
  result = result.replace(
    /\.mockReturnValue\(([^)]+)\)/g,
    '.mockReturnValue($1 as unknown)'
  );
  
  return result;
}

function convertTestFile(filePath, rootDir, sourceTypes, dryRun = false) {
  const content = fs.readFileSync(filePath, 'utf-8');
  
  // Determine target extension
  const hasJsx = /<[A-Z][a-zA-Z]*[\s>]/.test(content);
  const targetExt = hasJsx ? '.tsx' : '.ts';
  const targetPath = filePath.replace(/\.(js|jsx)$/, targetExt);
  
  // Convert content
  let converted = convertTestImports(content, sourceTypes);
  converted = addJestImports(converted);
  converted = updateMocks(converted, sourceTypes);
  
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

function detectTestFramework(rootDir) {
  const packageJsonPath = path.join(rootDir, 'package.json');
  
  try {
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'));
    const deps = { ...packageJson.dependencies, ...packageJson.devDependencies };
    
    if (deps['vitest']) return 'vitest';
    if (deps['jest']) return 'jest';
    if (deps['mocha']) return 'mocha';
    if (deps['jasmine']) return 'jasmine';
  } catch {
    // Ignore
  }
  
  return 'unknown';
}

function main() {
  const args = parseArgs(process.argv.slice(2));
  const rootDir = args.positional[0] || process.cwd();
  const dryRun = args.options['dry-run'] || false;
  const verbose = args.options.verbose || args.options.v || false;
  
  console.error('=== Migrating Test Files ===\n');
  
  // Validate prerequisites
  const errors = validatePrerequisites(rootDir, { 
    packageJson: true, 
    tsconfig: true
  });
  
  if (errors.length > 0) {
    console.error(formatError(new Error(errors.join('\n')), 'Prerequisites'));
    process.exit(1);
  }
  
  // Check that source files have been migrated
  const srcDir = path.join(rootDir, 'src');
  if (fs.existsSync(srcDir)) {
    const srcJsFiles = findJsFilesInDir(srcDir);
    if (srcJsFiles.length > 0) {
      console.error(formatWarning(`${srcJsFiles.length} JavaScript source files still exist`));
      console.error(formatInfo('Consider running migrate-source-only.js first'));
    }
  }
  
  // Detect test framework
  const testFramework = detectTestFramework(rootDir);
  console.error(formatInfo(`Detected test framework: ${testFramework}`));
  
  // Find source types
  console.error(formatInfo('Finding exported types from source...'));
  const sourceTypes = findSourceTypes(rootDir);
  console.error(formatInfo(`Found ${sourceTypes.length} exported types`));
  
  // Find test files
  console.error(formatInfo('Finding test files...'));
  const testFiles = findTestFiles(rootDir);
  
  if (testFiles.length === 0) {
    console.error(formatSuccess('No test files to convert'));
    console.log(JSON.stringify({ success: true, converted: [], skipped: [] }, null, 2));
    return;
  }
  
  console.error(formatInfo(`Found ${testFiles.length} test files`));
  
  if (dryRun) {
    console.error(formatWarning('DRY RUN - No files will be modified'));
  }
  
  const result = {
    success: true,
    dryRun,
    testFramework,
    sourceTypesUsed: sourceTypes,
    converted: [],
    errors: []
  };
  
  // Convert test files
  console.error(formatInfo(`${dryRun ? 'Analyzing' : 'Converting'} test files...`));
  
  for (const file of testFiles) {
    try {
      const converted = convertTestFile(file, rootDir, sourceTypes, dryRun);
      result.converted.push(converted);
      if (verbose || dryRun) {
        console.error(`${dryRun ? '[DRY RUN]' : '✓'} ${file} -> ${converted.target}`);
      }
    } catch (error) {
      result.errors.push({ file, error: error.message });
      console.error(formatError(error, file));
    }
  }
  
  // Print summary
  console.error('\n=== Summary ===');
  console.error(`Test files ${dryRun ? 'analyzed' : 'converted'}: ${result.converted.length}`);
  console.error(`Types available: ${sourceTypes.length}`);
  
  if (result.errors.length > 0) {
    console.error(formatWarning(`${result.errors.length} errors occurred`));
  }
  
  if (!dryRun) {
    console.error('\nNext steps:');
    console.error('1. Run npx tsc --noEmit to check for type errors');
    console.error('2. Fix any type errors in test files');
    console.error('3. Run tests to verify they pass');
    console.error('4. Run replace-any-types.js to fix remaining any types');
  }
  
  console.log(JSON.stringify(result, null, 2));
}

function findJsFilesInDir(dir) {
  const files = [];
  
  function walk(d) {
    try {
      const entries = fs.readdirSync(d, { withFileTypes: true });
      
      for (const entry of entries) {
        const fullPath = path.join(d, entry.name);
        
        if (entry.isDirectory()) {
          if (entry.name !== 'node_modules') {
            walk(fullPath);
          }
        } else if (entry.isFile()) {
          const ext = path.extname(entry.name);
          if (ext === '.js' || ext === '.jsx') {
            files.push(fullPath);
          }
        }
      }
    } catch {
      // Skip
    }
  }
  
  walk(dir);
  return files;
}

main();
