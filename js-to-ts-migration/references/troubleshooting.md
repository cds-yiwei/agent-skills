# TypeScript Migration Troubleshooting

Common errors and solutions during JavaScript to TypeScript migration.

## "Cannot find module" Errors

### Missing Type Definitions

**Error:**
```
Could not find a declaration file for module 'some-library'
```

**Solution:**
```bash
# Check if types exist
npm search @types/some-library

# Install types if available
npm install --save-dev @types/some-library

# Or create a declaration file
```

### Custom Declaration for Untyped Modules

```typescript
// types/untyped-module.d.ts
declare module 'untyped-library' {
  export function doSomething(): void;
  export const value: string;
}
```

### Path Alias Resolution

**Error:**
```
Cannot find module '@/components/Button'
```

**Solution:**
Ensure both TypeScript and build tool have the same aliases:

```json
// tsconfig.json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"]
    }
  }
}
```

```javascript
// webpack.config.js
resolve: {
  alias: {
    '@': path.resolve(__dirname, 'src')
  }
}
```

## Implicit Any Errors

**Error:**
```
Parameter 'x' implicitly has an 'any' type
```

**Solutions:**

1. **Add explicit type:**
```typescript
function process(x: string) { ... }
```

2. **Use type inference:**
```typescript
const numbers = [1, 2, 3];  // number[] inferred
```

3. **Temporary escape hatch:**
```typescript
function process(x: any) { ... }  // Not recommended long-term
```

4. **Disable for migration (tsconfig.json):**
```json
{
  "compilerOptions": {
    "noImplicitAny": false  // Enable after migration
  }
}
```

## JSX/TSX Issues

### Cannot Use JSX

**Error:**
```
Cannot use JSX unless the '--jsx' flag is provided
```

**Solution:**
```json
// tsconfig.json
{
  "compilerOptions": {
    "jsx": "react-jsx"  // or "react" for older setups
  }
}
```

### React Not Defined

**Error:**
```
'react' refers to a UMD global, but the current file is a module
```

**Solution:**
```typescript
// Ensure React is imported
import React from 'react';  // Older React

// Or use new JSX transform
// tsconfig.json: "jsx": "react-jsx"
```

## Type Definition Conflicts

### Duplicate Identifiers

**Error:**
```
Duplicate identifier 'User'
```

**Solution:**
Check for multiple declaration files or conflicting type definitions.

```typescript
// Use declaration merging carefully
declare module 'app-types' {
  export interface User { ... }
}

// Or namespace
declare namespace AppTypes {
  interface User { ... }
}
```

### Conflicting Library Definitions

**Solution:**
```json
// tsconfig.json
{
  "compilerOptions": {
    "skipLibCheck": true
  }
}
```

## Import/Export Errors

### ES Module Interop

**Error:**
```
This module is declared with 'export =', and can only be used with a default import
```

**Solution:**
```json
// tsconfig.json
{
  "compilerOptions": {
    "esModuleInterop": true,
    "allowSyntheticDefaultImports": true
  }
}
```

```typescript
// Import style
import express from 'express';  // with esModuleInterop
// or
import * as express from 'express';  // without
```

### Cannot Export Assignment

**Error:**
```
An export assignment cannot be used in a module with other exported elements
```

**Solution:**
```typescript
// Instead of
export = MyClass;

// Use
export default MyClass;
// or
export { MyClass };
```

## Property Does Not Exist

**Error:**
```
Property 'value' does not exist on type 'EventTarget'
```

**Solution:**
```typescript
// Type assertion
const target = event.target as HTMLInputElement;
console.log(target.value);

// Or type guard
if (event.target instanceof HTMLInputElement) {
  console.log(event.target.value);
}
```

## Null/Undefined Errors

### Object Possibly Null

**Error:**
```
Object is possibly 'null'
```

**Solution:**
```typescript
// Non-null assertion (use sparingly)
const element = document.getElementById('app')!;

// Type guard
const element = document.getElementById('app');
if (element) {
  element.textContent = 'Hello';
}

// Optional chaining
const value = element?.textContent;

// Default value
const value = element?.textContent ?? 'default';
```

### Strict Null Checks

**Error:**
```
Type 'string | undefined' is not assignable to type 'string'
```

**Solution:**
```typescript
// Disable for migration (not recommended long-term)
// tsconfig.json: "strictNullChecks": false

// Or handle properly
function process(name: string | undefined) {
  if (!name) {
    throw new Error('Name is required');
  }
  // name is now string
  return name.toUpperCase();
}
```

## Build Performance Issues

### Slow Compilation

**Solutions:**

1. **Use transpileOnly in development:**
```javascript
// webpack.config.js
{
  loader: 'ts-loader',
  options: {
    transpileOnly: true  // Skip type checking in dev
  }
}
```

2. **Enable incremental compilation:**
```json
// tsconfig.json
{
  "compilerOptions": {
    "incremental": true,
    "tsBuildInfoFile": ".tsbuildinfo"
  }
}
```

3. **Use isolatedModules:**
```json
{
  "compilerOptions": {
    "isolatedModules": true
  }
}
```

## Memory Issues

**Error:**
```
JavaScript heap out of memory
```

**Solution:**
```bash
# Increase Node.js memory
export NODE_OPTIONS="--max-old-space-size=4096"
npm run build

# Or in package.json
"build": "NODE_OPTIONS='--max-old-space-size=4096' webpack"
```

## Watch Mode Issues

### Changes Not Detected

**Solution:**
```javascript
// webpack.config.js
module.exports = {
  watchOptions: {
    ignored: /node_modules/,
    poll: 1000  // For some environments (WSL, Docker)
  }
};
```

## Common Escape Hatches

Use these temporarily during migration:

```typescript
// @ts-ignore - Ignore next line
// @ts-nocheck - Ignore entire file (place at top)
// @ts-expect-error - Expect an error (fails if no error)

// any type (use sparingly)
const data: any = fetchData();

// Type assertion
const element = document.getElementById('app') as HTMLElement;

// Unknown type (safer than any)
const unknownData: unknown = fetchData();
if (typeof unknownData === 'string') {
  // TypeScript knows it's string here
}
```

## Debugging Tips

### Enable Verbose Errors

```bash
# Show full error stack
npx tsc --extendedDiagnostics

# Show config
npx tsc --showConfig

# Trace resolution
npx tsc --traceResolution
```

### Check TypeScript Version

```bash
npx tsc --version
```

Ensure all tools use compatible TypeScript versions.
