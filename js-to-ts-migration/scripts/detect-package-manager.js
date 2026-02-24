#!/usr/bin/env node

/**
 * Detects package manager (npm, yarn, pnpm) based on lock files
 * Returns appropriate install command
 */

const fs = require('fs');
const path = require('path');

function detectPackageManager(rootDir) {
  if (fs.existsSync(path.join(rootDir, 'pnpm-lock.yaml'))) {
    return 'pnpm';
  } else if (fs.existsSync(path.join(rootDir, 'yarn.lock'))) {
    return 'yarn';
  }
  return 'npm';
}

function getInstallCommand(packageManager, packages, isDev = true) {
  const devFlag = isDev ? '--save-dev' : '--save';
  
  const commands = {
    npm: `npm install ${devFlag}`,
    yarn: `yarn add ${isDev ? '--dev' : ''}`,
    pnpm: `pnpm add ${devFlag}`
  };
  
  const base = commands[packageManager] || commands.npm;
  return packages ? `${base} ${packages}` : base;
}

function main() {
  const rootDir = process.cwd();
  
  try {
    const packageManager = detectPackageManager(rootDir);
    
    const result = {
      packageManager,
      installDev: getInstallCommand(packageManager, null, true),
      installProd: getInstallCommand(packageManager, null, false),
      npx: packageManager === 'pnpm' ? 'pnpx' : 'npx'
    };
    
    console.log(JSON.stringify(result, null, 2));
    
    console.error(`\n✓ Detected package manager: ${packageManager}`);
    console.error(`\nCommands:`);
    console.error(`  Install dev deps: ${result.installDev} <package>`);
    console.error(`  Install prod deps: ${result.installProd} <package>`);
    console.error(`  Run package binary: ${result.npx} <command>`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
}

main();
