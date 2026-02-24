#!/usr/bin/env node

/**
 * Shared error handling utilities for migration scripts
 */

const fs = require('fs');
const path = require('path');

const COLORS = {
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  reset: '\x1b[0m'
};

function colorize(text, color) {
  return `${COLORS[color] || ''}${text}${COLORS.reset}`;
}

function formatError(error, context = '') {
  const lines = [];
  
  if (context) {
    lines.push(colorize(`Error in ${context}:`, 'red'));
  } else {
    lines.push(colorize('Error:', 'red'));
  }
  
  if (error.message) {
    lines.push(`  ${error.message}`);
  } else {
    lines.push(`  ${String(error)}`);
  }
  
  if (error.stack && process.env.VERBOSE) {
    lines.push('');
    lines.push(colorize('Stack trace:', 'yellow'));
    lines.push(error.stack.split('\n').slice(1, 5).map(l => `  ${l}`).join('\n'));
  }
  
  return lines.join('\n');
}

function formatWarning(message) {
  return colorize(`Warning: ${message}`, 'yellow');
}

function formatSuccess(message) {
  return colorize(`✓ ${message}`, 'green');
}

function formatInfo(message) {
  return colorize(`ℹ ${message}`, 'blue');
}

function createErrorHandler(scriptName) {
  return function handleError(error, context = '') {
    console.error(formatError(error, context || scriptName));
    
    if (error.code === 'ENOENT') {
      console.error(formatInfo(`File not found: ${error.path}`));
    } else if (error.code === 'EACCES') {
      console.error(formatInfo(`Permission denied: ${error.path}`));
    }
    
    if (process.env.VERBOSE) {
      console.error('\nDebug information:');
      console.error(`  Script: ${scriptName}`);
      console.error(`  Context: ${context}`);
      console.error(`  Error code: ${error.code || 'N/A'}`);
    }
    
    return 1;
  };
}

function validatePrerequisites(rootDir, requirements = {}) {
  const errors = [];
  
  if (requirements.packageJson && !fs.existsSync(path.join(rootDir, 'package.json'))) {
    errors.push('package.json not found');
  }
  
  if (requirements.tsconfig && !fs.existsSync(path.join(rootDir, 'tsconfig.json'))) {
    errors.push('tsconfig.json not found - run generate-tsconfig.js first');
  }
  
  if (requirements.srcDir && !fs.existsSync(path.join(rootDir, 'src'))) {
    errors.push('src/ directory not found');
  }
  
  if (requirements.typescript) {
    const tsPath = path.join(rootDir, 'node_modules', 'typescript');
    if (!fs.existsSync(tsPath)) {
      errors.push('TypeScript not installed - run: npm install --save-dev typescript');
    }
  }
  
  return errors;
}

function backupFile(filePath) {
  if (!fs.existsSync(filePath)) {
    return null;
  }
  
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const backupPath = `${filePath}.backup-${timestamp}`;
  fs.copyFileSync(filePath, backupPath);
  return backupPath;
}

function restoreBackup(backupPath, originalPath) {
  if (backupPath && fs.existsSync(backupPath)) {
    fs.copyFileSync(backupPath, originalPath);
    fs.unlinkSync(backupPath);
    return true;
  }
  return false;
}

function parseArgs(args) {
  const parsed = {
    positional: [],
    options: {},
    flags: []
  };
  
  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    
    if (arg.startsWith('--')) {
      const key = arg.slice(2);
      if (i + 1 < args.length && !args[i + 1].startsWith('-')) {
        parsed.options[key] = args[i + 1];
        i++;
      } else {
        parsed.flags.push(key);
        parsed.options[key] = true;
      }
    } else if (arg.startsWith('-')) {
      const key = arg.slice(1);
      parsed.flags.push(key);
      parsed.options[key] = true;
    } else {
      parsed.positional.push(arg);
    }
  }
  
  return parsed;
}

module.exports = {
  COLORS,
  colorize,
  formatError,
  formatWarning,
  formatSuccess,
  formatInfo,
  createErrorHandler,
  validatePrerequisites,
  backupFile,
  restoreBackup,
  parseArgs
};
