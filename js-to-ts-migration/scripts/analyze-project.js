#!/usr/bin/env node

/**
 * Analyzes project structure and detects:
 * - Project type (React, Vue3, Node, Vanilla)
 * - Build tool (webpack, vite, rollup, parcel)
 * - Test framework (jest, vitest, mocha, jasmine)
 * - Package manager (npm, yarn, pnpm)
 */

const fs = require('fs');
const path = require('path');
const {
  formatError,
  formatSuccess,
  formatInfo,
  formatWarning,
  validatePrerequisites,
  parseArgs
} = require('./error-utils');

const FRAMEWORK_PATTERNS = {
  react: ['react', 'react-dom', 'next', 'gatsby', 'react-scripts'],
  vue3: ['vue', '@vue/runtime-core', 'nuxt', 'vite-plugin-vue'],
  node: ['express', 'fastify', 'koa', '@nestjs/core', 'hapi', 'fastify']
};

const BUILD_TOOLS = {
  vite: ['vite'],
  webpack: ['webpack', 'webpack-cli', 'react-scripts'],
  rollup: ['rollup'],
  parcel: ['parcel', 'parcel-bundler'],
  rspack: ['@rspack/core'],
  esbuild: ['esbuild'],
  turbopack: ['turbo']
};

const TEST_FRAMEWORKS = {
  jest: ['jest'],
  vitest: ['vitest'],
  mocha: ['mocha'],
  jasmine: ['jasmine'],
  ava: ['ava'],
  tape: ['tape']
};

function detectFromPackageJson(rootDir) {
  const packageJsonPath = path.join(rootDir, 'package.json');
  
  if (!fs.existsSync(packageJsonPath)) {
    return null;
  }
  
  try {
    const content = fs.readFileSync(packageJsonPath, 'utf-8');
    const packageJson = JSON.parse(content);
    const deps = { ...packageJson.dependencies, ...packageJson.devDependencies };
    
    return {
      name: packageJson.name,
      version: packageJson.version,
      dependencies: deps,
      scripts: packageJson.scripts || {}
    };
  } catch (error) {
    throw new Error(`Invalid package.json: ${error.message}`);
  }
}

function detectProjectType(deps) {
  for (const [type, packages] of Object.entries(FRAMEWORK_PATTERNS)) {
    for (const pkg of packages) {
      if (deps[pkg]) {
        return type;
      }
    }
  }
  return 'vanilla';
}

function detectBuildTool(deps) {
  for (const [tool, packages] of Object.entries(BUILD_TOOLS)) {
    for (const pkg of packages) {
      if (deps[pkg]) {
        return tool;
      }
    }
  }
  return 'none';
}

function detectTestFramework(deps, scripts) {
  for (const [framework, packages] of Object.entries(TEST_FRAMEWORKS)) {
    for (const pkg of packages) {
      if (deps[pkg]) {
        return framework;
      }
    }
  }
  
  if (scripts.test) {
    if (scripts.test.includes('jest')) return 'jest';
    if (scripts.test.includes('vitest')) return 'vitest';
    if (scripts.test.includes('mocha')) return 'mocha';
  }
  
  return 'none';
}

function detectPackageManager(rootDir) {
  if (fs.existsSync(path.join(rootDir, 'pnpm-lock.yaml'))) {
    return 'pnpm';
  }
  if (fs.existsSync(path.join(rootDir, 'yarn.lock'))) {
    return 'yarn';
  }
  if (fs.existsSync(path.join(rootDir, 'package-lock.json'))) {
    return 'npm';
  }
  if (fs.existsSync(path.join(rootDir, 'bun.lockb'))) {
    return 'bun';
  }
  return 'npm';
}

function detectTypeScriptSetup(rootDir, deps) {
  const hasTypeScript = !!deps['typescript'];
  const hasTsConfig = fs.existsSync(path.join(rootDir, 'tsconfig.json'));
  
  let tsVersion = null;
  if (hasTypeScript) {
    try {
      const tsPackagePath = path.join(rootDir, 'node_modules', 'typescript', 'package.json');
      if (fs.existsSync(tsPackagePath)) {
        const tsPackage = JSON.parse(fs.readFileSync(tsPackagePath, 'utf-8'));
        tsVersion = tsPackage.version;
      }
    } catch {
      // Ignore
    }
  }
  
  return {
    hasTypeScript,
    hasTsConfig,
    tsVersion
  };
}

function countSourceFiles(rootDir) {
  const counts = {
    js: 0,
    jsx: 0,
    ts: 0,
    tsx: 0,
    total: 0
  };
  
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
          if (ext === '.js') counts.js++;
          else if (ext === '.jsx') counts.jsx++;
          else if (ext === '.ts') counts.ts++;
          else if (ext === '.tsx') counts.tsx++;
        }
      }
    } catch {
      // Skip directories we can't read
    }
  }
  
  const srcDir = path.join(rootDir, 'src');
  if (fs.existsSync(srcDir)) {
    walk(srcDir);
  } else {
    walk(rootDir);
  }
  
  counts.total = counts.js + counts.jsx + counts.ts + counts.tsx;
  return counts;
}

function main() {
  const args = parseArgs(process.argv.slice(2));
  const rootDir = args.positional[0] || process.cwd();
  const verbose = args.options.verbose || args.options.v || false;
  
  console.error('=== Project Analysis ===\n');
  
  // Validate prerequisites
  const prereqErrors = validatePrerequisites(rootDir, { packageJson: true });
  if (prereqErrors.length > 0) {
    console.error(formatError(new Error(prereqErrors.join('\n')), 'Prerequisites'));
    process.exit(1);
  }
  
  // Detect package.json
  console.error(formatInfo('Reading package.json...'));
  let packageInfo;
  
  try {
    packageInfo = detectFromPackageJson(rootDir);
  } catch (error) {
    console.error(formatError(error, 'Reading package.json'));
    process.exit(1);
  }
  
  if (!packageInfo) {
    console.error(formatError(new Error('No package.json found'), 'Prerequisites'));
    process.exit(1);
  }
  
  const deps = packageInfo.dependencies;
  
  // Detect project characteristics
  console.error(formatInfo('Detecting project type...'));
  const projectType = detectProjectType(deps);
  
  console.error(formatInfo('Detecting build tool...'));
  const buildTool = detectBuildTool(deps);
  
  console.error(formatInfo('Detecting test framework...'));
  const testFramework = detectTestFramework(deps, packageInfo.scripts);
  
  console.error(formatInfo('Detecting package manager...'));
  const packageManager = detectPackageManager(rootDir);
  
  console.error(formatInfo('Checking TypeScript setup...'));
  const tsSetup = detectTypeScriptSetup(rootDir, deps);
  
  console.error(formatInfo('Counting source files...'));
  const fileCounts = countSourceFiles(rootDir);
  
  // Build analysis result
  const analysis = {
    name: packageInfo.name,
    version: packageInfo.version,
    projectType,
    buildTool,
    testFramework,
    packageManager,
    hasTypeScript: tsSetup.hasTypeScript,
    hasTsConfig: tsSetup.hasTsConfig,
    tsVersion: tsSetup.tsVersion,
    fileCounts,
    dependencies: Object.keys(deps),
    timestamp: new Date().toISOString()
  };
  
  // Save analysis to file
  const outputPath = path.join(rootDir, '.migration-analysis.json');
  try {
    fs.writeFileSync(outputPath, JSON.stringify(analysis, null, 2));
    console.error(formatSuccess(`Analysis saved to .migration-analysis.json`));
  } catch (error) {
    console.error(formatWarning(`Could not save analysis: ${error.message}`));
  }
  
  // Print summary
  console.error('\n=== Analysis Summary ===');
  console.error(`Project Name:    ${analysis.name || 'unnamed'}`);
  console.error(`Project Type:    ${projectType}`);
  console.error(`Build Tool:      ${buildTool}`);
  console.error(`Test Framework:  ${testFramework}`);
  console.error(`Package Manager: ${packageManager}`);
  console.error(`TypeScript:      ${tsSetup.hasTypeScript ? `installed (${tsSetup.tsVersion || 'unknown version'})` : 'not installed'}`);
  console.error(`tsconfig.json:   ${tsSetup.hasTsConfig ? 'exists' : 'missing'}`);
  
  console.error('\n=== File Counts ===');
  console.error(`JavaScript:      ${fileCounts.js + fileCounts.jsx} (${fileCounts.js} .js, ${fileCounts.jsx} .jsx)`);
  console.error(`TypeScript:      ${fileCounts.ts + fileCounts.tsx} (${fileCounts.ts} .ts, ${fileCounts.tsx} .tsx)`);
  console.error(`Total:           ${fileCounts.total}`);
  
  // Migration readiness
  const migrationRate = fileCounts.total > 0 
    ? ((fileCounts.ts + fileCounts.tsx) / fileCounts.total * 100).toFixed(1)
    : 0;
  
  console.error('\n=== Migration Status ===');
  console.error(`Migration Rate:  ${migrationRate}%`);
  
  if (!tsSetup.hasTypeScript) {
    console.error(formatWarning('\nNext steps:'));
    console.error('  1. Install TypeScript: npm install --save-dev typescript');
    console.error('  2. Generate tsconfig: node scripts/generate-tsconfig.js');
  } else if (!tsSetup.hasTsConfig) {
    console.error(formatWarning('\nNext steps:'));
    console.error('  1. Generate tsconfig: node scripts/generate-tsconfig.js');
  } else {
    console.error(formatSuccess('\nProject is ready for migration'));
    console.error('\nNext steps:');
    console.error('  1. Analyze missing types: node scripts/analyze-missing-types.js');
    console.error('  2. Generate common types: node scripts/generate-common-types.js');
    console.error('  3. Migrate source files: node scripts/migrate-source-only.js');
  }
  
  // Output JSON
  console.log(JSON.stringify(analysis, null, 2));
}

main();
