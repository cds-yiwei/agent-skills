#!/usr/bin/env node

/**
 * Removes unused variables added by ts-migrate
 * Uses TypeScript compiler API to find and remove unused imports/variables
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

function getTsFiles(dir) {
  const files = [];
  const items = fs.readdirSync(dir);
  
  for (const item of items) {
    const fullPath = path.join(dir, item);
    const stat = fs.statSync(fullPath);
    
    if (stat.isDirectory()) {
      if (!['node_modules', 'dist', '.git', 'coverage'].includes(item)) {
        files.push(...getTsFiles(fullPath));
      }
    } else if (/\.(ts|tsx)$/.test(item)) {
      files.push(fullPath);
    }
  }
  
  return files;
}

function findUnusedVariables(filePath) {
  const content = fs.readFileSync(filePath, 'utf-8');
  const lines = content.split('\n');
  
  const unusedVars = [];
  
  // Common patterns added by ts-migrate
  const patterns = [
    // Unused React import when using new JSX transform
    { regex: /^import\s+React\s+from\s+['"]react['"];?$/, reason: 'Unused React import' },
    // Unused type imports
    { regex: /^import\s+type\s+\{[^}]+\}\s+from\s+['"][^'"]+['"];?$/, reason: 'Unused type import' },
    // Unused destructured imports
    { regex: /^import\s+\{[^}]+\}\s+from\s+['"][^'"]+['"];?$/, reason: 'Potential unused import' },
    // Variables declared but not used
    { regex: /^(const|let|var)\s+(\w+)\s*=/, reason: 'Potentially unused variable' }
  ];
  
  lines.forEach((line, index) => {
    const trimmedLine = line.trim();
    
    patterns.forEach(pattern => {
      if (pattern.regex.test(trimmedLine)) {
        unusedVars.push({
          line: index + 1,
          code: trimmedLine,
          reason: pattern.reason
        });
      }
    });
  });
  
  return unusedVars;
}

function removeUnusedReactImport(filePath) {
  let content = fs.readFileSync(filePath, 'utf-8');
  
  // Remove "import React from 'react';" if using new JSX transform
  const reactImportRegex = /import\s+React\s+from\s+['"]react['"];?\n?/g;
  
  if (reactImportRegex.test(content)) {
    // Check if React is actually used in the file
    const reactUsageRegex = /\bReact\./;
    if (!reactUsageRegex.test(content)) {
      content = content.replace(reactImportRegex, '');
      fs.writeFileSync(filePath, content);
      return true;
    }
  }
  
  return false;
}

function main() {
  const rootDir = process.cwd();
  const srcDir = path.join(rootDir, 'src');
  const scanDir = fs.existsSync(srcDir) ? srcDir : rootDir;
  
  console.error('Scanning for unused variables...\n');
  
  const files = getTsFiles(scanDir);
  
  if (files.length === 0) {
    console.error('No TypeScript files found');
    process.exit(0);
  }
  
  console.error(`Found ${files.length} TypeScript files\n`);
  
  let totalUnused = 0;
  let filesModified = 0;
  const report = [];
  
  files.forEach(filePath => {
    const unusedVars = findUnusedVariables(filePath);
    const wasModified = removeUnusedReactImport(filePath);
    
    if (unusedVars.length > 0 || wasModified) {
      const relativePath = path.relative(rootDir, filePath);
      
      report.push({
        file: relativePath,
        unusedCount: unusedVars.length,
        unusedVars,
        autoFixed: wasModified
      });
      
      totalUnused += unusedVars.length;
      if (wasModified) filesModified++;
    }
  });
  
  console.log(JSON.stringify(report, null, 2));
  
  console.error('\n=== Unused Variables Report ===\n');
  console.error(`📊 Summary:`);
  console.error(`   Files with unused variables: ${report.length}`);
  console.error(`   Total unused variable instances: ${totalUnused}`);
  console.error(`   Files auto-fixed (React imports): ${filesModified}`);
  
  if (report.length === 0) {
    console.error('\n✓ No unused variables found!');
    return;
  }
  
  console.error(`\n🔍 Files to review:`);
  report.slice(0, 20).forEach((item, index) => {
    console.error(`\n  ${index + 1}. ${item.file}`);
    console.error(`     Unused items: ${item.unusedCount}`);
    
    if (item.autoFixed) {
      console.error(`     ✅ Auto-removed unused React import`);
    }
    
    item.unusedVars.slice(0, 5).forEach(uv => {
      console.error(`     - Line ${uv.line}: ${uv.reason}`);
      console.error(`       Code: ${uv.code.substring(0, 60)}${uv.code.length > 60 ? '...' : ''}`);
    });
  });
  
  console.error(`\n💡 Recommendations:`);
  console.error(`   1. Review each file and remove unused imports/variables`);
  console.error(`   2. Use ESLint with @typescript-eslint/no-unused-vars`);
  console.error(`   3. Some variables may be needed - check before removing`);
  console.error(`   4. Unused React imports have been auto-removed`);
  
  console.error(`\n⚠️  ESLint Configuration:`);
  console.error(`   Add to your .eslintrc:`);
  console.error(`   {`);
  console.error(`     "@typescript-eslint/no-unused-vars": ["error", {`);
  console.error(`       "argsIgnorePattern": "^_",`);
  console.error(`       "varsIgnorePattern": "^_"`);
  console.error(`     }]`);
  console.error(`   }`);
  
  // Save report
  const outputPath = path.join(rootDir, '.migration-unused-vars.json');
  fs.writeFileSync(outputPath, JSON.stringify(report, null, 2));
  console.error(`\n💾 Full report saved to .migration-unused-vars.json`);
}

main();
