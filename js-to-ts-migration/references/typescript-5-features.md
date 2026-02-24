# TypeScript 5.x Features for Migration

Key TypeScript 5.x features to leverage during and after migration from JavaScript.

## Table of Contents

1. [The `satisfies` Operator](#the-satisfies-operator)
2. [Const Type Parameters](#const-type-parameters)
3. [`using` Keyword (Resource Management)](#using-keyword-resource-management)
4. [Module Resolution Improvements](#module-resolution-improvements)
5. [Decorators Improvements](#decorators-improvements)
6. [JSDoc Improvements](#jsdoc-improvements)
7. [Other Notable Features](#other-notable-features)

---

## The `satisfies` Operator

TypeScript 5.0 introduced the `satisfies` operator for type checking without widening.

### Problem: Type Widening

```typescript
// Before: Type is widened
const routes = {
  home: '/',
  about: '/about',
  contact: '/contact'
} as const;

// Problem: routes.home is literal '/', but what if we want string?
type Routes = typeof routes;
// { home: '/'; about: '/about'; contact: '/contact' }

// Using 'as' loses type safety
const routes2 = {
  home: '/',
  about: '/about'
} as Record<string, string>;

routes2.home.toUpperCase(); // OK
routes2.missing; // No error, but undefined at runtime!
```

### Solution: `satisfies`

```typescript
const routes = {
  home: '/',
  about: '/about',
  contact: '/contact'
} satisfies Record<string, string>;

// routes.home is still '/', but we know all values are strings
routes.home.toUpperCase(); // OK
routes.missing; // Error: Property 'missing' does not exist

// Exact property names are preserved
type RoutesKey = keyof typeof routes; // 'home' | 'about' | 'contact'
```

### Migration Use Case

```typescript
// API configuration during migration
const endpoints = {
  users: '/api/users',
  posts: '/api/posts',
  comments: '/api/comments'
} satisfies Record<string, string>;

// Type-safe access
function getEndpoint(name: keyof typeof endpoints): string {
  return endpoints[name];
}
```

### Color Theme Example

```typescript
type Color = 'red' | 'blue' | 'green';
type ColorConfig = Record<Color, string | { hex: string; rgb: [number, number, number] }>;

const colors = {
  red: { hex: '#ff0000', rgb: [255, 0, 0] },
  blue: '#0000ff',
  green: { hex: '#00ff00', rgb: [0, 255, 0] }
} satisfies ColorConfig;

// colors.red.rgb is typed as [number, number, number]
// colors.blue is typed as string
colors.red.rgb[0]; // OK, typed as number
colors.blue.toUpperCase(); // OK, typed as string
```

---

## Const Type Parameters

TypeScript 5.0 allows `const` type parameters for more precise type inference.

### Problem: Inference Widening

```typescript
// Before: Arrays are inferred as wider types
function getValues<T extends readonly string[]>(arr: T): T {
  return arr;
}

const values = getValues(['a', 'b', 'c']);
// values is string[], not ['a', 'b', 'c']
```

### Solution: `const` Type Parameter

```typescript
function getValues<const T extends readonly string[]>(arr: T): T {
  return arr;
}

const values = getValues(['a', 'b', 'c']);
// values is readonly ['a', 'b', 'c']

// Exact literal types preserved
type ValuesType = typeof values; // readonly ['a', 'b', 'c']
```

### Migration Use Case

```typescript
// Define routes with exact paths
function defineRoutes<const T extends Record<string, string>>(routes: T): T {
  return routes;
}

const apiRoutes = defineRoutes({
  users: '/api/users',
  posts: '/api/posts'
});

// apiRoutes.users is '/api/users' (literal)
type ApiRoutes = typeof apiRoutes;
// { users: '/api/users'; posts: '/api/posts' }
```

### Configuration Example

```typescript
function createConfig<const T extends {
  env: string;
  port: number;
  features: readonly string[];
}>(config: T): T {
  return config;
}

const config = createConfig({
  env: 'development',
  port: 3000,
  features: ['auth', 'logging'] as const
});

// config.features is readonly ['auth', 'logging']
```

---

## `using` Keyword (Resource Management)

TypeScript 5.2 introduced the `using` keyword for automatic resource disposal (based on ECMAScript explicit resource management proposal).

### Basic Usage

```typescript
// Define a disposable resource
class FileHandle implements Disposable {
  constructor(private path: string) {}
  
  [Symbol.dispose]() {
    console.log(`Closing file: ${this.path}`);
  }
  
  read() {
    return 'file content';
  }
}

// Automatic disposal when scope ends
function readFile() {
  using file = new FileHandle('test.txt');
  return file.read();
} // file[Symbol.dispose]() is called automatically
```

### Database Connection Example

```typescript
class DatabaseConnection implements Disposable {
  constructor(private connectionString: string) {
    console.log('Connecting...');
  }
  
  [Symbol.dispose]() {
    console.log('Closing connection');
  }
  
  query(sql: string) {
    return [{ id: 1, name: 'test' }];
  }
}

// Usage
async function getUser(id: number) {
  using db = new DatabaseConnection(process.env.DATABASE_URL!);
  const result = db.query(`SELECT * FROM users WHERE id = ${id}`);
  return result[0];
} // Connection automatically closed
```

### Async Disposal

```typescript
class AsyncResource implements AsyncDisposable {
  async [Symbol.asyncDispose]() {
    console.log('Cleaning up async...');
    await new Promise(resolve => setTimeout(resolve, 100));
    console.log('Cleaned up');
  }
}

async function useResource() {
  await using resource = new AsyncResource();
  // use resource
} // resource[Symbol.asyncDispose]() is called
```

---

## Module Resolution Improvements

TypeScript 5.0 introduced new module resolution modes.

### `moduleResolution: "bundler"`

```json
// tsconfig.json
{
  "compilerOptions": {
    "moduleResolution": "bundler"
  }
}
```

This mode is designed for modern bundlers (Vite, esbuild, webpack 5) and supports:

```typescript
// Works with package.json "exports"
import { someFunction } from 'my-library';

// Supports conditional exports
import { browserFeature } from 'my-library/browser';

// Better ESM/CJS interop
```

### Package.json Exports Support

```typescript
// package.json of a library
{
  "exports": {
    ".": {
      "import": "./dist/index.mjs",
      "require": "./dist/index.cjs",
      "types": "./dist/index.d.ts"
    },
    "./utils": {
      "import": "./dist/utils.mjs",
      "types": "./dist/utils.d.ts"
    }
  }
}

// Now TypeScript can resolve these correctly
import { main } from 'my-lib';
import { util } from 'my-lib/utils';
```

### Migration Update

Update your `tsconfig.json`:

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "ESNext",
    "moduleResolution": "bundler",
    "resolvePackageJsonImports": true,
    "resolvePackageJsonExports": true,
    "allowImportingTsExtensions": true,
    "noEmit": true
  }
}
```

---

## Decorators Improvements

TypeScript 5.0 implements the ECMAScript decorators proposal.

### Class Decorators

```typescript
function logged(value: Function, { kind }: ClassDecoratorContext) {
  if (kind === 'class') {
    return class extends (value as new (...args: any[]) => any) {
      constructor(...args: any[]) {
        console.log(`Creating ${value.name} with args:`, args);
        super(...args);
      }
    };
  }
}

@logged
class User {
  constructor(public name: string) {}
}

new User('John'); // Logs: Creating User with args: ['John']
```

### Method Decorators

```typescript
function measure(
  value: Function,
  { kind, name }: ClassMethodDecoratorContext
) {
  if (kind === 'method') {
    return function (this: any, ...args: any[]) {
      const start = performance.now();
      const result = (value as Function).apply(this, args);
      const end = performance.now();
      console.log(`${String(name)} took ${end - start}ms`);
      return result;
    };
  }
}

class DataProcessor {
  @measure
  process(data: unknown[]) {
    // processing
    return data;
  }
}
```

### Field Decorators

```typescript
function uppercase(
  value: undefined,
  { kind, name }: ClassFieldDecoratorContext
) {
  if (kind === 'field') {
    return function (initialValue: unknown) {
      if (typeof initialValue === 'string') {
        return initialValue.toUpperCase();
      }
      return initialValue;
    };
  }
}

class User {
  @uppercase
  name = 'john'; // Will be 'JOHN'
}
```

---

## JSDoc Improvements

Better JSDoc support for JavaScript files during migration.

### `@satisfies` in JSDoc

```javascript
/**
 * @type {import('./types').User} satisfies
 */
const user = {
  id: 1,
  name: 'John',
  email: 'john@example.com'
};
```

### `@overload` in JSDoc

```javascript
/**
 * @overload
 * @param {string} value
 * @returns {string}
 */
/**
 * @overload
 * @param {number} value
 * @returns {number}
 */
/**
 * @param {string | number} value
 */
function process(value) {
  return value;
}
```

---

## Other Notable Features

### `verbatimModuleSyntax`

TypeScript 5.0 introduced `verbatimModuleSyntax` as a replacement for `importsNotUsedAsValues` and `preserveValueImports`.

```json
{
  "compilerOptions": {
    "verbatimModuleSyntax": true
  }
}
```

This requires explicit type-only imports:

```typescript
// Must be explicit about type-only imports
import type { User } from './types';
import { UserService } from './services';

// Error with verbatimModuleSyntax:
import { User } from './types'; // Error if User is only used as type
```

### All `enum` Are Union `enum`

```typescript
// TypeScript 5.0: All enums are union enums
enum Color {
  Red,
  Green,
  Blue
}

function setColor(color: Color) {
  // TypeScript knows exact values
}

setColor(0); // OK (Color.Red)
setColor(3); // Error! Not a valid enum member
```

### Support for `export type *`

```typescript
// types/index.ts
export type * from './user';
export type * from './product';
export type * from './order';

// Now imports all types cleanly
import type { User, Product, Order } from './types';
```

### Better Type Inference for `switch (true)`

```typescript
function classify(value: string | number | boolean) {
  switch (true) {
    case typeof value === 'string':
      value; // TypeScript knows it's string
      break;
    case typeof value === 'number':
      value; // TypeScript knows it's number
      break;
    default:
      value; // TypeScript knows it's boolean
  }
}
```

---

## Migration Recommendations

### Update tsconfig.json

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "ESNext",
    "moduleResolution": "bundler",
    "lib": ["ES2023"],
    
    "strict": true,
    "verbatimModuleSyntax": true,
    
    "resolvePackageJsonImports": true,
    "resolvePackageJsonExports": true,
    
    "noUncheckedIndexedAccess": true,
    "exactOptionalPropertyTypes": true
  }
}
```

### Use `satisfies` for Configuration

```typescript
// Before
const config: AppConfig = {
  apiUrl: 'https://api.example.com',
  timeout: 5000
};

// After (better inference)
const config = {
  apiUrl: 'https://api.example.com',
  timeout: 5000
} satisfies AppConfig;
```

### Use `const` Type Parameters for APIs

```typescript
// API route definitions
function defineApi<const T extends Record<string, ApiRoute>>(
  routes: T
): T {
  return routes;
}
```

### Gradual Migration Path

1. **Update TypeScript** to 5.x: `npm install typescript@latest`
2. **Update tsconfig** with new options
3. **Add `satisfies`** where type widening is problematic
4. **Use `const` type params** for configuration functions
5. **Consider `using`** for resource management
6. **Enable `verbatimModuleSyntax`** for cleaner imports
