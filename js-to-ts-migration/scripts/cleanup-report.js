#!/usr/bin/env node

/**
 * Scans project for type cleanup opportunities
 * Identifies: any types, @ts-ignore, @ts-expect-error, TODO comments
 * Generates prioritized cleanup list
 */

const fs = require('fs');
const path = require('path');

function getAllTsFiles(dir) {
  const files = [];
  
  const items = fs.readdirSync(dir);
  
  for (const item of items) {
    const fullPath = path.join(dir, item);
    const stat = fs.statSync(fullPath);
    
    if (stat.isDirectory()) {
      if (!['node_modules', 'dist', '.git', 'coverage'].includes(item)) {
        files.push(...getAllTsFiles(fullPath));
      }
    } else if (/\.(ts|tsx)$/.test(item)) {
      files.push(fullPath);
    }
  }
  
  return files;
}

function analyzeFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf-8');
  const lines = content.split('\n');
  
  const issues = {
    anyTypes: [],
    tsIgnores: [],
    tsExpectErrors: [],
    todoComments: []
  };
  
  lines.forEach((line, index) => {
    const lineNum = index + 1;
    
    // Check for any types
    if (/:\s*any\b/.test(line) && !line.includes('//')) {
      issues.anyTypes.push({ line: lineNum, code: line.trim() });
    }
    
    // Check for @ts-ignore
    if (/@ts-ignore/.test(line)) {
      issues.tsIgnores.push({ line: lineNum, code: line.trim() });
    }
    
    // Check for @ts-expect-error
    if (/@ts-expect-error/.test(line)) {
      issues.tsExpectErrors.push({ line: lineNum, code: line.trim() });
    }
    
    // Check for TODO type comments
    if (/TODO.*type/i.test(line) || /FIXME.*type/i.test(line)) {
      issues.todoComments.push({ line: lineNum, code: line.trim() });
    }
  });
  
  // Calculate priority score
  let priorityScore = 0;
  priorityScore += issues.anyTypes.length * 2;
  priorityScore += issues.tsIgnores.length * 3;
  priorityScore += issues.tsExpectErrors.length * 1;
  priorityScore += issues.todoComments.length * 1;
  
  return {
    file: path.relative(process.cwd(), filePath),
    ...issues,
    priorityScore,
    totalIssues: issues.anyTypes.length + issues.tsIgnores.length + 
                 issues.tsExpectErrors.length + issues.todoComments.length
  };
}

function main() {
  const rootDir = process.cwd();
  const srcDir = path.join(rootDir, 'src');
  
  const scanDir = fs.existsSync(srcDir) ? srcDir : rootDir;
  
  console.error('Scanning for type cleanup opportunities...\n');
  
  const files = getAllTsFiles(scanDir);
  
  if (files.length === 0) {
    console.error('No TypeScript files found');
    process.exit(0);
  }
  
  console.error(`Found ${files.length} TypeScript files\n`);
  
  const results = files.map(analyzeFile);
  
  // Filter files with issues and sort by priority
  const filesWithIssues = results
    .filter(r => r.totalIssues > 0)
    .sort((a, b) => b.priorityScore - a.priorityScore);
  
  // Calculate totals
  const totals = results.reduce((acc, file) => ({
    anyTypes: acc.anyTypes + file.anyTypes.length,
    tsIgnores: acc.tsIgnores + file.tsIgnores.length,
    tsExpectErrors: acc.tsExpectErrors + file.tsExpectErrors.length,
    todoComments: acc.todoComments + file.todoComments.length,
    filesWithIssues: acc.filesWithIssues + (file.totalIssues > 0 ? 1 : 0)
  }), {
    anyTypes: 0,
    tsIgnores: 0,
    tsExpectErrors: 0,
    todoComments: 0,
    filesWithIssues: 0
  });
  
  console.log(JSON.stringify({ totals, files: filesWithIssues }, null, 2));
  
  console.error('\n=== Type Cleanup Report ===\n');
  
  console.error(`📊 Summary:`);
  console.error(`   Files with issues: ${totals.filesWithIssues}/${files.length}`);
  console.error(`   any types: ${totals.anyTypes}`);
  console.error(`   @ts-ignore comments: ${totals.tsIgnores}`);
  console.error(`   @ts-expect-error comments: ${totals.tsExpectErrors}`);
  console.error(`   TODO/FIXME comments: ${totals.todoComments}`);
  
  if (filesWithIssues.length === 0) {
    console.error('\n✓ No cleanup needed - great job!');
    return;
  }
  
  console.error(`\n🎯 Priority files (sorted by impact):`);
  filesWithIssues.slice(0, 10).forEach((file, index) => {
    console.error(`\n  ${index + 1}. ${file.file}`);
    console.error(`     Priority: ${file.priorityScore} | Total issues: ${file.totalIssues}`);
    
    if (file.anyTypes.length > 0) {
      console.error(`     ⚠️  ${file.anyTypes.length} any types`);
    }
    if (file.tsIgnores.length > 0) {
      console.error(`     🚫 ${file.tsIgnores.length} @ts-ignore`);
    }
  });
  
  console.error(`\n💡 Cleanup recommendations:`);
  console.error(`   1. Replace 'any' with proper types (highest impact)`);
  console.error(`   2. Review @ts-ignore - fix underlying issues`);
  console.error(`   3. Address @ts-expect-error comments`);
  console.error(`   4. Complete TODO/FIXME type tasks`);
  
  // Save report
  const outputPath = path.join(rootDir, '.migration-cleanup.json');
  fs.writeFileSync(outputPath, JSON.stringify({ totals, files: filesWithIssues }, null, 2));
  console.error(`\n💾 Full report saved to .migration-cleanup.json`);
}

main();
