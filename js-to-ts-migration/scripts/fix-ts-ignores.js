#!/usr/bin/env node

/**
 * Interactive tool to fix @ts-ignore comments
 * Analyzes each @ts-ignore and provides guidance on fixing the underlying issue
 */

const fs = require('fs');
const path = require('path');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

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

function findTsIgnores(filePath) {
  const content = fs.readFileSync(filePath, 'utf-8');
  const lines = content.split('\n');
  const tsIgnores = [];
  
  lines.forEach((line, index) => {
    if (/@ts-ignore/.test(line)) {
      // Get the next line (the actual code with the error)
      const nextLine = lines[index + 1] || '';
      
      // Analyze the issue
      const analysis = analyzeIssue(nextLine);
      
      tsIgnores.push({
        line: index + 1,
        ignoreComment: line.trim(),
        nextLine: nextLine.trim(),
        nextLineNumber: index + 2,
        analysis,
        context: getContext(lines, index)
      });
    }
  });
  
  return tsIgnores;
}

function analyzeIssue(codeLine) {
  const issues = [];
  
  // Common TypeScript errors that result in @ts-ignore
  if (/cannot find module/i.test(codeLine)) {
    issues.push({
      type: 'missing-import',
      description: 'Module not found or missing type definitions',
      fix: 'Install @types package or create declaration file'
    });
  }
  
  if (/property .* does not exist/i.test(codeLine) || /possibly .* undefined/i.test(codeLine)) {
    issues.push({
      type: 'null-safety',
      description: 'Potential null/undefined access',
      fix: 'Add null check or use optional chaining (?.)'
    });
  }
  
  if (/type .* is not assignable/i.test(codeLine) || /argument of type/i.test(codeLine)) {
    issues.push({
      type: 'type-mismatch',
      description: 'Type assignment mismatch',
      fix: 'Add proper type annotation or use type assertion'
    });
  }
  
  if (/implicitly has an .* any/i.test(codeLine)) {
    issues.push({
      type: 'implicit-any',
      description: 'Implicit any type',
      fix: 'Add explicit type annotation'
    });
  }
  
  if (/cannot invoke an object which is possibly/i.test(codeLine)) {
    issues.push({
      type: 'function-call',
      description: 'Calling possibly undefined function',
      fix: 'Check if function exists before calling'
    });
  }
  
  if (/element implicitly has an .* any/i.test(codeLine)) {
    issues.push({
      type: 'index-access',
      description: 'Unsafe index access',
      fix: 'Use Record<K, V> type or add index signature'
    });
  }
  
  if (/is not a function/i.test(codeLine)) {
    issues.push({
      type: 'not-a-function',
      description: 'Calling non-function as function',
      fix: 'Check the type of the variable before calling'
    });
  }
  
  // Check for specific patterns
  if (/\.map\(|\.filter\(|\.reduce\(/.test(codeLine)) {
    issues.push({
      type: 'array-method',
      description: 'Array method type issue',
      fix: 'Ensure array type is properly defined before using array methods'
    });
  }
  
  if (/\.length/.test(codeLine)) {
    issues.push({
      type: 'length-access',
      description: 'Possible undefined before length access',
      fix: 'Check if array/string exists: arr?.length'
    });
  }
  
  if (issues.length === 0) {
    issues.push({
      type: 'unknown',
      description: 'Unknown issue - check TypeScript error',
      fix: 'Run tsc to see the actual error message'
    });
  }
  
  return issues;
}

function getContext(lines, index) {
  const start = Math.max(0, index - 3);
  const end = Math.min(lines.length, index + 4);
  return lines.slice(start, end).map((line, i) => {
    const lineNum = start + i + 1;
    const marker = lineNum === index + 1 ? '>' : ' ';
    return `${marker} ${lineNum.toString().padStart(4)} | ${line}`;
  }).join('\n');
}

function promptUser(question) {
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      resolve(answer.trim().toLowerCase());
    });
  });
}

async function main() {
  const rootDir = process.cwd();
  const srcDir = path.join(rootDir, 'src');
  const scanDir = fs.existsSync(srcDir) ? srcDir : rootDir;
  
  console.error('=== Fix @ts-ignore Comments ===\n');
  console.error('Scanning for @ts-ignore comments...\n');
  
  const files = getTsFiles(scanDir);
  
  if (files.length === 0) {
    console.error('No TypeScript files found');
    rl.close();
    return;
  }
  
  console.error(`Found ${files.length} TypeScript files\n`);
  
  const report = [];
  let totalIgnores = 0;
  
  files.forEach(filePath => {
    const tsIgnores = findTsIgnores(filePath);
    
    if (tsIgnores.length > 0) {
      report.push({
        file: path.relative(rootDir, filePath),
        count: tsIgnores.length,
        ignores: tsIgnores
      });
      totalIgnores += tsIgnores.length;
    }
  });
  
  console.log(JSON.stringify(report, null, 2));
  
  console.error('\n=== @ts-ignore Report ===\n');
  console.error(`📊 Summary:`);
  console.error(`   Files with @ts-ignore: ${report.length}`);
  console.error(`   Total @ts-ignore comments: ${totalIgnores}`);
  
  if (report.length === 0) {
    console.error('\n✅ No @ts-ignore comments found! Great job!');
    rl.close();
    return;
  }
  
  // Categorize issues
  const categories = {};
  report.forEach(item => {
    item.ignores.forEach(ignore => {
      ignore.analysis.forEach(issue => {
        categories[issue.type] = (categories[issue.type] || 0) + 1;
      });
    });
  });
  
  console.error(`\n📋 Issues by Category:`);
  Object.entries(categories)
    .sort((a, b) => b[1] - a[1])
    .forEach(([type, count]) => {
      console.error(`   ${type}: ${count}`);
    });
  
  // Sort by count
  report.sort((a, b) => b.count - a.count);
  
  console.error(`\n🔍 Top files with most @ts-ignore:`);
  report.slice(0, 10).forEach((item, index) => {
    console.error(`\n  ${index + 1}. ${item.file} (${item.count} @ts-ignore)`);
    
    item.ignores.slice(0, 2).forEach((ignore, i) => {
      console.error(`     ${i + 1}. Line ${ignore.line} → Line ${ignore.nextLineNumber}`);
      console.error(`        Issue: ${ignore.analysis[0].type}`);
      console.error(`        Fix: ${ignore.analysis[0].fix}`);
    });
    
    if (item.ignores.length > 2) {
      console.error(`     ... and ${item.ignores.length - 2} more`);
    }
  });
  
  console.error(`\n📚 Fix Strategies by Category:`);
  console.error(`   🔴 null-safety: Add null checks, use optional chaining (?.)`);
  console.error(`   🟠 type-mismatch: Add explicit types, use proper interfaces`);
  console.error(`   🟡 implicit-any: Add type annotations`);
  console.error(`   🟢 missing-import: Install @types or create .d.ts file`);
  console.error(`   🔵 function-call: Check function exists: if (fn) fn()`);
  console.error(`   ⚪ index-access: Use Record<K,V> or proper index signatures`);
  
  const shouldReview = await promptUser('\nReview @ts-ignore comments interactively? (y/N): ');
  
  if (shouldReview === 'y') {
    console.error('\n📝 Interactive Review Mode\n');
    
    for (const item of report.slice(0, 3)) {
      console.error(`\n📄 ${item.file}:`);
      
      for (const ignore of item.ignores.slice(0, 3)) {
        console.error(`\n--- Line ${ignore.line} ---`);
        console.error(ignore.context);
        console.error(`\n💡 ${ignore.analysis[0].description}`);
        console.error(`🛠️  ${ignore.analysis[0].fix}`);
        
        const action = await promptUser('\nAction: (s)kip / (f)ixed / (c)ontext / (q)uit: ');
        
        if (action === 'q') {
          rl.close();
          return;
        }
        
        if (action === 'c') {
          console.error('\nMore context:');
          console.error(ignore.context);
        }
      }
    }
  }
  
  // Save report
  const outputPath = path.join(rootDir, '.migration-ts-ignores.json');
  fs.writeFileSync(outputPath, JSON.stringify(report, null, 2));
  console.error(`\n💾 Full report saved to .migration-ts-ignores.json`);
  
  rl.close();
}

main();
