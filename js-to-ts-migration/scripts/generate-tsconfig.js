#!/usr/bin/env node

/**
 * Generates migration-friendly tsconfig.json
 * Supports --strict flag for post-migration strict mode
 * Framework-specific configurations
 * TypeScript 5.x compatible
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

const baseConfig = {
  compilerOptions: {
    target: 'ES2022',
    module: 'ESNext',
    lib: ['ES2022', 'DOM'],
    allowJs: true,
    checkJs: false,
    jsx: 'react-jsx',
    declaration: true,
    declarationMap: true,
    sourceMap: true,
    outDir: './dist',
    rootDir: './src',
    removeComments: true,
    strict: false,
    noImplicitAny: false,
    strictNullChecks: false,
    strictFunctionTypes: false,
    noUnusedLocals: false,
    noUnusedParameters: false,
    noImplicitReturns: false,
    noFallthroughCasesInSwitch: false,
    moduleResolution: 'bundler',
    baseUrl: '.',
    paths: {},
    allowSyntheticDefaultImports: true,
    esModuleInterop: true,
    experimentalDecorators: true,
    emitDecoratorMetadata: true,
    skipLibCheck: true,
    forceConsistentCasingInFileNames: true,
    resolveJsonModule: true,
    isolatedModules: true,
    resolvePackageJsonImports: true,
    resolvePackageJsonExports: true
  },
  include: ['src/**/*'],
  exclude: ['node_modules', 'dist', '**/*.test.js', '**/*.test.ts']
};

const frameworkConfigs = {
  react: {
    compilerOptions: {
      ...baseConfig.compilerOptions,
      jsx: 'react-jsx',
      lib: ['ES2022', 'DOM', 'DOM.Iterable']
    },
    include: ['src/**/*'],
    exclude: ['node_modules', 'dist', '**/*.test.{js,ts,jsx,tsx}']
  },
  vue3: {
    compilerOptions: {
      ...baseConfig.compilerOptions,
      jsx: 'preserve',
      lib: ['ES2022', 'DOM', 'DOM.Iterable']
    },
    include: ['src/**/*', 'env.d.ts'],
    exclude: ['node_modules', 'dist', '**/*.test.{js,ts}']
  },
  node: {
    compilerOptions: {
      ...baseConfig.compilerOptions,
      lib: ['ES2022'],
      jsx: undefined,
      module: 'NodeNext',
      moduleResolution: 'NodeNext'
    },
    include: ['src/**/*'],
    exclude: ['node_modules', 'dist', '**/*.test.{js,ts}']
  },
  vanilla: baseConfig
};

function generateStrictConfig(config) {
  return {
    ...config,
    compilerOptions: {
      ...config.compilerOptions,
      strict: true,
      noImplicitAny: true,
      strictNullChecks: true,
      strictFunctionTypes: true,
      strictBindCallApply: true,
      strictPropertyInitialization: true,
      noImplicitThis: true,
      alwaysStrict: true,
      noUnusedLocals: true,
      noUnusedParameters: true,
      noImplicitReturns: true,
      noFallthroughCasesInSwitch: true,
      noUncheckedIndexedAccess: true
    }
  };
}

function detectProjectType(rootDir) {
  const analysisPath = path.join(rootDir, '.migration-analysis.json');
  
  if (fs.existsSync(analysisPath)) {
    try {
      const analysis = JSON.parse(fs.readFileSync(analysisPath, 'utf-8'));
      return analysis.projectType || 'vanilla';
    } catch (error) {
      console.error(formatWarning('Could not read .migration-analysis.json'));
    }
  }
  
  // Try to detect from package.json
  const packageJsonPath = path.join(rootDir, 'package.json');
  if (fs.existsSync(packageJsonPath)) {
    try {
      const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'));
      const deps = { ...packageJson.dependencies, ...packageJson.devDependencies };
      
      if (deps['vue'] || deps['@vue/runtime-core']) return 'vue3';
      if (deps['react'] || deps['react-dom'] || deps['next']) return 'react';
      if (deps['express'] || deps['fastify'] || deps['koa'] || deps['@nestjs/core']) return 'node';
    } catch {
      // Ignore errors
    }
  }
  
  return 'vanilla';
}

function main() {
  const args = parseArgs(process.argv.slice(2));
  const isStrict = args.options.strict || false;
  const isForce = args.options.force || false;
  const verbose = args.options.verbose || args.options.v || false;
  const rootDir = args.positional[0] || process.cwd();
  
  console.error('=== Generating tsconfig.json ===\n');
  
  // Check for existing tsconfig.json
  const configPath = path.join(rootDir, 'tsconfig.json');
  
  if (fs.existsSync(configPath) && !isForce) {
    console.error(formatWarning('tsconfig.json already exists'));
    console.error(formatInfo('Use --force to overwrite'));
    console.error(formatInfo('Current config preserved'));
    
    if (verbose) {
      try {
        const existing = JSON.parse(fs.readFileSync(configPath, 'utf-8'));
        console.error('\nExisting configuration:');
        console.error(`  strict: ${existing.compilerOptions?.strict ?? 'not set'}`);
        console.error(`  target: ${existing.compilerOptions?.target || 'not set'}`);
        console.error(`  module: ${existing.compilerOptions?.module || 'not set'}`);
      } catch {
        // Ignore
      }
    }
    
    console.log(JSON.stringify({ success: false, reason: 'exists', path: configPath }, null, 2));
    return;
  }
  
  // Detect project type
  const projectType = detectProjectType(rootDir);
  console.error(formatInfo(`Detected project type: ${projectType}`));
  
  // Get framework-specific config
  let config = frameworkConfigs[projectType] || frameworkConfigs.vanilla;
  
  // Add type roots if types directory exists
  const typesDir = path.join(rootDir, 'src', 'types');
  if (fs.existsSync(typesDir)) {
    config.compilerOptions.typeRoots = ['./node_modules/@types', './src/types'];
    if (verbose) {
      console.error(formatInfo('Added type roots for src/types'));
    }
  }
  
  // Apply strict mode if requested
  if (isStrict) {
    config = generateStrictConfig(config);
    console.error(formatSuccess('Generating tsconfig with STRICT mode enabled'));
  } else {
    console.error(formatSuccess('Generating migration-friendly tsconfig (strict mode disabled)'));
    console.error(formatInfo('Use --strict flag later for production-ready types'));
  }
  
  // Backup existing config if force is used
  if (fs.existsSync(configPath) && isForce) {
    const backupPath = backupFile(configPath);
    console.error(formatInfo(`Backed up existing config to ${path.basename(backupPath || '')}`));
  }
  
  // Write tsconfig.json
  try {
    fs.writeFileSync(configPath, JSON.stringify(config, null, 2));
    console.error(formatSuccess(`tsconfig.json created at ${configPath}`));
    console.error(`  Framework: ${projectType}`);
    console.error(`  Strict Mode: ${isStrict ? 'enabled' : 'disabled (migration-friendly)'}`);
    console.error(`  Module Resolution: ${config.compilerOptions.moduleResolution}`);
    
    // Output result
    const result = {
      success: true,
      path: configPath,
      projectType,
      strictMode: isStrict,
      moduleResolution: config.compilerOptions.moduleResolution
    };
    
    console.log(JSON.stringify(result, null, 2));
    
  } catch (error) {
    console.error(formatError(error, 'Writing tsconfig.json'));
    console.log(JSON.stringify({ success: false, error: error.message }, null, 2));
    process.exit(1);
  }
}

main();
