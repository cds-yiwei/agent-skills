#!/usr/bin/env node

/**
 * Suggests ts-migrate plugins based on project type
 * Interactive: asks user to confirm installation
 */

const fs = require('fs');
const path = require('path');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const pluginRecommendations = {
  react: [
    {
      name: 'ts-migrate-plugin-react-class-state',
      description: 'Converts React class component state to TypeScript',
      npm: 'ts-migrate-plugin-react-class-state'
    },
    {
      name: 'ts-migrate-plugin-react-props',
      description: 'Converts PropTypes to TypeScript interfaces',
      npm: 'ts-migrate-plugin-react-props'
    }
  ],
  node: [
    {
      name: 'ts-migrate-plugin-node',
      description: 'Adds Node.js-specific type annotations',
      npm: 'ts-migrate-plugin-node'
    }
  ],
  vue3: [
    {
      name: '@vue/tsconfig',
      description: 'Vue 3 TypeScript configuration',
      npm: '@vue/tsconfig'
    }
  ],
  vanilla: []
};

function getPackageManager(rootDir) {
  if (fs.existsSync(path.join(rootDir, 'pnpm-lock.yaml'))) {
    return 'pnpm';
  } else if (fs.existsSync(path.join(rootDir, 'yarn.lock'))) {
    return 'yarn';
  }
  return 'npm';
}

function getInstallCommand(packageManager, packages) {
  const commands = {
    npm: `npm install --save-dev ${packages}`,
    yarn: `yarn add --dev ${packages}`,
    pnpm: `pnpm add --save-dev ${packages}`
  };
  return commands[packageManager];
}

function promptUser(question) {
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      resolve(answer.toLowerCase().trim());
    });
  });
}

async function main() {
  const rootDir = process.cwd();
  
  // Load analysis
  let projectType = 'vanilla';
  const analysisPath = path.join(rootDir, '.migration-analysis.json');
  if (fs.existsSync(analysisPath)) {
    const analysis = JSON.parse(fs.readFileSync(analysisPath, 'utf-8'));
    projectType = analysis.projectType;
  }
  
  const recommendations = pluginRecommendations[projectType] || [];
  
  if (recommendations.length === 0) {
    console.error('No specific plugins recommended for vanilla JavaScript projects');
    console.error('Standard ts-migrate should handle most cases');
    rl.close();
    return;
  }
  
  console.error(`=== Recommended ts-migrate plugins for ${projectType} ===\n`);
  
  recommendations.forEach((plugin, index) => {
    console.error(`${index + 1}. ${plugin.name}`);
    console.error(`   ${plugin.description}`);
    console.error(`   npm: ${plugin.npm}`);
    console.error();
  });
  
  const packageManager = getPackageManager(rootDir);
  const packages = recommendations.map(p => p.npm).join(' ');
  
  console.error(`📦 Install command:`);
  console.error(`   ${getInstallCommand(packageManager, packages)}\n`);
  
  const answer = await promptUser('Would you like to install these plugins? (Y/n): ');
  
  if (answer === 'y' || answer === 'yes' || answer === '') {
    console.error('\nInstalling plugins...');
    console.error(`Command: ${getInstallCommand(packageManager, packages)}`);
    console.error('\n✓ Run this command to install, then re-run ts-migrate');
  } else {
    console.error('\nSkipped plugin installation');
    console.error('You can install them later if needed');
  }
  
  rl.close();
}

main();
