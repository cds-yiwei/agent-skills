#!/usr/bin/env node

/**
 * Validates the environment before migration:
 * - Checks Node.js version
 * - Checks TypeScript version
 * - Verifies required dependencies
 * - Checks for common configuration files
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const {
  formatError,
  formatSuccess,
  formatInfo,
  formatWarning,
  parseArgs
} = require('./error-utils');

const MIN_NODE_VERSION = '14.0.0';
const MIN_TYPESCRIPT_VERSION = '4.5.0';
const RECOMMENDED_TYPESCRIPT_VERSION = '5.0.0';

function parseVersion(versionString) {
  const match = versionString.match(/(\d+)\.(\d+)\.(\d+)/);
  if (!match) return null;
  return {
    major: parseInt(match[1]),
    minor: parseInt(match[2]),
    patch: parseInt(match[3])
  };
}

function compareVersions(v1, v2) {
  if (v1.major !== v2.major) return v1.major - v2.major;
  if (v1.minor !== v2.minor) return v1.minor - v2.minor;
  return v1.patch - v2.patch;
}

function checkNodeVersion() {
  try {
    const version = process.version.replace('v', '');
    const parsed = parseVersion(version);
    const minParsed = parseVersion(MIN_NODE_VERSION);
    
    if (!parsed) {
      return { success: false, version, message: 'Could not parse Node.js version' };
    }
    
    const isCompatible = compareVersions(parsed, minParsed) >= 0;
    
    return {
      success: isCompatible,
      version,
      minimum: MIN_NODE_VERSION,
      message: isCompatible 
        ? `Node.js ${version} is compatible (minimum: ${MIN_NODE_VERSION})`
        : `Node.js ${version} is below minimum ${MIN_NODE_VERSION}. Please upgrade.`
    };
  } catch (error) {
    return { success: false, version: 'unknown', message: error.message };
  }
}

function checkTypeScriptVersion(rootDir) {
  try {
    // Check local TypeScript first
    const localTscPath = path.join(rootDir, 'node_modules', '.bin', 'tsc');
    
    let version;
    if (fs.existsSync(localTscPath)) {
      version = execSync(`${localTscPath} --version`, { encoding: 'utf-8' }).trim();
    } else {
      version = execSync('npx tsc --version', { encoding: 'utf-8' }).trim();
    }
    
    const versionMatch = version.match(/(\d+\.\d+\.\d+)/);
    const versionNumber = versionMatch ? versionMatch[1] : null;
    const parsed = versionNumber ? parseVersion(versionNumber) : null;
    const minParsed = parseVersion(MIN_TYPESCRIPT_VERSION);
    const recParsed = parseVersion(RECOMMENDED_TYPESCRIPT_VERSION);
    
    if (!parsed) {
      return { success: false, version: versionNumber, message: 'Could not parse TypeScript version' };
    }
    
    const isCompatible = compareVersions(parsed, minParsed) >= 0;
    const isRecommended = compareVersions(parsed, recParsed) >= 0;
    
    return {
      success: isCompatible,
      version: versionNumber,
      minimum: MIN_TYPESCRIPT_VERSION,
      recommended: RECOMMENDED_TYPESCRIPT_VERSION,
      isRecommended,
      message: isCompatible
        ? `TypeScript ${versionNumber} is compatible${isRecommended ? ' (recommended)' : ''}`
        : `TypeScript ${versionNumber} is below minimum ${MIN_TYPESCRIPT_VERSION}. Run: npm install --save-dev typescript@latest`
    };
  } catch (error) {
    return { 
      success: false, 
      version: 'not installed',
      message: 'TypeScript not found. Run: npm install --save-dev typescript'
    };
  }
}

function checkPackageJson(rootDir) {
  const packageJsonPath = path.join(rootDir, 'package.json');
  
  if (!fs.existsSync(packageJsonPath)) {
    return { success: false, message: 'No package.json found. Not a Node.js project?' };
  }
  
  try {
    const content = fs.readFileSync(packageJsonPath, 'utf-8');
    const packageJson = JSON.parse(content);
    
    return {
      success: true,
      name: packageJson.name || 'unnamed',
      version: packageJson.version || '0.0.0',
      hasScripts: !!packageJson.scripts,
      hasTestScript: !!(packageJson.scripts && packageJson.scripts.test),
      message: `package.json found: ${packageJson.name || 'unnamed'}@${packageJson.version || '0.0.0'}`
    };
  } catch (error) {
    return { success: false, message: `Invalid package.json: ${error.message}` };
  }
}

function checkTsConfig(rootDir) {
  const tsconfigPath = path.join(rootDir, 'tsconfig.json');
  
  if (!fs.existsSync(tsconfigPath)) {
    return { 
      success: false, 
      exists: false,
      message: 'No tsconfig.json found. Run: node scripts/generate-tsconfig.js' 
    };
  }
  
  try {
    const content = fs.readFileSync(tsconfigPath, 'utf-8');
    const tsconfig = JSON.parse(content);
    
    const options = tsconfig.compilerOptions || {};
    const issues = [];
    
    // Check for important compiler options
    if (!options.strict && options.strict !== false) {
      issues.push('strict mode not explicitly set');
    }
    
    if (!optionsesModuleInterop && !options.allowSyntheticDefaultImports) {
      issues.push('esModuleInterop not enabled');
    }
    
    return {
      success: true,
      exists: true,
      strict: options.strict,
      target: options.target,
      module: options.module,
      jsx: options.jsx,
      issues: issues.length > 0 ? issues : undefined,
      message: issues.length > 0 
        ? `tsconfig.json found with ${issues.length} suggestions`
        : 'tsconfig.json is properly configured'
    };
  } catch (error) {
    return { success: false, exists: true, message: `Invalid tsconfig.json: ${error.message}` };
  }
}

function checkSourceDirectory(rootDir) {
  const srcDir = path.join(rootDir, 'src');
  
  if (!fs.existsSync(srcDir)) {
    return { success: false, message: 'No src/ directory found' };
  }
  
  try {
    const entries = fs.readdirSync(srcDir, { withFileTypes: true });
    const files = entries.filter(e => e.isFile());
    const dirs = entries.filter(e => e.isDirectory());
    
    const jsFiles = files.filter(f => f.name.endsWith('.js') || f.name.endsWith('.jsx'));
    const tsFiles = files.filter(f => f.name.endsWith('.ts') || f.name.endsWith('.tsx'));
    
    return {
      success: true,
      totalFiles: files.length,
      jsFiles: jsFiles.length,
      tsFiles: tsFiles.length,
      directories: dirs.length,
      alreadyMigrated: tsFiles.length > 0 && jsFiles.length === 0,
      message: jsFiles.length > 0
        ? `src/ contains ${jsFiles.length} JS files to migrate, ${tsFiles.length} TS files already`
        : tsFiles.length > 0
          ? `src/ contains ${tsFiles.length} TS files (migration may be in progress)`
          : `src/ contains ${files.length} files`
    };
  } catch (error) {
    return { success: false, message: `Could not read src/: ${error.message}` };
  }
}

function checkDependencies(rootDir) {
  const packageJsonPath = path.join(rootDir, 'package.json');
  const missing = [];
  const installed = [];
  
  try {
    const content = fs.readFileSync(packageJsonPath, 'utf-8');
    const packageJson = JSON.parse(content);
    const deps = { ...packageJson.dependencies, ...packageJson.devDependencies };
    
    // Check for essential dependencies
    const essentialDeps = ['typescript'];
    const recommendedDeps = ['ts-node', '@types/node'];
    
    for (const dep of essentialDeps) {
      if (deps[dep]) {
        installed.push(dep);
      } else {
        missing.push(dep);
      }
    }
    
    const recommendedMissing = recommendedDeps.filter(d => !deps[d]);
    
    return {
      success: missing.length === 0,
      installed,
      missing,
      recommendedMissing,
      message: missing.length === 0
        ? 'All essential dependencies installed'
        : `Missing dependencies: ${missing.join(', ')}`
    };
  } catch (error) {
    return { success: false, message: `Could not check dependencies: ${error.message}` };
  }
}

function checkPackageManager(rootDir) {
  const lockFiles = {
    'package-lock.json': 'npm',
    'yarn.lock': 'yarn',
    'pnpm-lock.yaml': 'pnpm'
  };
  
  for (const [file, manager] of Object.entries(lockFiles)) {
    if (fs.existsSync(path.join(rootDir, file))) {
      return {
        success: true,
        manager,
        lockFile: file,
        message: `Detected package manager: ${manager}`
      };
    }
  }
  
  return {
    success: true,
    manager: 'npm',
    lockFile: null,
    message: 'No lock file found, defaulting to npm'
  };
}

function main() {
  const args = parseArgs(process.argv.slice(2));
  const rootDir = args.positional[0] || process.cwd();
  const verbose = args.options.verbose || args.options.v || false;
  const json = args.options.json || false;
  
  const results = {
    valid: true,
    checks: {}
  };
  
  console.error('=== Validating Environment ===\n');
  
  // Run all checks
  results.checks.node = checkNodeVersion();
  results.checks.typescript = checkTypeScriptVersion(rootDir);
  results.checks.packageJson = checkPackageJson(rootDir);
  results.checks.tsconfig = checkTsConfig(rootDir);
  results.checks.sourceDir = checkSourceDirectory(rootDir);
  results.checks.dependencies = checkDependencies(rootDir);
  results.checks.packageManager = checkPackageManager(rootDir);
  
  // Determine overall validity
  for (const [name, check] of Object.entries(results.checks)) {
    if (!check.success) {
      results.valid = false;
    }
  }
  
  // Print results
  if (!json) {
    for (const [name, check] of Object.entries(results.checks)) {
      const status = check.success ? formatSuccess('✓') : formatError('✗');
      console.error(`${status} ${name}: ${check.message}`);
      
      if (verbose && check.issues) {
        check.issues.forEach(issue => {
          console.error(`    - ${issue}`);
        });
      }
    }
    
    console.error('\n=== Result ===');
    if (results.valid) {
      console.error(formatSuccess('Environment is ready for migration'));
    } else {
      console.error(formatWarning('Environment has issues. Please fix before proceeding.'));
      console.error('\nQuick fixes:');
      
      if (!results.checks.typescript.success) {
        console.error('  npm install --save-dev typescript');
      }
      if (!results.checks.tsconfig.exists) {
        console.error('  node scripts/generate-tsconfig.js');
      }
    }
  }
  
  // Output JSON
  console.log(JSON.stringify(results, null, 2));
  
  process.exit(results.valid ? 0 : 1);
}

main();
