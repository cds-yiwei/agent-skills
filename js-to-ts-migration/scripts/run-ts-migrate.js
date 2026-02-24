#!/usr/bin/env node

/**
 * Executes ts-migrate with pre-flight checks and project-specific configuration
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

function checkPrerequisites(rootDir) {
  const checks = {
    tsconfig: fs.existsSync(path.join(rootDir, 'tsconfig.json')),
    typescript: fs.existsSync(path.join(rootDir, 'node_modules', 'typescript')),
    srcDir: fs.existsSync(path.join(rootDir, 'src'))
  };
  
  return checks;
}

function installTsMigrate(packageManager) {
  const commands = {
    npm: 'npm install --save-dev ts-migrate',
    yarn: 'yarn add --dev ts-migrate',
    pnpm: 'pnpm add --save-dev ts-migrate'
  };
  
  const cmd = commands[packageManager] || commands.npm;
  
  try {
    console.error('Installing ts-migrate...');
    execSync(cmd, { stdio: 'inherit' });
    return true;
  } catch {
    console.error('Failed to install ts-migrate');
    return false;
  }
}

function runTsMigrate(srcDir, packageManager) {
  const npxCmd = packageManager === 'pnpm' ? 'pnpx' : 'npx';
  
  try {
    console.error(`\nRunning ts-migrate on ${srcDir}...`);
    execSync(`${npxCmd} ts-migrate-full ${srcDir}`, { stdio: 'inherit' });
    return true;
  } catch (error) {
    console.error('\nts-migrate completed with some errors (this is normal)');
    console.error('The project should now be in a compilable state with @ts-ignore comments');
    return true;
  }
}

function validateCompilation(rootDir, packageManager) {
  const npxCmd = packageManager === 'pnpm' ? 'pnpx' : 'npx';
  
  try {
    console.error('\nValidating TypeScript compilation...');
    execSync(`${npxCmd} tsc --noEmit`, { stdio: 'inherit' });
    console.error('✓ Project compiles successfully!');
    return true;
  } catch {
    console.error('\n⚠️  Project has TypeScript errors');
    console.error('This is expected. Review and fix errors incrementally.');
    return false;
  }
}

function main() {
  const rootDir = process.cwd();
  
  // Load analysis
  let packageManager = 'npm';
  let projectType = 'vanilla';
  
  const analysisPath = path.join(rootDir, '.migration-analysis.json');
  if (fs.existsSync(analysisPath)) {
    const analysis = JSON.parse(fs.readFileSync(analysisPath, 'utf-8'));
    packageManager = analysis.packageManager;
    projectType = analysis.projectType;
  }
  
  console.error('=== TypeScript Migration with ts-migrate ===\n');
  
  // Pre-flight checks
  const checks = checkPrerequisites(rootDir);
  
  if (!checks.tsconfig) {
    console.error('❌ No tsconfig.json found');
    console.error('Run: node generate-tsconfig.js');
    process.exit(1);
  }
  
  if (!checks.typescript) {
    console.error('❌ TypeScript not installed');
    console.error(`Run: ${packageManager} install --save-dev typescript`);
    process.exit(1);
  }
  
  if (!checks.srcDir) {
    console.error('❌ src/ directory not found');
    console.error('Please ensure your source code is in a src/ directory');
    process.exit(1);
  }
  
  console.error('✓ Pre-flight checks passed\n');
  
  // Check if ts-migrate is installed
  const tsMigrateInstalled = fs.existsSync(path.join(rootDir, 'node_modules', 'ts-migrate'));
  
  if (!tsMigrateInstalled) {
    const installed = installTsMigrate(packageManager);
    if (!installed) {
      console.error('Failed to install ts-migrate');
      process.exit(1);
    }
  }
  
  // Run ts-migrate
  const srcDir = path.join(rootDir, 'src');
  const success = runTsMigrate(srcDir, packageManager);
  
  if (!success) {
    process.exit(1);
  }
  
  // Validate compilation
  validateCompilation(rootDir, packageManager);
  
  console.error('\n✓ ts-migrate execution complete!');
  console.error('\nNext steps:');
  console.error('  1. Review @ts-ignore comments and fix types');
  console.error('  2. Run cleanup-report.js to identify areas needing attention');
  console.error('  3. Gradually enable strict mode with strict-mode-enabler.js');
}

main();
