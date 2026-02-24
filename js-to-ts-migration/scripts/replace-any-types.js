#!/usr/bin/env node

/**
 * Interactive tool to replace 'any' types with proper TypeScript types
 * Scans files and provides suggestions for common patterns
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

function findAnyTypes(filePath) {
  const content = fs.readFileSync(filePath, 'utf-8');
  const lines = content.split('\n');
  const anyInstances = [];
  
  lines.forEach((line, index) => {
    // Match : any, :any, Array<any>, any[], etc.
    const anyPatterns = [
      { regex: /:\s*any\b(?!\w)/, type: 'typed-any' },
      { regex: /as\s+any/, type: 'assertion-any' },
      { regex: /Array<any>/, type: 'array-any' },
      { regex: /any\[\]/, type: 'array-any' },
      { regex: /Record<string,\s*any>/, type: 'record-any' },
      { regex: /Promise<any>/, type: 'promise-any' }
    ];
    
    anyPatterns.forEach(pattern => {
      if (pattern.regex.test(line) && !line.includes('@ts-ignore') && !line.includes('//')) {
        // Try to suggest a better type
        const suggestion = suggestBetterType(line, pattern.type);
        
        anyInstances.push({
          line: index + 1,
          code: line.trim(),
          type: pattern.type,
          suggestion,
          context: getContext(lines, index)
        });
      }
    });
  });
  
  return anyInstances;
}

function suggestBetterType(line, type) {
  // Pattern-based suggestions
  const suggestions = [];
  
  // Function parameters
  if (line.includes('function') || line.includes('=>')) {
    if (line.includes('event') || line.includes('e:')) {
      suggestions.push('Event | React.SyntheticEvent');
    }
    if (line.includes('data') || line.includes('response')) {
      suggestions.push('Create an interface for this data structure');
    }
    if (line.includes('props')) {
      suggestions.push('Define a Props interface');
    }
  }
  
  // React patterns
  if (line.includes('useState')) {
    suggestions.push('useState<YourType>(initialValue)');
  }
  if (line.includes('useRef')) {
    suggestions.push('useRef<HTMLDivElement>(null)');
  }
  
  // API responses
  if (line.includes('fetch') || line.includes('axios') || line.includes('api')) {
    suggestions.push('Define an interface for the API response');
  }
  
  // Arrays
  if (type === 'array-any') {
    suggestions.push('Specify the element type: YourType[]');
  }
  
  // Common types
  suggestions.push('unknown (safer than any)');
  
  return suggestions.length > 0 ? suggestions : ['unknown'];
}

function getContext(lines, index) {
  const start = Math.max(0, index - 2);
  const end = Math.min(lines.length, index + 3);
  return lines.slice(start, end).join('\n');
}

function promptUser(question) {
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      resolve(answer.trim());
    });
  });
}

async function main() {
  const rootDir = process.cwd();
  const srcDir = path.join(rootDir, 'src');
  const scanDir = fs.existsSync(srcDir) ? srcDir : rootDir;
  
  console.error('=== Replace Any Types ===\n');
  console.error('Scanning for "any" types...\n');
  
  const files = getTsFiles(scanDir);
  
  if (files.length === 0) {
    console.error('No TypeScript files found');
    rl.close();
    return;
  }
  
  console.error(`Found ${files.length} TypeScript files\n`);
  
  const report = [];
  let totalAny = 0;
  
  files.forEach(filePath => {
    const anyTypes = findAnyTypes(filePath);
    
    if (anyTypes.length > 0) {
      report.push({
        file: path.relative(rootDir, filePath),
        count: anyTypes.length,
        instances: anyTypes
      });
      totalAny += anyTypes.length;
    }
  });
  
  console.log(JSON.stringify(report, null, 2));
  
  console.error('\n=== Any Types Report ===\n');
  console.error(`📊 Summary:`);
  console.error(`   Files with 'any': ${report.length}`);
  console.error(`   Total 'any' instances: ${totalAny}`);
  
  if (report.length === 0) {
    console.error('\n✅ No "any" types found! Great job!');
    rl.close();
    return;
  }
  
  // Sort by count
  report.sort((a, b) => b.count - a.count);
  
  console.error(`\n🔍 Top files with most 'any' types:`);
  report.slice(0, 10).forEach((item, index) => {
    console.error(`\n  ${index + 1}. ${item.file} (${item.count} instances)`);
    
    item.instances.slice(0, 3).forEach((instance, i) => {
      console.error(`     ${i + 1}. Line ${instance.line}: ${instance.type}`);
      console.error(`        Code: ${instance.code.substring(0, 70)}...`);
      console.error(`        💡 Suggestions: ${instance.suggestion.join(', ')}`);
    });
    
    if (item.instances.length > 3) {
      console.error(`     ... and ${item.instances.length - 3} more`);
    }
  });
  
  console.error(`\n📚 Common Replacement Patterns:`);
  console.error(`   • any → unknown (when type is truly unknown)`);
  console.error(`   • any → specific interface (for data structures)`);
  console.error(`   • any → Event (for DOM events)`);
  console.error(`   • any → React.FC<Props> (for components)`);
  console.error(`   • Promise<any> → Promise<ResponseType>`);
  console.error(`   • Array<any> → Array<ElementType> or ElementType[]`);
  
  console.error(`\n🔧 Quick Fix Commands:`);
  console.error(`   # Replace all simple 'any' with 'unknown'`);
  console.error(`   find src -name "*.ts" -o -name "*.tsx" | xargs sed -i '' 's/: any/: unknown/g'`);
  console.error(`\n   # Replace Array<any>`);
  console.error(`   find src -name "*.ts" -o -name "*.tsx" | xargs sed -i '' 's/Array<any>/unknown[]/g'`);
  
  const shouldShowContext = await promptUser('\nShow detailed context for first file? (y/N): ');
  
  if (shouldShowContext.toLowerCase() === 'y') {
    const firstFile = report[0];
    console.error(`\n📄 Detailed view for ${firstFile.file}:`);
    
    firstFile.instances.forEach((instance, i) => {
      console.error(`\n--- Instance ${i + 1} ---`);
      console.error(`Line ${instance.line}:`);
      console.error(instance.context);
      console.error(`\n💡 Suggestions: ${instance.suggestion.join(', ')}`);
    });
  }
  
  // Save report
  const outputPath = path.join(rootDir, '.migration-any-types.json');
  fs.writeFileSync(outputPath, JSON.stringify(report, null, 2));
  console.error(`\n💾 Full report saved to .migration-any-types.json`);
  
  rl.close();
}

main();
