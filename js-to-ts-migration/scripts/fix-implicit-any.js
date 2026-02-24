#!/usr/bin/env node

/**
 * Automatically fixes implicit any types in TypeScript files
 * Analyzes function parameters and infers types from usage
 * Handles common patterns: events, callbacks, API responses, etc.
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const {
  formatError,
  formatSuccess,
  formatInfo,
  formatWarning,
  validatePrerequisites,
  parseArgs
} = require('./error-utils');

// Patterns that indicate implicit any
const IMPLICIT_ANY_PATTERNS = {
  // Function declarations without types
  functionDeclaration: /function\s+(\w+)\s*\(([^)]*)\)\s*\{/g,
  
  // Arrow functions without types
  arrowFunction: /(?:const|let|var)?\s*(\w+)\s*=\s*(?:\(([^)]*)\)|(\w+))\s*=>/g,
  
  // Method declarations without types
  methodDeclaration: /(\w+)\s*\(([^)]*)\)\s*\{/g,
  
  // Callback parameters in array methods
  arrayCallback: /\.(map|filter|reduce|forEach|find|some|every)\s*\(\s*(?:\(([^)]*)\)|(\w+))\s*=>/g,
  
  // Event handlers
  eventHandler: /(?:on\w+|addEventListener)\s*\(\s*['"][^'"]+['"]\s*,\s*(?:\(([^)]*)\)|(\w+))/g
};

// Type inference patterns based on parameter name
const TYPE_BY_NAME = {
  // Events
  'event': 'Event',
  'e': 'Event',
  'evt': 'Event',
  'event\b': 'Event',
  'reactEvent': 'React.SyntheticEvent',
  'changeEvent': 'React.ChangeEvent<HTMLInputElement>',
  'clickEvent': 'React.MouseEvent<HTMLElement>',
  'submitEvent': 'React.FormEvent<HTMLFormElement>',
  'keyboardEvent': 'KeyboardEvent',
  'mouseEvent': 'MouseEvent',
  
  // Common data
  'id': 'string | number',
  'index': 'number',
  'key': 'string',
  'value': 'unknown',
  'data': 'unknown',
  'item': 'unknown',
  'element': 'unknown',
  'node': 'Node',
  'props': 'Record<string, unknown>',
  'options': 'Record<string, unknown>',
  'config': 'Record<string, unknown>',
  'params': 'Record<string, string>',
  'query': 'Record<string, string>',
  'body': 'unknown',
  'response': 'Response',
  'result': 'unknown',
  'error': 'Error',
  'err': 'Error',
  
  // React specific
  'children': 'React.ReactNode',
  'ref': 'React.RefObject<HTMLElement>',
  'component': 'React.ComponentType',
  
  // API/HTTP
  'req': 'Request',
  'request': 'Request',
  'res': 'Response',
  'response': 'Response',
  'next': 'NextFunction',
  
  // Arrays
  'array': 'unknown[]',
  'arr': 'unknown[]',
  'list': 'unknown[]',
  'items': 'unknown[]',
  
  // Functions
  'callback': 'Function',
  'cb': 'Function',
  'fn': 'Function',
  'handler': 'Function',
  'onChange': '(value: unknown) => void',
  'onClick': '(event: React.MouseEvent) => void',
  'onSubmit': '(event: React.FormEvent) => void',
  
  // DOM
  'element': 'HTMLElement',
  'el': 'HTMLElement',
  'container': 'HTMLElement',
  'target': 'EventTarget',
  'currentTarget': 'EventTarget',
  
  // Numbers
  'count': 'number',
  'total': 'number',
  'sum': 'number',
  'length': 'number',
  'size': 'number',
  'width': 'number',
  'height': 'number',
  'x': 'number',
  'y': 'number',
  'offset': 'number',
  'limit': 'number',
  'page': 'number',
  
  // Strings
  'name': 'string',
  'title': 'string',
  'label': 'string',
  'text': 'string',
  'message': 'string',
  'url': 'string',
  'path': 'string',
  'email': 'string',
  'username': 'string',
  'password': 'string',
  'token': 'string',
  
  // Booleans
  'enabled': 'boolean',
  'disabled': 'boolean',
  'active': 'boolean',
  'visible': 'boolean',
  'loading': 'boolean',
  'valid': 'boolean',
  'success': 'boolean',
  'isOpen': 'boolean',
  'isLoading': 'boolean',
  'isValid': 'boolean',
  'isActive': 'boolean'
};

function findTsFiles(rootDir, includeTests = false) {
  const files = [];
  
  function walk(dir) {
    try {
      const entries = fs.readdirSync(dir, { withFileTypes: true });
      
      for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);
        
        if (entry.isDirectory()) {
          const skipDirs = ['node_modules', 'dist', 'build', '.git', 'coverage', '.next', '.nuxt'];
          if (!skipDirs.includes(entry.name)) {
            walk(fullPath);
          }
        } else if (entry.isFile()) {
          const ext = path.extname(entry.name);
          if (['.ts', '.tsx'].includes(ext)) {
            if (includeTests || !isTestFile(fullPath)) {
              files.push(fullPath);
            }
          }
        }
      }
    } catch (error) {
      // Skip directories we can't read
    }
  }
  
  const srcDir = path.join(rootDir, 'src');
  if (fs.existsSync(srcDir)) {
    walk(srcDir);
  } else {
    walk(rootDir);
  }
  
  return files;
}

function isTestFile(filePath) {
  const testPatterns = [
    /\.test\./,
    /\.spec\./,
    /__tests__/,
    /__mocks__/,
    /\.e2e\./,
    /test\//,
    /tests\//
  ];
  return testPatterns.some(pattern => pattern.test(filePath));
}

function inferTypeFromUsage(fileContent, paramName, functionStart) {
  // Look for property access patterns
  const patterns = [
    { regex: new RegExp(`${paramName}\\.length`, 'g'), type: 'string | unknown[]' },
    { regex: new RegExp(`${paramName}\\.map\\(`, 'g'), type: 'unknown[]' },
    { regex: new RegExp(`${paramName}\\.filter\\(`, 'g'), type: 'unknown[]' },
    { regex: new RegExp(`${paramName}\\.forEach\\(`, 'g'), type: 'unknown[]' },
    { regex: new RegExp(`${paramName}\\.push\\(`, 'g'), type: 'unknown[]' },
    { regex: new RegExp(`${paramName}\\.match\\(`, 'g'), type: 'string' },
    { regex: new RegExp(`${paramName}\\.split\\(`, 'g'), type: 'string' },
    { regex: new RegExp(`${paramName}\\.substring\\(`, 'g'), type: 'string' },
    { regex: new RegExp(`${paramName}\\.toLowerCase\\(`, 'g'), type: 'string' },
    { regex: new RegExp(`${paramName}\\.toUpperCase\\(`, 'g'), type: 'string' },
    { regex: new RegExp(`${paramName}\\.trim\\(`, 'g'), type: 'string' },
    { regex: new RegExp(`${paramName}\\.replace\\(`, 'g'), type: 'string' },
    { regex: new RegExp(`${paramName}\\.test\\(`, 'g'), type: 'RegExp' },
    { regex: new RegExp(`${paramName}\\.exec\\(`, 'g'), type: 'RegExp' },
    { regex: new RegExp(`${paramName}\\.getTime\\(`, 'g'), type: 'Date' },
    { regex: new RegExp(`${paramName}\\.toISOString\\(`, 'g'), type: 'Date' },
    { regex: new RegExp(`${paramName}\\.getFullYear\\(`, 'g'), type: 'Date' },
    { regex: new RegExp(`${paramName}\\.then\\(`, 'g'), type: 'Promise<unknown>' },
    { regex: new RegExp(`${paramName}\\.catch\\(`, 'g'), type: 'Promise<unknown>' },
    { regex: new RegExp(`${paramName}\\.json\\(`, 'g'), type: 'Response' },
    { regex: new RegExp(`${paramName}\\.preventDefault\\(`, 'g'), type: 'Event' },
    { regex: new RegExp(`${paramName}\\.stopPropagation\\(`, 'g'), type: 'Event' },
    { regex: new RegExp(`${paramName}\\.target`, 'g'), type: 'Event' },
    { regex: new RegExp(`${paramName}\\.currentTarget`, 'g'), type: 'Event' },
    { regex: new RegExp(`${paramName}\\.focus\\(`, 'g'), type: 'HTMLElement' },
    { regex: new RegExp(`${paramName}\\.blur\\(`, 'g'), type: 'HTMLElement' },
    { regex: new RegExp(`${paramName}\\.click\\(`, 'g'), type: 'HTMLElement' },
    { regex: new RegExp(`${paramName}\\.querySelector`, 'g'), type: 'Document | HTMLElement' },
    { regex: new RegExp(`${paramName}\\.getElementById`, 'g'), type: 'Document' },
    { regex: new RegExp(`${paramName}\\.createElement`, 'g'), type: 'Document' },
    { regex: new RegExp(`${paramName}\\.setState\\(`, 'g'), type: 'React.Component' },
    { regex: new RegExp(`${paramName}\\.render\\(`, 'g'), type: 'React.Component' }
  ];
  
  for (const pattern of patterns) {
    if (pattern.regex.test(fileContent)) {
      return pattern.type;
    }
  }
  
  // Check for name-based inference
  for (const [namePattern, type] of Object.entries(TYPE_BY_NAME)) {
    const regex = new RegExp(`^${namePattern}$`);
    if (regex.test(paramName)) {
      return type;
    }
  }
  
  return 'unknown';
}

function analyzeFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf-8');
  const lines = content.split('\n');
  const fixes = [];
  
  // Track if file has React imports
  const hasReactImport = content.includes("import React") || content.includes("from 'react'");
  
  lines.forEach((line, index) => {
    const lineNum = index + 1;
    
    // Skip lines that already have type annotations
    if (line.includes(': ') && /\w+\s*:\s*\w+/.test(line)) {
      return;
    }
    
    // Skip JSDoc comments
    if (line.trim().startsWith('*') || line.trim().startsWith('/**')) {
      return;
    }
    
    // Function declarations: function foo(a, b) {
    const funcMatch = line.match(/function\s+(\w+)\s*\(([^)]*)\)\s*\{/);
    if (funcMatch) {
      const params = parseParams(funcMatch[2]);
      const typedParams = params.map(p => {
        if (p.includes(':')) return p; // Already typed
        const type = inferTypeFromName(p, hasReactImport);
        return `${p}: ${type}`;
      });
      
      if (typedParams.some((p, i) => p !== params[i])) {
        fixes.push({
          line: lineNum,
          original: line,
          fixed: line.replace(funcMatch[2], typedParams.join(', ')),
          params: params.filter((p, i) => typedParams[i] !== p)
        });
      }
    }
    
    // Arrow functions in callbacks: .map(item =>
    const arrowMatch = line.match(/\.(map|filter|reduce|forEach|find)\s*\(\s*(\w+)\s*=>/);
    if (arrowMatch && !line.includes(':')) {
      const param = arrowMatch[2];
      const type = inferTypeFromUsage(content, param, index) || 'unknown';
      
      fixes.push({
        line: lineNum,
        original: line,
        fixed: line.replace(`${param} =>`, `${param}: ${type} =>`),
        params: [param]
      });
    }
    
    // Destructured parameters without types
    const destructMatch = line.match(/function\s+\w+\s*\(\s*\{\s*([^}]+)\s*\}\s*\)/);
    if (destructMatch && !line.includes(':')) {
      const props = destructMatch[1].split(',').map(p => p.trim()).filter(Boolean);
      const typedProps = props.map(p => {
        if (p.includes(':')) return p;
        return `${p}: unknown`;
      });
      
      if (typedProps.some((p, i) => p !== props[i])) {
        fixes.push({
          line: lineNum,
          original: line,
          fixed: line.replace(destructMatch[1], typedProps.join(', ')),
          params: props
        });
      }
    }
  });
  
  return { file: filePath, fixes, hasReactImport };
}

function inferTypeFromName(paramName, hasReactImport) {
  // Direct name match
  if (TYPE_BY_NAME[paramName]) {
    let type = TYPE_BY_NAME[paramName];
    // Adjust React types if no React import
    if (!hasReactImport && type.startsWith('React.')) {
      return 'unknown';
    }
    return type;
  }
  
  // Pattern matching
  if (/Event$/.test(paramName)) return 'Event';
  if (/Handler$/.test(paramName)) return 'Function';
  if (/Callback$/.test(paramName)) return 'Function';
  if (/Props$/.test(paramName)) return 'Record<string, unknown>';
  if (/Config$/.test(paramName)) return 'Record<string, unknown>';
  if (/Options$/.test(paramName)) return 'Record<string, unknown>';
  if (/Ref$/.test(paramName)) return hasReactImport ? 'React.RefObject<unknown>' : 'unknown';
  
  // Prefix matching
  if (/^is[A-Z]/.test(paramName)) return 'boolean';
  if (/^has[A-Z]/.test(paramName)) return 'boolean';
  if (/^can[A-Z]/.test(paramName)) return 'boolean';
  if (/^should[A-Z]/.test(paramName)) return 'boolean';
  if (/^get[A-Z]/.test(paramName)) return 'Function';
  if (/^set[A-Z]/.test(paramName)) return 'Function';
  if (/^handle[A-Z]/.test(paramName)) return 'Function';
  if (/^on[A-Z]/.test(paramName)) return 'Function';
  
  return 'unknown';
}

function parseParams(paramsStr) {
  if (!paramsStr.trim()) return [];
  return paramsStr.split(',').map(p => p.trim()).filter(Boolean);
}

function applyFixes(filePath, analysis, dryRun = false) {
  let content = fs.readFileSync(filePath, 'utf-8');
  const lines = content.split('\n');
  
  // Apply fixes from bottom to top to preserve line numbers
  const sortedFixes = [...analysis.fixes].sort((a, b) => b.line - a.line);
  
  for (const fix of sortedFixes) {
    if (lines[fix.line - 1] === fix.original) {
      if (!dryRun) {
        lines[fix.line - 1] = fix.fixed;
      }
    }
  }
  
  if (!dryRun) {
    fs.writeFileSync(filePath, lines.join('\n'));
  }
  
  return analysis.fixes.length;
}

function runTypeCheck(rootDir, packageManager) {
  const npxCmd = packageManager === 'pnpm' ? 'pnpx' : 'npx';
  
  try {
    const output = execSync(`${npxCmd} tsc --noEmit 2>&1`, { 
      encoding: 'utf-8',
      cwd: rootDir
    });
    return { success: true, errors: 0, output };
  } catch (error) {
    const output = error.stdout?.toString() || error.message;
    const errorMatches = output.match(/error TS\d+/g) || [];
    return { success: false, errors: errorMatches.length, output };
  }
}

function detectPackageManager(rootDir) {
  if (fs.existsSync(path.join(rootDir, 'pnpm-lock.yaml'))) return 'pnpm';
  if (fs.existsSync(path.join(rootDir, 'yarn.lock'))) return 'yarn';
  return 'npm';
}

function main() {
  const args = parseArgs(process.argv.slice(2));
  const rootDir = args.positional[0] || process.cwd();
  const dryRun = args.options['dry-run'] || false;
  const verbose = args.options.verbose || args.options.v || false;
  
  console.error('=== Fixing Implicit Any Types ===\n');
  
  // Validate prerequisites
  const errors = validatePrerequisites(rootDir, { packageJson: true, tsconfig: true });
  if (errors.length > 0) {
    console.error(formatError(new Error(errors.join('\n')), 'Prerequisites'));
    process.exit(1);
  }
  
  const packageManager = detectPackageManager(rootDir);
  
  // Find all TS files
  console.error(formatInfo('Finding TypeScript files...'));
  const files = findTsFiles(rootDir);
  console.error(formatSuccess(`Found ${files.length} TypeScript files`));
  
  if (files.length === 0) {
    console.error(formatWarning('No TypeScript files found'));
    process.exit(0);
  }
  
  // Analyze files
  console.error(formatInfo('Analyzing files for implicit any...'));
  const results = [];
  let totalFixes = 0;
  
  for (const file of files) {
    const analysis = analyzeFile(file);
    if (analysis.fixes.length > 0) {
      results.push(analysis);
      totalFixes += analysis.fixes.length;
      
      if (verbose) {
        console.error(`  ${path.relative(rootDir, file)}: ${analysis.fixes.length} issues`);
      }
    }
  }
  
  console.error(formatSuccess(`Found ${totalFixes} implicit any patterns in ${results.length} files`));
  
  if (totalFixes === 0) {
    console.error(formatSuccess('No implicit any types found!'));
    process.exit(0);
  }
  
  // Show sample of fixes
  if (!verbose) {
    console.error('\n=== Sample Fixes ===');
    results.slice(0, 3).forEach(result => {
      console.error(`\n${path.relative(rootDir, result.file)}:`);
      result.fixes.slice(0, 2).forEach(fix => {
        console.error(`  Line ${fix.line}:`);
        console.error(`    - ${fix.original.substring(0, 60)}...`);
        console.error(`    + ${fix.fixed.substring(0, 60)}...`);
      });
    });
  }
  
  // Apply fixes
  if (dryRun) {
    console.error(formatWarning('\nDRY RUN - No files modified'));
  } else {
    console.error(formatInfo('\nApplying fixes...'));
    for (const result of results) {
      const count = applyFixes(result.file, result, false);
      if (verbose) {
        console.error(`  Fixed ${count} issues in ${path.relative(rootDir, result.file)}`);
      }
    }
    console.error(formatSuccess('Fixes applied successfully'));
    
    // Run type check
    console.error(formatInfo('\nRunning TypeScript check...'));
    const typeCheck = runTypeCheck(rootDir, packageManager);
    
    if (typeCheck.success) {
      console.error(formatSuccess('✓ No TypeScript errors'));
    } else {
      console.error(formatWarning(`⚠ ${typeCheck.errors} TypeScript errors (some may need manual fixing)`));
    }
  }
  
  // Summary
  console.error('\n=== Summary ===');
  console.error(`Files analyzed: ${files.length}`);
  console.error(`Files with implicit any: ${results.length}`);
  console.error(`Total fixes ${dryRun ? 'needed' : 'applied'}: ${totalFixes}`);
  
  if (!dryRun) {
    console.error('\nNext steps:');
    console.error('  1. Review the changes in your files');
    console.error('  2. Replace "unknown" types with specific types');
    console.error('  3. Run "npx tsc --noEmit" to check for remaining errors');
    console.error('  4. Run replace-any-types.js to fix explicit any types');
  }
  
  // Output result
  const result = {
    success: true,
    dryRun,
    filesAnalyzed: files.length,
    filesWithIssues: results.length,
    totalFixes,
    details: results.map(r => ({
      file: path.relative(rootDir, r.file),
      fixes: r.fixes.length
    }))
  };
  
  console.log(JSON.stringify(result, null, 2));
}

main();
