#!/usr/bin/env node

/**
 * Checks @types availability for project dependencies
 * Generates install commands for missing types
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

function getInstallCommand(packageManager) {
  const commands = {
    npm: 'npm install --save-dev',
    yarn: 'yarn add --dev',
    pnpm: 'pnpm add --save-dev'
  };
  return commands[packageManager] || commands.npm;
}

function checkTypesAvailable(dependencies) {
  const results = {
    available: [],
    missing: [],
    builtin: [],
    checked: []
  };
  
  const builtins = [
    'fs', 'path', 'http', 'https', 'url', 'querystring', 'stream', 
    'util', 'crypto', 'events', 'os', 'buffer', 'process', 'child_process'
  ];
  
  for (const dep of dependencies) {
    // Skip builtins
    if (builtins.includes(dep) || dep.startsWith('node:')) {
      results.builtin.push(dep);
      continue;
    }
    
    // Skip @types packages themselves
    if (dep.startsWith('@types/')) {
      continue;
    }
    
    // Skip scoped packages for now (complex naming)
    if (dep.startsWith('@')) {
      results.checked.push({ package: dep, types: 'manual-check-needed' });
      continue;
    }
    
    try {
      // Check if @types package exists
      execSync(`npm view @types/${dep} --json`, { stdio: 'pipe' });
      results.available.push(dep);
    } catch {
      results.missing.push(dep);
    }
  }
  
  return results;
}

function main() {
  const rootDir = process.cwd();
  const packageJsonPath = path.join(rootDir, 'package.json');
  
  if (!fs.existsSync(packageJsonPath)) {
    console.error('Error: No package.json found');
    process.exit(1);
  }
  
  // Read package.json
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'));
  const allDeps = [
    ...Object.keys(packageJson.dependencies || {}),
    ...Object.keys(packageJson.devDependencies || {})
  ];
  
  // Get package manager from analysis file or default to npm
  let packageManager = 'npm';
  const analysisPath = path.join(rootDir, '.migration-analysis.json');
  if (fs.existsSync(analysisPath)) {
    const analysis = JSON.parse(fs.readFileSync(analysisPath, 'utf-8'));
    packageManager = analysis.packageManager;
  }
  
  console.error('Checking @types availability...\n');
  
  const results = checkTypesAvailable(allDeps);
  
  console.log(JSON.stringify(results, null, 2));
  
  console.error('\n✓ Type availability check complete\n');
  
  if (results.available.length > 0) {
    const installCmd = getInstallCommand(packageManager);
    const typesPackages = results.available.map(d => `@types/${d}`).join(' ');
    
    console.error(`📦 Available @types packages (${results.available.length}):`);
    console.error(results.available.map(d => `   - @types/${d}`).join('\n'));
    console.error(`\n💡 Install with:\n   ${installCmd} ${typesPackages}`);
  }
  
  if (results.missing.length > 0) {
    console.error(`\n⚠️  No @types found for (${results.missing.length}):`);
    console.error(results.missing.map(d => `   - ${d}`).join('\n'));
    console.error('\n💡 You may need to create custom type definitions');
  }
  
  if (results.checked.length > 0) {
    console.error(`\n🔍 Scoped packages need manual check (${results.checked.length}):`);
    console.error(results.checked.map(c => `   - ${c.package}`).join('\n'));
  }
}

main();
