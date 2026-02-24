#!/usr/bin/env node

/**
 * Runs tests, captures failures, and suggests fixes for type-related errors
 * Iterates until all tests pass
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

function detectTestCommand(rootDir) {
  const packageJsonPath = path.join(rootDir, 'package.json');
  
  try {
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'));
    const deps = { ...packageJson.dependencies, ...packageJson.devDependencies };
    const scripts = packageJson.scripts || {};
    
    // Check for specific test frameworks
    if (deps['vitest']) {
      return { command: 'npx vitest run', framework: 'vitest' };
    }
    
    if (deps['jest']) {
      // Check for specific jest config
      if (scripts.test && scripts.test.includes('jest')) {
        return { command: scripts.test, framework: 'jest' };
      }
      return { command: 'npx jest', framework: 'jest' };
    }
    
    if (deps['mocha']) {
      return { command: 'npx mocha', framework: 'mocha' };
    }
    
    // Fall back to npm test
    if (scripts.test) {
      return { command: 'npm test', framework: 'npm' };
    }
  } catch {
    // Ignore
  }
  
  return { command: 'npm test', framework: 'unknown' };
}

function runTests(rootDir, testCommand) {
  try {
    const output = execSync(testCommand, {
      cwd: rootDir,
      encoding: 'utf-8',
      timeout: 300000, // 5 minutes
      stdio: ['pipe', 'pipe', 'pipe']
    });
    
    return {
      success: true,
      output,
      errors: []
    };
  } catch (error) {
    const output = error.stdout || '' + error.stderr || '';
    
    return {
      success: false,
      output,
      errors: parseTestErrors(output, error)
    };
  }
}

function parseTestErrors(output, error) {
  const errors = [];
  
  // Jest error patterns
  const jestFilePattern = /FAIL\s+(.+\.(?:test|spec)\.(?:ts|tsx|js|jsx))/g;
  let match;
  while ((match = jestFilePattern.exec(output)) !== null) {
    errors.push({
      file: match[1],
      type: 'test_failure',
      framework: 'jest'
    });
  }
  
  // TypeScript errors in tests
  const tsErrorPattern = /(.+\.(?:ts|tsx))\((\d+),(\d+)\):\s+error\s+TS(\d+):\s+(.+)/g;
  while ((match = tsErrorPattern.exec(output)) !== null) {
    errors.push({
      file: match[1],
      line: parseInt(match[2]),
      column: parseInt(match[3]),
      code: `TS${match[4]}`,
      message: match[5],
      type: 'typescript_error'
    });
  }
  
  // Vitest error patterns
  const vitestFailPattern = /✗\s+(.+)\s+\[\d+.\d+ms\]/g;
  while ((match = vitestFailPattern.exec(output)) !== null) {
    errors.push({
      test: match[1],
      type: 'test_failure',
      framework: 'vitest'
    });
  }
  
  // General assertion errors
  const assertionPattern = /AssertionError:\s+(.+)/g;
  while ((match = assertionPattern.exec(output)) !== null) {
    errors.push({
      message: match[1],
      type: 'assertion_error'
    });
  }
  
  return errors;
}

function categorizeErrors(errors) {
  const categories = {
    typeErrors: [],
    importErrors: [],
    mockErrors: [],
    assertionErrors: [],
    other: []
  };
  
  for (const error of errors) {
    if (error.type === 'typescript_error') {
      if (error.code === 'TS2307' || error.message.includes('module')) {
        categories.importErrors.push(error);
      } else if (error.message.includes('mock') || error.message.includes('jest')) {
        categories.mockErrors.push(error);
      } else {
        categories.typeErrors.push(error);
      }
    } else if (error.type === 'assertion_error') {
      categories.assertionErrors.push(error);
    } else {
      categories.other.push(error);
    }
  }
  
  return categories;
}

function generateFixSuggestions(categories) {
  const suggestions = [];
  
  // Type error fixes
  for (const error of categories.typeErrors) {
    if (error.code === 'TS2339') {
      suggestions.push({
        file: error.file,
        line: error.line,
        type: 'missing_property',
        suggestion: `Property '${error.message.split("'")[1]}' does not exist. Check the type definition or add optional chaining.`
      });
    } else if (error.code === 'TS2345') {
      suggestions.push({
        file: error.file,
        line: error.line,
        type: 'type_mismatch',
        suggestion: `Type mismatch: ${error.message}. Consider type assertion or fix the type.`
      });
    } else if (error.code === 'TS2322') {
      suggestions.push({
        file: error.file,
        line: error.line,
        type: 'assignment_error',
        suggestion: `Cannot assign type: ${error.message}. Check the expected type.`
      });
    } else if (error.code === 'TS2769') {
      suggestions.push({
        file: error.file,
        line: error.line,
        type: 'overload_error',
        suggestion: `No matching overload: ${error.message}. Check function signature.`
      });
    }
  }
  
  // Import error fixes
  for (const error of categories.importErrors) {
    suggestions.push({
      file: error.file,
      line: error.line,
      type: 'import_fix',
      suggestion: 'Check if the module has a type definition. Try: import type { ... } or check path.'
    });
  }
  
  // Mock error fixes
  for (const error of categories.mockErrors) {
    suggestions.push({
      file: error.file,
      line: error.line,
      type: 'mock_fix',
      suggestion: 'Add proper type to mock: jest.fn<() => ReturnType>() or mockImplementation<(...args) => ReturnType>'
    });
  }
  
  return suggestions;
}

function checkTypeScript(rootDir) {
  try {
    const output = execSync('npx tsc --noEmit', {
      cwd: rootDir,
      encoding: 'utf-8',
      timeout: 120000
    });
    
    return { success: true, errors: [] };
  } catch (error) {
    const output = error.stdout || '' + error.stderr || '';
    const errors = [];
    
    const errorPattern = /(.+\.(?:ts|tsx))\((\d+),(\d+)\):\s+error\s+TS(\d+):\s+(.+)/g;
    let match;
    while ((match = errorPattern.exec(output)) !== null) {
      errors.push({
        file: match[1],
        line: parseInt(match[2]),
        column: parseInt(match[3]),
        code: `TS${match[4]}`,
        message: match[5]
      });
    }
    
    return { success: false, errors };
  }
}

function countErrorsByType(errors) {
  const counts = {};
  for (const error of errors) {
    const type = error.code || error.type || 'unknown';
    counts[type] = (counts[type] || 0) + 1;
  }
  return counts;
}

function main() {
  const args = parseArgs(process.argv.slice(2));
  const rootDir = args.positional[0] || process.cwd();
  const maxIterations = parseInt(args.options['max-iterations']) || 5;
  const verbose = args.options.verbose || args.options.v || false;
  const skipTsCheck = args.options['skip-ts-check'] || false;
  
  console.error('=== Running Tests and Fixing ===\n');
  
  // Validate prerequisites
  const errors = validatePrerequisites(rootDir, { packageJson: true });
  if (errors.length > 0) {
    console.error(formatError(new Error(errors.join('\n')), 'Prerequisites'));
    process.exit(1);
  }
  
  // Detect test command
  const { command: testCommand, framework } = detectTestCommand(rootDir);
  console.error(formatInfo(`Test command: ${testCommand}`));
  console.error(formatInfo(`Framework: ${framework}`));
  
  const result = {
    success: false,
    iterations: 0,
    finalStatus: '',
    testRuns: [],
    typeErrors: [],
    fixSuggestions: []
  };
  
  let iteration = 0;
  let lastErrorCount = Infinity;
  
  while (iteration < maxIterations) {
    iteration++;
    result.iterations = iteration;
    
    console.error(`\n=== Iteration ${iteration}/${maxIterations} ===`);
    
    // First, check TypeScript compilation
    if (!skipTsCheck) {
      console.error(formatInfo('Checking TypeScript compilation...'));
      const tsResult = checkTypeScript(rootDir);
      
      if (!tsResult.success) {
        console.error(formatWarning(`TypeScript has ${tsResult.errors.length} errors`));
        result.typeErrors = tsResult.errors;
        
        // Categorize and generate suggestions
        const categories = categorizeErrors(tsResult.errors);
        const suggestions = generateFixSuggestions(categories);
        result.fixSuggestions = suggestions;
        
        console.error('\nType errors by type:');
        const errorCounts = countErrorsByType(tsResult.errors);
        for (const [code, count] of Object.entries(errorCounts)) {
          console.error(`  ${code}: ${count}`);
        }
        
        if (suggestions.length > 0 && verbose) {
          console.error('\nFix suggestions:');
          suggestions.slice(0, 10).forEach((s, i) => {
            console.error(`  ${i + 1}. ${s.file}:${s.line} - ${s.suggestion}`);
          });
          if (suggestions.length > 10) {
            console.error(`  ... and ${suggestions.length - 10} more`);
          }
        }
        
        console.error('\nPlease fix the TypeScript errors above before running tests.');
        console.error('Run: npx tsc --noEmit');
        
        break;
      } else {
        console.error(formatSuccess('TypeScript compilation passed'));
      }
    }
    
    // Run tests
    console.error(formatInfo('Running tests...'));
    const testResult = runTests(rootDir, testCommand);
    result.testRuns.push({
      iteration,
      success: testResult.success,
      errorCount: testResult.errors.length
    });
    
    if (testResult.success) {
      console.error(formatSuccess('All tests passed!'));
      result.success = true;
      result.finalStatus = 'all_tests_passed';
      break;
    }
    
    console.error(formatWarning(`${testResult.errors.length} test errors found`));
    
    // Categorize errors
    const categories = categorizeErrors(testResult.errors);
    
    console.error('\nError categories:');
    console.error(`  Type errors: ${categories.typeErrors.length}`);
    console.error(`  Import errors: ${categories.importErrors.length}`);
    console.error(`  Mock errors: ${categories.mockErrors.length}`);
    console.error(`  Assertion errors: ${categories.assertionErrors.length}`);
    console.error(`  Other: ${categories.other.length}`);
    
    // Generate fix suggestions
    const suggestions = generateFixSuggestions(categories);
    result.fixSuggestions = suggestions;
    
    if (verbose && suggestions.length > 0) {
      console.error('\nFix suggestions:');
      suggestions.slice(0, 10).forEach((s, i) => {
        console.error(`  ${i + 1}. ${s.file || 'unknown'}${s.line ? `:${s.line}` : ''} - ${s.suggestion}`);
      });
    }
    
    // Check if we're making progress
    const currentErrorCount = testResult.errors.length;
    if (currentErrorCount >= lastErrorCount) {
      console.error(formatWarning('Error count not decreasing. Stopping iterations.'));
      result.finalStatus = 'no_progress';
      break;
    }
    
    lastErrorCount = currentErrorCount;
    
    console.error('\nPlease fix the errors above and run this script again.');
  }
  
  if (iteration >= maxIterations && !result.success) {
    result.finalStatus = 'max_iterations_reached';
    console.error(formatWarning(`Max iterations (${maxIterations}) reached`));
  }
  
  // Print summary
  console.error('\n=== Summary ===');
  console.error(`Iterations: ${result.iterations}`);
  console.error(`Status: ${result.finalStatus}`);
  console.error(`Type errors: ${result.typeErrors.length}`);
  console.error(`Fix suggestions: ${result.fixSuggestions.length}`);
  
  if (result.success) {
    console.error(formatSuccess('Migration complete! All tests pass.'));
  } else {
    console.error(formatWarning('Migration incomplete. Review errors and suggestions above.'));
    console.error('\nNext steps:');
    console.error('1. Fix type errors: npx tsc --noEmit');
    console.error('2. Fix failing tests: ' + testCommand);
    console.error('3. Run this script again to verify');
  }
  
  console.log(JSON.stringify(result, null, 2));
}

main();
