#!/usr/bin/env node

/**
 * Tracks migration progress over time
 * - Counts JS vs TS files
 * - Tracks any type usage
 * - Records test pass rate
 * - Generates progress report
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const {
  formatError,
  formatSuccess,
  formatInfo,
  formatWarning,
  parseArgs
} = require('./error-utils');

const PROGRESS_FILE = '.migration-progress.json';

function findFiles(rootDir, extensions) {
  const files = [];
  
  function walk(dir) {
    try {
      const entries = fs.readdirSync(dir, { withFileTypes: true });
      
      for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);
        
        if (entry.isDirectory()) {
          if (entry.name !== 'node_modules' && entry.name !== 'dist' && entry.name !== 'build' && entry.name !== '.git') {
            walk(fullPath);
          }
        } else if (entry.isFile()) {
          const ext = path.extname(entry.name);
          if (extensions.includes(ext)) {
            files.push(fullPath);
          }
        }
      }
    } catch {
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

function countFileTypes(files) {
  const counts = {
    js: 0,
    jsx: 0,
    ts: 0,
    tsx: 0
  };
  
  for (const file of files) {
    const ext = path.extname(file);
    if (ext === '.js') counts.js++;
    else if (ext === '.jsx') counts.jsx++;
    else if (ext === '.ts') counts.ts++;
    else if (ext === '.tsx') counts.tsx++;
  }
  
  return counts;
}

function countAnyTypes(files) {
  const results = {
    total: 0,
    explicit: 0,
    implicit: 0,
    byFile: {}
  };
  
  for (const file of files) {
    if (!file.endsWith('.ts') && !file.endsWith('.tsx')) continue;
    
    try {
      const content = fs.readFileSync(file, 'utf-8');
      const lines = content.split('\n');
      let fileCount = 0;
      
      for (const line of lines) {
        // Explicit any
        const explicitMatches = line.match(/:\s*any\b/g);
        if (explicitMatches) {
          results.explicit += explicitMatches.length;
          fileCount += explicitMatches.length;
        }
        
        // any assertions
        const assertionMatches = line.match(/\bas\s+any\b/g);
        if (assertionMatches) {
          results.explicit += assertionMatches.length;
          fileCount += assertionMatches.length;
        }
        
        // any arrays
        const arrayMatches = line.match(/:\s*any\[\]/g);
        if (arrayMatches) {
          results.explicit += arrayMatches.length;
          fileCount += arrayMatches.length;
        }
      }
      
      if (fileCount > 0) {
        results.byFile[file] = fileCount;
      }
      
      results.total = results.explicit + results.implicit;
    } catch {
      // Skip files we can't read
    }
  }
  
  return results;
}

function countTsIgnores(files) {
  let count = 0;
  const byFile = {};
  
  for (const file of files) {
    if (!file.endsWith('.ts') && !file.endsWith('.tsx')) continue;
    
    try {
      const content = fs.readFileSync(file, 'utf-8');
      const matches = content.match(/@ts-ignore|@ts-nocheck|@ts-expect-error/g);
      
      if (matches) {
        count += matches.length;
        byFile[file] = matches.length;
      }
    } catch {
      // Skip
    }
  }
  
  return { total: count, byFile };
}

function getTypeCoverage(rootDir) {
  try {
    // Try using type-coverage if installed
    const output = execSync('npx type-coverage --detail', {
      cwd: rootDir,
      encoding: 'utf-8',
      timeout: 60000,
      stdio: ['pipe', 'pipe', 'pipe']
    });
    
    const match = output.match(/(\d+\.\d+)%/);
    if (match) {
      return { percentage: parseFloat(match[1]), available: true };
    }
  } catch {
    // type-coverage not available
  }
  
  return { percentage: null, available: false };
}

function countTypeScriptErrors(rootDir) {
  try {
    const output = execSync('npx tsc --noEmit 2>&1 || true', {
      cwd: rootDir,
      encoding: 'utf-8',
      timeout: 120000
    });
    
    const errorMatches = output.match(/error TS\d+/g);
    return errorMatches ? errorMatches.length : 0;
  } catch {
    return null;
  }
}

function loadProgressHistory(rootDir) {
  const progressPath = path.join(rootDir, PROGRESS_FILE);
  
  if (fs.existsSync(progressPath)) {
    try {
      return JSON.parse(fs.readFileSync(progressPath, 'utf-8'));
    } catch {
      return { history: [] };
    }
  }
  
  return { history: [] };
}

function saveProgressHistory(rootDir, history) {
  const progressPath = path.join(rootDir, PROGRESS_FILE);
  fs.writeFileSync(progressPath, JSON.stringify(history, null, 2));
}

function calculateProgress(current, previous) {
  if (!previous) return null;
  
  const jsThen = previous.fileCounts.js + previous.fileCounts.jsx;
  const tsThen = previous.fileCounts.ts + previous.fileCounts.tsx;
  const totalThen = jsThen + tsThen;
  
  const jsNow = current.fileCounts.js + current.fileCounts.jsx;
  const tsNow = current.fileCounts.ts + current.fileCounts.tsx;
  const totalNow = jsNow + tsNow;
  
  const migrationRateThen = totalThen > 0 ? (tsThen / totalThen) * 100 : 0;
  const migrationRateNow = totalNow > 0 ? (tsNow / totalNow) * 100 : 0;
  
  return {
    filesConverted: tsNow - tsThen,
    anyTypesReduced: (previous.anyTypes?.total || 0) - current.anyTypes.total,
    migrationRateChange: migrationRateNow - migrationRateThen,
    errorsReduced: (previous.typeScriptErrors || 0) - (current.typeScriptErrors || 0)
  };
}

function generateReport(rootDir, current, previous, diff) {
  const jsCount = current.fileCounts.js + current.fileCounts.jsx;
  const tsCount = current.fileCounts.ts + current.fileCounts.tsx;
  const total = jsCount + tsCount;
  const migrationRate = total > 0 ? (tsCount / total) * 100 : 0;
  
  const lines = [];
  
  lines.push('╔════════════════════════════════════════════════════════════╗');
  lines.push('║              TypeScript Migration Progress                  ║');
  lines.push('╠════════════════════════════════════════════════════════════╣');
  
  // File counts
  lines.push('║ File Counts                                                 ║');
  lines.push('╠════════════════════════════════════════════════════════════╣');
  lines.push(`║   JavaScript files:  ${String(jsCount).padStart(5)}                                ║`);
  lines.push(`║   TypeScript files:  ${String(tsCount).padStart(5)}                                ║`);
  lines.push(`║   Migration rate:    ${migrationRate.toFixed(1).padStart(5)}%                             ║`);
  
  // Type issues
  lines.push('╠════════════════════════════════════════════════════════════╣');
  lines.push('║ Type Issues                                                 ║');
  lines.push('╠════════════════════════════════════════════════════════════╣');
  lines.push(`║   any types:         ${String(current.anyTypes.total).padStart(5)}                                ║`);
  lines.push(`║   @ts-ignore:        ${String(current.tsIgnores.total).padStart(5)}                                ║`);
  lines.push(`║   TS errors:         ${String(current.typeScriptErrors ?? 'N/A').padStart(5)}                                ║`);
  
  // Progress
  if (diff) {
    lines.push('╠════════════════════════════════════════════════════════════╣');
    lines.push('║ Changes Since Last Check                                    ║');
    lines.push('╠════════════════════════════════════════════════════════════╣');
    lines.push(`║   Files converted:   ${String(diff.filesConverted).padStart(5)}                                ║`);
    lines.push(`║   any types fixed:   ${String(diff.anyTypesReduced).padStart(5)}                                ║`);
    lines.push(`║   Migration rate:    ${(diff.migrationRateChange >= 0 ? '+' : '') + diff.migrationRateChange.toFixed(1).padStart(4)}%                            ║`);
  }
  
  lines.push('╚════════════════════════════════════════════════════════════╝');
  
  return lines.join('\n');
}

function main() {
  const args = parseArgs(process.argv.slice(2));
  const rootDir = args.positional[0] || process.cwd();
  const verbose = args.options.verbose || args.options.v || false;
  const json = args.options.json || false;
  const reset = args.options.reset || false;
  
  console.error('=== Tracking Migration Progress ===\n');
  
  // Load previous progress
  const progressHistory = loadProgressHistory(rootDir);
  const previousEntry = progressHistory.history.length > 0 
    ? progressHistory.history[progressHistory.history.length - 1]
    : null;
  
  if (reset) {
    progressHistory.history = [];
    saveProgressHistory(rootDir, progressHistory);
    console.error(formatSuccess('Progress history reset'));
    return;
  }
  
  // Find all source files
  const allFiles = findFiles(rootDir, ['.js', '.jsx', '.ts', '.tsx']);
  const tsFiles = allFiles.filter(f => f.endsWith('.ts') || f.endsWith('.tsx'));
  
  // Collect current metrics
  const currentEntry = {
    timestamp: new Date().toISOString(),
    fileCounts: countFileTypes(allFiles),
    anyTypes: countAnyTypes(allFiles),
    tsIgnores: countTsIgnores(allFiles),
    typeCoverage: getTypeCoverage(rootDir),
    typeScriptErrors: countTypeScriptErrors(rootDir)
  };
  
  // Calculate progress
  const diff = calculateProgress(currentEntry, previousEntry);
  
  // Save current progress
  progressHistory.history.push(currentEntry);
  
  // Keep only last 30 entries
  if (progressHistory.history.length > 30) {
    progressHistory.history = progressHistory.history.slice(-30);
  }
  
  saveProgressHistory(rootDir, progressHistory);
  
  // Generate report
  const report = generateReport(rootDir, currentEntry, previousEntry, diff);
  
  if (!json) {
    console.error(report);
    
    if (verbose) {
      console.error('\nFiles with most any types:');
      const sortedFiles = Object.entries(currentEntry.anyTypes.byFile)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 10);
      
      for (const [file, count] of sortedFiles) {
        console.error(`  ${count}x: ${path.relative(rootDir, file)}`);
      }
    }
  }
  
  // Output JSON
  const result = {
    ...currentEntry,
    progress: diff,
    historyLength: progressHistory.history.length
  };
  
  console.log(JSON.stringify(result, null, 2));
}

main();
