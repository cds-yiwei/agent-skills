# Advanced TypeScript Patterns

Deep dive into advanced TypeScript features and patterns for building robust, type-safe applications.

## Table of Contents

1. [Advanced Type Patterns](#advanced-type-patterns)
2. [Utility Types Deep Dive](#utility-types-deep-dive)
3. [Generics Best Practices](#generics-best-practices)
4. [Declaration Files and Module Augmentation](#declaration-files-and-module-augmentation)
5. [Type Guards and Narrowing](#type-guards-and-narrowing)
6. [Performance Considerations](#performance-considerations)

---

## Advanced Type Patterns

### Conditional Types

Conditional types allow you to create types that change based on a condition.

**Basic Syntax:**
```typescript
T extends U ? X : Y
```

**Example: Extract Return Type**
```typescript
type ReturnTypeOf<T> = T extends (...args: any[]) => infer R ? R : never;

function getUser() {
  return { id: 1, name: 'John' };
}

type User = ReturnTypeOf<typeof getUser>; // { id: number; name: string }
```

**Example: Flatten Array Type**
```typescript
type Flatten<T> = T extends Array<infer U> ? U : T;

type Str = Flatten<string[]>;    // string
type Num = Flatten<number>;      // number
```

**Example: Non-Nullable Type**
```typescript
type NonNullable<T> = T extends null | undefined ? never : T;

type A = NonNullable<string | null>;      // string
type B = NonNullable<number | undefined>; // number
```

### Mapped Types

Transform properties of existing types to create new types.

**Basic Syntax:**
```typescript
{ [K in keyof T]: NewType }
```

**Example: Make All Properties Optional**
```typescript
type Partial<T> = {
  [K in keyof T]?: T[K];
};

interface User {
  id: number;
  name: string;
  email: string;
}

type PartialUser = Partial<User>;
// { id?: number; name?: string; email?: string; }
```

**Example: Make All Properties Readonly**
```typescript
type Readonly<T> = {
  readonly [K in keyof T]: T[K];
};

type ReadonlyUser = Readonly<User>;
// { readonly id: number; readonly name: string; readonly email: string; }
```

**Example: Transform Property Types**
```typescript
type Stringify<T> = {
  [K in keyof T]: string;
};

type StringUser = Stringify<User>;
// { id: string; name: string; email: string; }
```

**Example: Add Prefix to Keys**
```typescript
type Prefixed<T, P extends string> = {
  [K in keyof T as `${P}${string & K}`]: T[K];
};

type PrefixedUser = Prefixed<User, 'user_'>;
// { user_id: number; user_name: string; user_email: string; }
```

### Template Literal Types

Create string types with specific patterns.

**Basic Example:**
```typescript
type Greeting = `Hello ${string}`;

const g1: Greeting = 'Hello World';  // ✓
const g2: Greeting = 'Hi World';     // ✗ Error
```

**Example: HTTP Methods**
```typescript
type HTTPMethod = 'GET' | 'POST' | 'PUT' | 'DELETE';
type Endpoint = `/api/${string}`;
type APIRoute = `${HTTPMethod} ${Endpoint}`;

const route1: APIRoute = 'GET /api/users';     // ✓
const route2: APIRoute = 'POST /api/products'; // ✓
const route3: APIRoute = 'GET /users';         // ✗ Error
```

**Example: Type-Safe Event System**
```typescript
type EventName = 'click' | 'focus' | 'blur';
type EventHandler = `on${Capitalize<EventName>}`;

type Handlers = {
  [K in EventHandler]: () => void;
};

const handlers: Handlers = {
  onClick: () => {},
  onFocus: () => {},
  onBlur: () => {},
};
```

**Example: CSS Properties**
```typescript
type CSSProperty = 'color' | 'background' | 'border';
type CSSValue = string;
type CSSRule = `${CSSProperty}: ${CSSValue}`;

const rule: CSSRule = 'color: red';           // ✓
const rule2: CSSRule = 'background: blue';    // ✓
```

### Discriminated Unions

Use a common property to distinguish between union types.

**Example: API Response**
```typescript
type SuccessResponse<T> = {
  status: 'success';
  data: T;
};

type ErrorResponse = {
  status: 'error';
  error: string;
  code: number;
};

type ApiResponse<T> = SuccessResponse<T> | ErrorResponse;

function handleResponse<T>(response: ApiResponse<T>) {
  if (response.status === 'success') {
    // TypeScript knows response.data exists
    console.log(response.data);
  } else {
    // TypeScript knows response.error exists
    console.error(response.error, response.code);
  }
}
```

**Example: State Management**
```typescript
type LoadingState = {
  type: 'loading';
};

type SuccessState<T> = {
  type: 'success';
  data: T;
};

type ErrorState = {
  type: 'error';
  error: Error;
};

type State<T> = LoadingState | SuccessState<T> | ErrorState;

function renderState<T>(state: State<T>) {
  switch (state.type) {
    case 'loading':
      return 'Loading...';
    case 'success':
      return `Data: ${state.data}`;
    case 'error':
      return `Error: ${state.error.message}`;
  }
}
```

### Recursive Types

Types that reference themselves.

**Example: JSON Type**
```typescript
type JSONValue =
  | string
  | number
  | boolean
  | null
  | JSONValue[]
  | { [key: string]: JSONValue };

const data: JSONValue = {
  name: 'John',
  age: 30,
  hobbies: ['reading', 'coding'],
  address: {
    city: 'NYC',
    zip: 10001,
  },
};
```

**Example: Nested Menu**
```typescript
type MenuItem = {
  label: string;
  link?: string;
  children?: MenuItem[];
};

const menu: MenuItem = {
  label: 'Products',
  children: [
    { label: 'Electronics', link: '/electronics' },
    {
      label: 'Computers',
      children: [
        { label: 'Laptops', link: '/laptops' },
        { label: 'Desktops', link: '/desktops' },
      ],
    },
  ],
};
```

### Branded Types

Create distinct types from primitives for domain modeling.

**Example: User ID**
```typescript
type UserId = string & { readonly __brand: 'UserId' };
type ProductId = string & { readonly __brand: 'ProductId' };

function createUserId(id: string): UserId {
  return id as UserId;
}

function createProductId(id: string): ProductId {
  return id as ProductId;
}

function getUser(id: UserId) {
  // ...
}

const userId = createUserId('user-123');
const productId = createProductId('prod-456');

getUser(userId);     // ✓
getUser(productId);  // ✗ Error: ProductId is not assignable to UserId
```

---

## Utility Types Deep Dive

### Built-in Utility Types

**`Partial<T>`** - Make all properties optional
```typescript
interface User {
  id: number;
  name: string;
  email: string;
}

type PartialUser = Partial<User>;
// { id?: number; name?: string; email?: string; }

function updateUser(id: number, updates: Partial<User>) {
  // Only provide fields you want to update
}

updateUser(1, { name: 'Jane' }); // ✓
```

**`Required<T>`** - Make all properties required
```typescript
interface Config {
  host?: string;
  port?: number;
}

type RequiredConfig = Required<Config>;
// { host: string; port: number; }
```

**`Readonly<T>`** - Make all properties readonly
```typescript
type ReadonlyUser = Readonly<User>;

const user: ReadonlyUser = { id: 1, name: 'John', email: 'john@example.com' };
user.name = 'Jane'; // ✗ Error: Cannot assign to 'name' because it is read-only
```

**`Pick<T, K>`** - Select specific properties
```typescript
type UserPreview = Pick<User, 'id' | 'name'>;
// { id: number; name: string; }
```

**`Omit<T, K>`** - Exclude specific properties
```typescript
type UserWithoutEmail = Omit<User, 'email'>;
// { id: number; name: string; }
```

**`Record<K, T>`** - Create object type with specific keys
```typescript
type Roles = 'admin' | 'user' | 'guest';
type Permissions = Record<Roles, string[]>;

const permissions: Permissions = {
  admin: ['read', 'write', 'delete'],
  user: ['read', 'write'],
  guest: ['read'],
};
```

**`Exclude<T, U>`** - Exclude types from union
```typescript
type T = Exclude<'a' | 'b' | 'c', 'a'>;  // 'b' | 'c'
```

**`Extract<T, U>`** - Extract types from union
```typescript
type T = Extract<'a' | 'b' | 'c', 'a' | 'f'>;  // 'a'
```

**`NonNullable<T>`** - Exclude null and undefined
```typescript
type T = NonNullable<string | null | undefined>;  // string
```

**`ReturnType<T>`** - Extract function return type
```typescript
function getUser() {
  return { id: 1, name: 'John' };
}

type User = ReturnType<typeof getUser>;
// { id: number; name: string; }
```

**`Parameters<T>`** - Extract function parameter types
```typescript
function createUser(name: string, age: number) {
  return { name, age };
}

type CreateUserParams = Parameters<typeof createUser>;
// [name: string, age: number]
```

**`ConstructorParameters<T>`** - Extract constructor parameter types
```typescript
class User {
  constructor(public name: string, public age: number) {}
}

type UserParams = ConstructorParameters<typeof User>;
// [name: string, age: number]
```

**`Awaited<T>`** - Unwrap Promise type
```typescript
type T = Awaited<Promise<string>>;  // string
type U = Awaited<Promise<Promise<number>>>;  // number
```

### Custom Utility Types

**`DeepPartial<T>`** - Make all properties deeply optional
```typescript
type DeepPartial<T> = {
  [K in keyof T]?: T[K] extends object ? DeepPartial<T[K]> : T[K];
};

interface Config {
  database: {
    host: string;
    port: number;
  };
  cache: {
    enabled: boolean;
  };
}

type PartialConfig = DeepPartial<Config>;
// All properties at all levels are optional
```

**`DeepReadonly<T>`** - Make all properties deeply readonly
```typescript
type DeepReadonly<T> = {
  readonly [K in keyof T]: T[K] extends object ? DeepReadonly<T[K]> : T[K];
};
```

**`Nullable<T>`** - Make type nullable
```typescript
type Nullable<T> = T | null;

type NullableString = Nullable<string>;  // string | null
```

**`ValueOf<T>`** - Extract value types from object
```typescript
type ValueOf<T> = T[keyof T];

interface User {
  id: number;
  name: string;
  active: boolean;
}

type UserValue = ValueOf<User>;  // number | string | boolean
```

---

## Generics Best Practices

### Basic Generics

```typescript
function identity<T>(value: T): T {
  return value;
}

const num = identity(42);        // T = number
const str = identity('hello');   // T = string
```

### Generic Constraints

Use `extends` to constrain generic types.

```typescript
interface HasId {
  id: number;
}

function findById<T extends HasId>(items: T[], id: number): T | undefined {
  return items.find(item => item.id === id);
}

const users = [{ id: 1, name: 'John' }, { id: 2, name: 'Jane' }];
const user = findById(users, 1);  // ✓

const numbers = [1, 2, 3];
const num = findById(numbers, 1);  // ✗ Error: number doesn't extend HasId
```

### Multiple Type Parameters

```typescript
function merge<T, U>(obj1: T, obj2: U): T & U {
  return { ...obj1, ...obj2 };
}

const result = merge({ name: 'John' }, { age: 30 });
// { name: string; age: number; }
```

### Default Generic Types

```typescript
interface ApiResponse<T = unknown> {
  data: T;
  status: number;
}

const response1: ApiResponse = { data: 'anything', status: 200 };
const response2: ApiResponse<User> = { data: user, status: 200 };
```

### Generic Type Inference

Let TypeScript infer types when possible.

```typescript
// Good: Type inference
const numbers = [1, 2, 3];
const doubled = numbers.map(n => n * 2);  // TypeScript infers number[]

// Unnecessary: Explicit type
const doubled2 = numbers.map<number>(n => n * 2);
```

### When to Use Generics

✅ **Use generics when:**
- Function/class works with multiple types
- You want to preserve type information
- Creating reusable utilities

❌ **Avoid generics when:**
- Type is always the same
- Makes code harder to read
- Simple `any` would suffice (rare)

### Generic Naming Conventions

```typescript
// Single type parameter
function identity<T>(value: T): T { }

// Multiple related types
function map<T, U>(items: T[], fn: (item: T) => U): U[] { }

// Key-Value pairs
function groupBy<K, V>(items: V[], keyFn: (item: V) => K): Map<K, V[]> { }

// Descriptive names for clarity
function fetchData<TRequest, TResponse>(request: TRequest): Promise<TResponse> { }
```

---

## Declaration Files and Module Augmentation

### Creating Declaration Files

Declaration files (`.d.ts`) provide type information for JavaScript code.

**Example: Untyped Library**

```typescript
// types/my-library.d.ts
declare module 'my-library' {
  export function doSomething(value: string): number;
  export class MyClass {
    constructor(name: string);
    getName(): string;
  }
  export const VERSION: string;
}
```

**Usage:**
```typescript
import { doSomething, MyClass, VERSION } from 'my-library';

const result = doSomething('test');  // number
const instance = new MyClass('name');
console.log(VERSION);
```

### Ambient Declarations

Declare global variables or types that exist at runtime.

```typescript
// global.d.ts
declare global {
  interface Window {
    myGlobalVar: string;
    myGlobalFn(): void;
  }
  
  const BUILD_VERSION: string;
  const IS_PRODUCTION: boolean;
}

export {};  // Make this a module
```

**Usage:**
```typescript
window.myGlobalVar = 'value';
window.myGlobalFn();
console.log(BUILD_VERSION);
```

### Module Augmentation

Extend existing module types.

**Example: Extending Express Request**
```typescript
// types/express.d.ts
import 'express';

declare module 'express' {
  interface Request {
    user?: {
      id: number;
      name: string;
    };
  }
}
```

**Usage:**
```typescript
import { Request, Response } from 'express';

app.get('/profile', (req: Request, res: Response) => {
  if (req.user) {
    res.json({ name: req.user.name });  // TypeScript knows about user
  }
});
```

**Example: Extending Array**
```typescript
// types/array-extensions.d.ts
interface Array<T> {
  first(): T | undefined;
  last(): T | undefined;
}
```

**Implementation:**
```typescript
// array-extensions.ts
Array.prototype.first = function() {
  return this[0];
};

Array.prototype.last = function() {
  return this[this.length - 1];
};
```

**Usage:**
```typescript
const numbers = [1, 2, 3];
const first = numbers.first();  // number | undefined
const last = numbers.last();    // number | undefined
```

---

## Type Guards and Narrowing

### Built-in Type Guards

**`typeof`**
```typescript
function process(value: string | number) {
  if (typeof value === 'string') {
    return value.toUpperCase();  // TypeScript knows it's string
  } else {
    return value.toFixed(2);     // TypeScript knows it's number
  }
}
```

**`instanceof`**
```typescript
class Dog {
  bark() { console.log('Woof!'); }
}

class Cat {
  meow() { console.log('Meow!'); }
}

function makeSound(animal: Dog | Cat) {
  if (animal instanceof Dog) {
    animal.bark();  // TypeScript knows it's Dog
  } else {
    animal.meow();  // TypeScript knows it's Cat
  }
}
```

**`in` operator**
```typescript
interface Bird {
  fly(): void;
}

interface Fish {
  swim(): void;
}

function move(animal: Bird | Fish) {
  if ('fly' in animal) {
    animal.fly();   // TypeScript knows it's Bird
  } else {
    animal.swim();  // TypeScript knows it's Fish
  }
}
```

### User-Defined Type Guards

Create custom type checking functions.

```typescript
interface User {
  id: number;
  name: string;
}

function isUser(value: unknown): value is User {
  return (
    typeof value === 'object' &&
    value !== null &&
    'id' in value &&
    'name' in value &&
    typeof (value as User).id === 'number' &&
    typeof (value as User).name === 'string'
  );
}

function processValue(value: unknown) {
  if (isUser(value)) {
    console.log(value.name);  // TypeScript knows it's User
  }
}
```

### Assertion Functions

Functions that throw if condition is not met.

```typescript
function assertIsString(value: unknown): asserts value is string {
  if (typeof value !== 'string') {
    throw new Error('Value is not a string');
  }
}

function process(value: unknown) {
  assertIsString(value);
  // After this point, TypeScript knows value is string
  return value.toUpperCase();
}
```

### Discriminated Union Exhaustiveness

Ensure all cases are handled.

```typescript
type Shape =
  | { kind: 'circle'; radius: number }
  | { kind: 'square'; size: number }
  | { kind: 'rectangle'; width: number; height: number };

function area(shape: Shape): number {
  switch (shape.kind) {
    case 'circle':
      return Math.PI * shape.radius ** 2;
    case 'square':
      return shape.size ** 2;
    case 'rectangle':
      return shape.width * shape.height;
    default:
      // Exhaustiveness check
      const _exhaustive: never = shape;
      throw new Error(`Unhandled shape: ${_exhaustive}`);
  }
}
```

---

## Performance Considerations

### Type-Only Imports

Use `import type` for types that are only used for type checking.

```typescript
// Good: Type-only import (removed at runtime)
import type { User } from './types';

// Bad: Regular import (included in bundle even if only used for types)
import { User } from './types';
```

### Avoid Deep Recursive Types

Deep recursion can slow down type checking.

```typescript
// Problematic: Deep recursion
type DeepNested<T, N extends number = 10> = N extends 0
  ? T
  : { nested: DeepNested<T, Subtract<N, 1>> };

// Better: Limit recursion depth
type LimitedNested<T, N extends number = 3> = N extends 0
  ? T
  : { nested: LimitedNested<T, Subtract<N, 1>> };
```

### Optimize Import Structures

```typescript
// Bad: Importing everything
import * as utils from './utils';

// Good: Import only what you need
import { formatDate, validateEmail } from './utils';
```

### Use Project References for Monorepos

For large monorepos, use TypeScript project references.

```json
// tsconfig.json (root)
{
  "references": [
    { "path": "./packages/core" },
    { "path": "./packages/ui" },
    { "path": "./packages/api" }
  ]
}
```

```json
// packages/core/tsconfig.json
{
  "compilerOptions": {
    "composite": true,
    "declaration": true,
    "declarationMap": true
  }
}
```

### Incremental Compilation

Enable incremental compilation for faster rebuilds.

```json
{
  "compilerOptions": {
    "incremental": true,
    "tsBuildInfoFile": "./.tsbuildinfo"
  }
}
```

---

## Summary

**Advanced patterns to master:**
- Conditional types for flexible type transformations
- Mapped types for creating new types from existing ones
- Template literal types for type-safe string patterns
- Discriminated unions for robust state management
- Branded types for domain modeling

**Utility types to leverage:**
- Built-in utilities (`Partial`, `Pick`, `Omit`, `Record`, etc.)
- Custom utilities for project-specific needs

**Generics best practices:**
- Use constraints to make generics more specific
- Let TypeScript infer types when possible
- Use descriptive names for clarity

**Declaration files:**
- Create `.d.ts` files for untyped libraries
- Use module augmentation to extend third-party types
- Declare global types when needed

**Type guards:**
- Use built-in guards (`typeof`, `instanceof`, `in`)
- Create custom type guards for complex checks
- Use assertion functions for runtime validation

**Performance:**
- Use type-only imports
- Avoid deep recursive types
- Enable incremental compilation
- Use project references for monorepos
