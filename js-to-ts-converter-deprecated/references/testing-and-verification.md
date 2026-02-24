# Testing and Verification for TypeScript Migration

Comprehensive guide for testing, verifying, and monitoring TypeScript migration progress.

## Table of Contents

1. [Testing During Migration](#testing-during-migration)
2. [Type Coverage Tools](#type-coverage-tools)
3. [Verification Strategies](#verification-strategies)
4. [CI/CD Integration](#cicd-integration)
5. [Build Tool Configuration](#build-tool-configuration)

---

## Testing During Migration

### Maintaining Existing Tests

**Critical**: Keep all existing tests passing throughout the migration.

**Strategy**:
1. Run full test suite before starting migration
2. Ensure all tests pass
3. After each file conversion, run tests again
4. Fix any broken tests immediately

```bash
# Before migration
npm test

# After converting each batch of files
npm test

# If tests fail, investigate and fix before continuing
```

### Converting Test Files to TypeScript

Convert test files after converting the source files they test.

**Order**:
1. Convert source file: `utils.js` → `utils.ts`
2. Ensure tests still pass
3. Convert test file: `utils.test.js` → `utils.test.ts`
4. Add type annotations to tests

**Example: Jest Test Conversion**

**Before (JavaScript)**:
```javascript
// math.test.js
const { add, subtract } = require('./math');

describe('math utilities', () => {
  test('add should sum two numbers', () => {
    expect(add(2, 3)).toBe(5);
  });

  test('subtract should find difference', () => {
    expect(subtract(5, 3)).toBe(2);
  });
});
```

**After (TypeScript)**:
```typescript
// math.test.ts
import { add, subtract } from './math';

describe('math utilities', () => {
  test('add should sum two numbers', () => {
    expect(add(2, 3)).toBe(5);
  });

  test('subtract should find difference', () => {
    expect(subtract(5, 3)).toBe(2);
  });
});
```

### Typing Test Frameworks

Install type definitions for your test framework.

**Jest**:
```bash
npm install --save-dev @types/jest
```

**Vitest** (built-in TypeScript support):
```bash
npm install --save-dev vitest
```

**Mocha + Chai**:
```bash
npm install --save-dev @types/mocha @types/chai
```

### Mock Typing Strategies

**Jest Mocks with Types**:

```typescript
import { jest } from '@jest/globals';

// Mock a function
const mockFn = jest.fn<(x: number) => string>();
mockFn.mockReturnValue('test');

// Mock a module
jest.mock('./api', () => ({
  fetchUser: jest.fn<() => Promise<User>>(),
}));

// Mock with implementation
const mockFetch = jest.fn<typeof fetch>();
mockFetch.mockResolvedValue({
  ok: true,
  json: async () => ({ id: 1, name: 'John' }),
} as Response);
```

**Vitest Mocks**:

```typescript
import { vi } from 'vitest';

// Mock a function
const mockFn = vi.fn<[number], string>();
mockFn.mockReturnValue('test');

// Mock a module
vi.mock('./api', () => ({
  fetchUser: vi.fn<() => Promise<User>>(),
}));
```

**Typing Mock Data**:

```typescript
interface User {
  id: number;
  name: string;
  email: string;
}

// Create mock user
const mockUser: User = {
  id: 1,
  name: 'John Doe',
  email: 'john@example.com',
};

// Factory function for mock data
function createMockUser(overrides?: Partial<User>): User {
  return {
    id: 1,
    name: 'John Doe',
    email: 'john@example.com',
    ...overrides,
  };
}

const user1 = createMockUser();
const user2 = createMockUser({ name: 'Jane Doe' });
```

### Snapshot Testing for Compiler Errors

For large projects, use snapshot testing to track TypeScript errors.

**Setup**:

```typescript
// tests/type-errors.test.ts
import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

const SNAPSHOT_FILE = path.join(__dirname, 'type-errors-snapshot.txt');

test('TypeScript errors should not increase', () => {
  // Run TypeScript compiler and capture errors
  let output = '';
  try {
    execSync('npx tsc --noEmit', { encoding: 'utf-8' });
  } catch (error: any) {
    output = error.stdout || '';
  }

  // Count errors
  const errors = output.match(/error TS\d+:/g) || [];
  const errorCount = errors.length;

  // Read snapshot
  let snapshotCount = 0;
  if (fs.existsSync(SNAPSHOT_FILE)) {
    snapshotCount = parseInt(fs.readFileSync(SNAPSHOT_FILE, 'utf-8'));
  }

  // Assert errors haven't increased
  expect(errorCount).toBeLessThanOrEqual(snapshotCount);

  // Update snapshot if errors decreased
  if (errorCount < snapshotCount || !fs.existsSync(SNAPSHOT_FILE)) {
    fs.writeFileSync(SNAPSHOT_FILE, errorCount.toString());
    console.log(`✓ Type errors reduced: ${snapshotCount} → ${errorCount}`);
  }
});
```

**Usage**:
```bash
# Initial run (creates snapshot)
npm test

# Subsequent runs (compares to snapshot)
npm test

# If you fix type errors, the snapshot updates automatically
```

---

## Type Coverage Tools

### type-coverage

Measures what percentage of your code has proper types (not `any`).

**Installation**:
```bash
npm install --save-dev type-coverage
```

**Usage**:
```bash
# Check type coverage
npx type-coverage

# Output:
# 2345 / 2500 95.38%
# type-coverage success.
```

**Configuration** (`package.json`):
```json
{
  "typeCoverage": {
    "atLeast": 95,
    "ignoreFiles": [
      "**/*.test.ts",
      "**/*.spec.ts",
      "**/test/**"
    ]
  }
}
```

**Detailed Report**:
```bash
# Show files with low coverage
npx type-coverage --detail

# Output:
# src/utils.ts:12:5 - any
# src/api.ts:45:10 - any
# src/components/Button.tsx:23:8 - any
```

**Strict Mode**:
```bash
# Fail if any 'any' types exist
npx type-coverage --strict
```

### typescript-coverage-report

Generates HTML coverage reports.

**Installation**:
```bash
npm install --save-dev typescript-coverage-report
```

**Usage**:
```bash
# Generate HTML report
npx typescript-coverage-report

# Opens report in browser
npx typescript-coverage-report --open
```

**Configuration** (`package.json`):
```json
{
  "typescriptCoverageReport": {
    "threshold": 95,
    "outputDir": "coverage-ts",
    "ignoreFiles": ["**/*.test.ts"]
  }
}
```

### Tracking Progress Over Time

**Script to Track Progress**:

```bash
#!/bin/bash
# track-migration-progress.sh

echo "=== TypeScript Migration Progress ==="
echo "Date: $(date)"
echo ""

# Count files
JS_FILES=$(find src -name '*.js' -o -name '*.jsx' | wc -l)
TS_FILES=$(find src -name '*.ts' -o -name '*.tsx' | wc -l)
TOTAL_FILES=$((JS_FILES + TS_FILES))
PERCENT=$((TS_FILES * 100 / TOTAL_FILES))

echo "Files converted: $TS_FILES / $TOTAL_FILES ($PERCENT%)"

# Type coverage
COVERAGE=$(npx type-coverage | grep -oP '\d+\.\d+(?=%)')
echo "Type coverage: $COVERAGE%"

# Compiler errors
ERROR_COUNT=$(npx tsc --noEmit 2>&1 | grep -c 'error TS' || echo "0")
echo "Compiler errors: $ERROR_COUNT"

# Any usage
ANY_COUNT=$(npx type-coverage --detail 2>&1 | grep -c ': any' || echo "0")
echo "Any types: $ANY_COUNT"

echo ""
echo "Progress saved to migration-progress.log"
echo "$(date),${TS_FILES},${TOTAL_FILES},${COVERAGE},${ERROR_COUNT},${ANY_COUNT}" >> migration-progress.log
```

**Run weekly**:
```bash
chmod +x track-migration-progress.sh
./track-migration-progress.sh
```

**Visualize Progress**:

```python
# visualize-progress.py
import pandas as pd
import matplotlib.pyplot as plt

# Read progress log
df = pd.read_csv('migration-progress.log', 
                 names=['date', 'ts_files', 'total_files', 'coverage', 'errors', 'any_count'])
df['date'] = pd.to_datetime(df['date'])
df['percent_converted'] = (df['ts_files'] / df['total_files']) * 100

# Plot progress
fig, axes = plt.subplots(2, 2, figsize=(12, 8))

axes[0, 0].plot(df['date'], df['percent_converted'])
axes[0, 0].set_title('Files Converted (%)')

axes[0, 1].plot(df['date'], df['coverage'])
axes[0, 1].set_title('Type Coverage (%)')

axes[1, 0].plot(df['date'], df['errors'])
axes[1, 0].set_title('Compiler Errors')

axes[1, 1].plot(df['date'], df['any_count'])
axes[1, 1].set_title('Any Types')

plt.tight_layout()
plt.savefig('migration-progress.png')
print('Progress chart saved to migration-progress.png')
```

---

## Verification Strategies

### Compiler Checks

**Basic Type Checking**:
```bash
# Check for type errors without emitting files
npx tsc --noEmit
```

**Strict Mode Checking**:
```bash
# Check with strict mode enabled
npx tsc --noEmit --strict
```

**Watch Mode**:
```bash
# Continuously check for errors
npx tsc --noEmit --watch
```

### Linting with typescript-eslint

**Installation**:
```bash
npm install --save-dev @typescript-eslint/parser @typescript-eslint/eslint-plugin
```

**Configuration** (`.eslintrc.json`):
```json
{
  "parser": "@typescript-eslint/parser",
  "parserOptions": {
    "project": "./tsconfig.json"
  },
  "plugins": ["@typescript-eslint"],
  "extends": [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:@typescript-eslint/recommended-requiring-type-checking"
  ],
  "rules": {
    "@typescript-eslint/no-explicit-any": "warn",
    "@typescript-eslint/no-unused-vars": "error",
    "@typescript-eslint/explicit-function-return-type": "warn"
  }
}
```

**Usage**:
```bash
# Lint TypeScript files
npx eslint 'src/**/*.{ts,tsx}'

# Auto-fix issues
npx eslint 'src/**/*.{ts,tsx}' --fix
```

### Running Test Suites

**Jest**:
```bash
# Run all tests
npm test

# Run tests in watch mode
npm test -- --watch

# Run tests with coverage
npm test -- --coverage
```

**Vitest**:
```bash
# Run all tests
npx vitest run

# Watch mode
npx vitest

# Coverage
npx vitest run --coverage
```

### Manual Verification

**Checklist**:
- [ ] All files converted from `.js` to `.ts`
- [ ] No `any` types (or minimal, documented usage)
- [ ] All imports updated (no `.js` extensions)
- [ ] Type definitions installed for all dependencies
- [ ] `strict: true` enabled in `tsconfig.json`
- [ ] All tests passing
- [ ] No TypeScript compiler errors
- [ ] Type coverage > 95%
- [ ] Application runs correctly in development
- [ ] Application builds successfully for production

---

## CI/CD Integration

### GitHub Actions

**Type Checking Workflow**:

```yaml
# .github/workflows/type-check.yml
name: Type Check

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main, develop]

jobs:
  type-check:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Type check
        run: npx tsc --noEmit
      
      - name: Check type coverage
        run: npx type-coverage --at-least 95
      
      - name: Lint
        run: npx eslint 'src/**/*.{ts,tsx}'
```

### Preventing New `any` Types

**Pre-commit Hook** (using Husky):

```bash
# Install Husky
npm install --save-dev husky

# Initialize Husky
npx husky install

# Add pre-commit hook
npx husky add .husky/pre-commit "npm run type-check"
```

**package.json**:
```json
{
  "scripts": {
    "type-check": "tsc --noEmit && type-coverage --at-least 95"
  }
}
```

### Enforcing Coverage Thresholds

**Fail CI if coverage drops**:

```yaml
# In GitHub Actions workflow
- name: Check type coverage
  run: |
    COVERAGE=$(npx type-coverage | grep -oP '\d+\.\d+(?=%)')
    if (( $(echo "$COVERAGE < 95" | bc -l) )); then
      echo "Type coverage is below 95%: $COVERAGE%"
      exit 1
    fi
```

### Incremental Strictness Enforcement

**Strategy**: Gradually enable strict options in CI.

**Week 1**: Enable `noImplicitAny`
```json
{
  "compilerOptions": {
    "noImplicitAny": true
  }
}
```

**Week 2**: Enable `strictNullChecks`
```json
{
  "compilerOptions": {
    "noImplicitAny": true,
    "strictNullChecks": true
  }
}
```

**Week 3**: Enable full `strict` mode
```json
{
  "compilerOptions": {
    "strict": true
  }
}
```

---

## Build Tool Configuration

### Webpack

**Installation**:
```bash
npm install --save-dev typescript ts-loader
```

**Configuration** (`webpack.config.js`):
```javascript
module.exports = {
  entry: './src/index.ts',
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
  },
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'),
  },
};
```

### Vite

**Built-in TypeScript support** - no configuration needed!

**vite.config.ts**:
```typescript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    // Type check during build
    emptyOutDir: true,
  },
});
```

**Type checking** (Vite doesn't type-check by default):
```bash
# Add to package.json scripts
{
  "scripts": {
    "build": "tsc --noEmit && vite build"
  }
}
```

### Babel

**Installation**:
```bash
npm install --save-dev @babel/preset-typescript
```

**Configuration** (`.babelrc`):
```json
{
  "presets": [
    "@babel/preset-env",
    "@babel/preset-typescript",
    "@babel/preset-react"
  ]
}
```

**Note**: Babel only transpiles, doesn't type-check. Run `tsc --noEmit` separately.

### Jest

**Installation**:
```bash
npm install --save-dev ts-jest @types/jest
```

**Configuration** (`jest.config.js`):
```javascript
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/src'],
  testMatch: ['**/__tests__/**/*.ts', '**/?(*.)+(spec|test).ts'],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
};
```

### Vitest

**Installation**:
```bash
npm install --save-dev vitest
```

**Configuration** (`vitest.config.ts`):
```typescript
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
  },
});
```

### Separating Transpilation from Type Checking

For faster builds, use fast transpilers and type-check separately.

**esbuild**:
```bash
npm install --save-dev esbuild
```

**Build script**:
```json
{
  "scripts": {
    "build": "npm run type-check && npm run transpile",
    "type-check": "tsc --noEmit",
    "transpile": "esbuild src/index.ts --bundle --outfile=dist/bundle.js"
  }
}
```

**SWC**:
```bash
npm install --save-dev @swc/core @swc/cli
```

**Build script**:
```json
{
  "scripts": {
    "build": "npm run type-check && npm run transpile",
    "type-check": "tsc --noEmit",
    "transpile": "swc src -d dist"
  }
}
```

---

## Summary

**Testing during migration:**
- Keep existing tests passing
- Convert test files after source files
- Install type definitions for test frameworks
- Type your mocks and test data
- Use snapshot testing for compiler errors

**Type coverage tools:**
- `type-coverage` - measure type coverage percentage
- `typescript-coverage-report` - generate HTML reports
- Track progress over time with custom scripts

**Verification strategies:**
- Run `tsc --noEmit` for type checking
- Use `typescript-eslint` for linting
- Ensure all tests pass
- Manual verification checklist

**CI/CD integration:**
- Add type checking to CI pipelines
- Prevent new `any` types with pre-commit hooks
- Enforce coverage thresholds
- Enable strictness incrementally

**Build tools:**
- Configure Webpack, Vite, or Babel for TypeScript
- Set up Jest or Vitest for testing
- Consider separating transpilation from type checking for performance
