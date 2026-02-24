#!/usr/bin/env node

/**
 * Analyzes source files to detect missing types before migration
 * - Detects missing @types/* packages
 * - Identifies implicit any usage patterns
 * - Finds API response shapes needing interfaces
 * - Discovers common object patterns
 * 
 * Excludes test files by default
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

const COMMON_TYPE_PATTERNS = {
  apiResponse: /(?:response|Response|res)\s*[.:]\s*(?:await\s+)?(?:fetch|axios|http)/,
  pagination: /(?:page|limit|offset|pageSize|totalPages|totalCount)/,
  error: /(?:error|Error)\s*[.:]/,
  user: /(?:user|User)\s*[.:]\s*\{/,
  config: /(?:config|Config|options|Options)\s*[.:]\s*\{/,
  event: /(?:event|e)\s*[.:]\s*(?:preventDefault|stopPropagation|target)/
};

function isTestFile(filePath) {
  return TEST_PATTERNS.some(pattern => pattern.test(filePath));
}

function findSourceFiles(rootDir, includeTests = false) {
  const files = [];
  const extensions = ['.js', '.jsx', '.ts', '.tsx'];
  
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
          if (extensions.includes(ext)) {
            if (includeTests || !isTestFile(fullPath)) {
              files.push(fullPath);
            }
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
  
  return files;
}

function analyzeFile(filePath) {
  const result = {
    file: filePath,
    imports: [],
    implicitAny: [],
    objectPatterns: [],
    functionSignatures: [],
    apiPatterns: []
  };
  
  try {
    const content = fs.readFileSync(filePath, 'utf-8');
    const lines = content.split('\n');
    
    // Track imports
    const importRegex = /import\s+(?:\{[^}]+\}|[\w*]+)\s+from\s+['"]([^'"]+)['"]/g;
    let match;
    while ((match = importRegex.exec(content)) !== null) {
      result.imports.push(match[1]);
    }
    
    // Also track require()
    const requireRegex = /require\s*\(\s*['"]([^'"]+)['"]\s*\)/g;
    while ((match = requireRegex.exec(content)) !== null) {
      result.imports.push(match[1]);
    }
    
    lines.forEach((line, index) => {
      const lineNum = index + 1;
      
      // Detect implicit any patterns
      if (/\bfunction\s+\w+\s*\([^)]*\)\s*\{/.test(line) && !/:\s*\w+/.test(line.split('{')[0])) {
        result.implicitAny.push({
          line: lineNum,
          type: 'function_parameter',
          code: line.trim().substring(0, 80)
        });
      }
      
      // Arrow functions without types
      if (/=>\s*\{/.test(line) && /\([^)]+\)\s*=>/.test(line) && !/:\s*\w+/.test(line.split('=>')[0])) {
        result.implicitAny.push({
          line: lineNum,
          type: 'arrow_function',
          code: line.trim().substring(0, 80)
        });
      }
      
      // Detect common object patterns
      for (const [patternName, regex] of Object.entries(COMMON_TYPE_PATTERNS)) {
        if (regex.test(line)) {
          result.objectPatterns.push({
            line: lineNum,
            pattern: patternName,
            code: line.trim().substring(0, 80)
          });
        }
      }
      
      // API patterns
      if (/(?:fetch|axios|http)\.(?:get|post|put|delete|patch)/.test(line)) {
        result.apiPatterns.push({
          line: lineNum,
          code: line.trim().substring(0, 100)
        });
      }
    });
    
  } catch (error) {
    result.error = error.message;
  }
  
  return result;
}

function detectMissingTypePackages(rootDir, imports) {
  const packageJsonPath = path.join(rootDir, 'package.json');
  const installedTypes = new Set();
  const usedPackages = new Set();
  
  try {
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'));
    const deps = { ...packageJson.dependencies, ...packageJson.devDependencies };
    
    // Find installed @types packages
    for (const dep of Object.keys(deps)) {
      if (dep.startsWith('@types/')) {
        installedTypes.add(dep.replace('@types/', ''));
      }
    }
    
    // Find packages that might need types
    for (const imp of imports) {
      // Skip relative imports
      if (imp.startsWith('.') || imp.startsWith('/')) continue;
      
      // Get package name (handle scoped packages)
      const pkgName = imp.startsWith('@') 
        ? imp.split('/').slice(0, 2).join('/')
        : imp.split('/')[0];
      
      // Check if it's in dependencies
      if (deps[pkgName] && !installedTypes.has(pkgName)) {
        // Check if package has built-in types
        const pkgPath = path.join(rootDir, 'node_modules', pkgName, 'package.json');
        try {
          const pkgJson = JSON.parse(fs.readFileSync(pkgPath, 'utf-8'));
          if (!pkgJson.types && !pkgJson.typings) {
            usedPackages.add(pkgName);
          }
        } catch {
          usedPackages.add(pkgName);
        }
      }
    }
  } catch (error) {
    // package.json read error
  }
  
  return Array.from(usedPackages);
}

function checkNpmForTypes(packages) {
  const available = [];
  const unavailable = [];
  
  for (const pkg of packages) {
    try {
      execSync(`npm view @types/${pkg} version`, { stdio: 'pipe' });
      available.push(pkg);
    } catch {
      unavailable.push(pkg);
    }
  }
  
  return { available, unavailable };
}

function generateReport(rootDir, fileResults, missingTypes, typeAvailability) {
  const report = {
    timestamp: new Date().toISOString(),
    projectPath: rootDir,
    summary: {
      filesAnalyzed: fileResults.length,
      totalImplicitAny: 0,
      objectPatternsFound: {},
      apiPatternsFound: 0,
      missingTypePackages: missingTypes.length
    },
    missingTypes: {
      needsInstall: typeAvailability.available,
      needsDeclaration: typeAvailability.unavailable
    },
    objectPatterns: {},
    apiPatterns: [],
    files: {}
  };
  
  // Aggregate results
  for (const result of fileResults) {
    report.summary.totalImplicitAny += result.implicitAny.length;
    report.summary.apiPatternsFound += result.apiPatterns.length;
    
    for (const pattern of result.objectPatterns) {
      report.summary.objectPatternsFound[pattern.pattern] = 
        (report.summary.objectPatternsFound[pattern.pattern] || 0) + 1;
      
      if (!report.objectPatterns[pattern.pattern]) {
        report.objectPatterns[pattern.pattern] = [];
      }
      report.objectPatterns[pattern.pattern].push({
        file: result.file,
        line: pattern.line
      });
    }
    
    for (const api of result.apiPatterns) {
      report.apiPatterns.push({
        file: result.file,
        line: api.line
      });
    }
    
    if (result.implicitAny.length > 0 || result.apiPatterns.length > 0) {
      report.files[result.file] = {
        implicitAny: result.implicitAny,
        apiPatterns: result.apiPatterns
      };
    }
  }
  
  return report;
}

function main() {
  const args = parseArgs(process.argv.slice(2));
  const rootDir = args.positional[0] || process.cwd();
  const includeTests = args.options['include-tests'] || false;
  const verbose = args.options.verbose || args.options.v || false;
  
  console.error('=== Analyzing Missing Types ===\n');
  
  // Validate prerequisites
  const errors = validatePrerequisites(rootDir, { packageJson: true });
  if (errors.length > 0) {
    console.error(formatError(new Error(errors.join('\n')), 'Prerequisites'));
    process.exit(1);
  }
  
  // Find source files
  console.error(formatInfo('Finding source files...'));
  const files = findSourceFiles(rootDir, includeTests);
  console.error(formatSuccess(`Found ${files.length} source files (${includeTests ? 'including' : 'excluding'} tests)`));
  
  // Analyze files
  console.error(formatInfo('Analyzing files for missing types...'));
  const fileResults = [];
  const allImports = new Set();
  
  for (const file of files) {
    if (verbose) {
      console.error(`  Analyzing: ${file}`);
    }
    const result = analyzeFile(file);
    fileResults.push(result);
    result.imports.forEach(imp => allImports.add(imp));
  }
  
  // Detect missing type packages
  console.error(formatInfo('Checking for missing @types packages...'));
  const missingTypes = detectMissingTypePackages(rootDir, Array.from(allImports));
  
  if (missingTypes.length > 0) {
    console.error(formatWarning(`${missingTypes.length} packages may need type definitions`));
    
    // Check npm for availability
    const typeAvailability = checkNpmForTypes(missingTypes);
    
    if (typeAvailability.available.length > 0) {
      console.error(formatSuccess(`@types available for: ${typeAvailability.available.join(', ')}`));
    }
    
    if (typeAvailability.unavailable.length > 0) {
      console.error(formatWarning(`No @types found for: ${typeAvailability.unavailable.join(', ')}`));
    }
    
    // Generate report
    const report = generateReport(rootDir, fileResults, missingTypes, typeAvailability);
    
    // Save report
    const reportPath = path.join(rootDir, '.migration-missing-types.json');
    fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
    console.error(formatSuccess(`Report saved to .migration-missing-types.json`));
    
    // Print summary
    console.error('\n=== Summary ===');
    console.error(`Files analyzed: ${report.summary.filesAnalyzed}`);
    console.error(`Implicit any patterns: ${report.summary.totalImplicitAny}`);
    console.error(`API patterns found: ${report.summary.apiPatternsFound}`);
    console.error(`Missing @types packages: ${report.summary.missingTypePackages}`);
    
    console.error('\n=== Object Patterns Detected ===');
    for (const [pattern, count] of Object.entries(report.summary.objectPatternsFound)) {
      console.error(`  ${pattern}: ${count} occurrences`);
    }
    
    console.error('\n=== Next Steps ===');
    if (typeAvailability.available.length > 0) {
      console.error('1. Install available type definitions:');
      console.error(`   npm install --save-dev ${typeAvailability.available.map(t => `@types/${t}`).join(' ')}`);
    }
    if (typeAvailability.unavailable.length > 0) {
      console.error('2. Create declaration files for packages without types:');
      typeAvailability.unavailable.forEach(pkg => {
        console.error(`   - Create types/${pkg}.d.ts`);
      });
    }
    console.error('3. Run generate-common-types.js to create common type interfaces');
    
    // Output JSON for programmatic use
    console.log(JSON.stringify(report, null, 2));
  } else {
    console.error(formatSuccess('No missing type packages detected'));
    
    const report = generateReport(rootDir, fileResults, [], { available: [], unavailable: [] });
    const reportPath = path.join(rootDir, '.migration-missing-types.json');
    fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
    
    console.log(JSON.stringify(report, null, 2));
  }
}

main();
