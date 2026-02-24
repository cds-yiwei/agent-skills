#!/usr/bin/env node

/**
 * Analyzes file dependencies to suggest optimal migration order
 * Identifies leaf files (few/no dependencies) for early migration
 * Flags high-value files (shared utilities, API clients)
 */

const fs = require('fs');
const path = require('path');

function getAllJsFiles(dir, baseDir = dir) {
  const files = [];
  
  const items = fs.readdirSync(dir);
  
  for (const item of items) {
    const fullPath = path.join(dir, item);
    const stat = fs.statSync(fullPath);
    
    if (stat.isDirectory()) {
      if (!['node_modules', 'dist', '.git', 'coverage'].includes(item)) {
        files.push(...getAllJsFiles(fullPath, baseDir));
      }
    } else if (/\.(js|jsx)$/.test(item) && !item.includes('.test.')) {
      files.push(fullPath);
    }
  }
  
  return files;
}

function extractImports(content) {
  const imports = [];
  
  // ES6 imports
  const es6Regex = /import\s+(?:{[^}]*}|\*\s+as\s+\w+|\w+)\s+from\s+['"]([^'"]+)['"];?/g;
  let match;
  while ((match = es6Regex.exec(content)) !== null) {
    imports.push(match[1]);
  }
  
  // CommonJS requires
  const cjsRegex = /require\s*\(\s*['"]([^'"]+)['"]\s*\)/g;
  while ((match = cjsRegex.exec(content)) !== null) {
    imports.push(match[1]);
  }
  
  return imports.filter(imp => !imp.startsWith('.') && !imp.startsWith('@types/'));
}

function analyzeDependencies(files, rootDir) {
  const graph = {};
  const fileNames = new Set(files.map(f => path.basename(f, path.extname(f))));
  
  for (const file of files) {
    const content = fs.readFileSync(file, 'utf-8');
    const imports = extractImports(content);
    
    // Count internal dependencies
    const internalDeps = imports.filter(imp => {
      const importBase = path.basename(imp);
      return fileNames.has(importBase) || files.some(f => f.includes(importBase));
    });
    
    graph[file] = {
      dependencies: internalDeps.length,
      content: content.length,
      isHighValue: isHighValueFile(file, content)
    };
  }
  
  return graph;
}

function isHighValueFile(filePath, content) {
  const highValuePatterns = [
    /api|client|service/i,
    /util|helper|lib/i,
    /config|constant/i,
    /model|schema|entity/i,
    /store|state|context/i
  ];
  
  return highValuePatterns.some(pattern => 
    pattern.test(filePath) || pattern.test(content)
  );
}

function suggestMigrationOrder(graph) {
  const entries = Object.entries(graph);
  
  // Sort by: low dependencies first, then by high-value flag
  return entries
    .sort((a, b) => {
      // Prioritize leaf files (few dependencies)
      if (a[1].dependencies !== b[1].dependencies) {
        return a[1].dependencies - b[1].dependencies;
      }
      // Then high-value files
      if (a[1].isHighValue !== b[1].isHighValue) {
        return b[1].isHighValue ? 1 : -1;
      }
      // Then by file size (smaller first)
      return a[1].content - b[1].content;
    })
    .map(([file, data]) => ({
      file: path.relative(process.cwd(), file),
      internalDeps: data.dependencies,
      size: data.content,
      isHighValue: data.isHighValue
    }));
}

function main() {
  const rootDir = process.cwd();
  const srcDir = path.join(rootDir, 'src');
  
  if (!fs.existsSync(srcDir)) {
    console.error('Warning: src/ directory not found, scanning project root');
  }
  
  const scanDir = fs.existsSync(srcDir) ? srcDir : rootDir;
  
  console.error('Analyzing file dependencies...\n');
  
  const files = getAllJsFiles(scanDir);
  
  if (files.length === 0) {
    console.error('No JavaScript files found to migrate');
    process.exit(0);
  }
  
  console.error(`Found ${files.length} JavaScript files\n`);
  
  const graph = analyzeDependencies(files, rootDir);
  const order = suggestMigrationOrder(graph);
  
  console.log(JSON.stringify(order, null, 2));
  
  console.error('\n✓ Dependency analysis complete\n');
  
  const leafFiles = order.filter(f => f.internalDeps === 0);
  const highValueFiles = order.filter(f => f.isHighValue);
  
  console.error(`📊 Summary:`);
  console.error(`   Total files: ${files.length}`);
  console.error(`   Leaf files (no internal deps): ${leafFiles.length}`);
  console.error(`   High-value files: ${highValueFiles.length}`);
  
  console.error(`\n🎯 Recommended starting points (leaf files):`);
  leafFiles.slice(0, 5).forEach(f => {
    console.error(`   - ${f.file} (${f.size} bytes)`);
  });
  
  if (highValueFiles.length > 0) {
    console.error(`\n⭐ High-value files (migrate early for max impact):`);
    highValueFiles.slice(0, 5).forEach(f => {
      console.error(`   - ${f.file} (${f.internalDeps} deps)`);
    });
  }
  
  // Save analysis
  const outputPath = path.join(rootDir, '.migration-order.json');
  fs.writeFileSync(outputPath, JSON.stringify(order, null, 2));
  console.error(`\n💾 Full analysis saved to .migration-order.json`);
}

main();
