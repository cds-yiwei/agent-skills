# JavaScript to TypeScript Conversion Patterns

Reference guide for common patterns when converting JavaScript to TypeScript.

## Table of Contents

1. [Module System Conversion](#module-system-conversion)
2. [Type Annotations](#type-annotations)
3. [Common Type Patterns](#common-type-patterns)
4. [Fixing Dynamic Imports](#fixing-dynamic-imports)
5. [Test File Conversion](#test-file-conversion)
6. [Common Pitfalls](#common-pitfalls)

---

## Module System Conversion

### CommonJS to ES Modules

**Before (CommonJS):**
```javascript
const express = require('express');
const { helper } = require('./utils');
const config = require('./config');

module.exports = { myFunction };
module.exports.default = myClass;
```

**After (ES Modules):**
```typescript
import express from 'express';
import { helper } from './utils';
import * as config from './config';

export { myFunction };
export default myClass;
```

### Dynamic require() to Dynamic import()

**Before:**
```javascript
const module = require(`./modules/${name}`);
```

**After:**
```typescript
const module = await import(`./modules/${name}`);
```

---

## Type Annotations

### Function Parameters and Returns

**Before:**
```javascript
function add(a, b) {
  return a + b;
}

const greet = (name) => {
  return `Hello ${name}`;
};
```

**After:**
```typescript
function add(a: number, b: number): number {
  return a + b;
}

const greet = (name: string): string => {
  return `Hello ${name}`;
};
```

### Object Types

**Before:**
```javascript
const user = {
  name: 'John',
  age: 30,
  email: 'john@example.com'
};

function processUser(user) {
  console.log(user.name);
}
```

**After (inline type):**
```typescript
const user: { name: string; age: number; email: string } = {
  name: 'John',
  age: 30,
  email: 'john@example.com'
};

function processUser(user: { name: string; age: number; email: string }): void {
  console.log(user.name);
}
```

**After (interface - preferred for reuse):**
```typescript
interface User {
  name: string;
  age: number;
  email: string;
}

const user: User = {
  name: 'John',
  age: 30,
  email: 'john@example.com'
};

function processUser(user: User): void {
  console.log(user.name);
}
```

### Optional Properties

```typescript
interface User {
  name: string;
  age?: number;  // Optional
  email?: string; // Optional
}
```

---

## Common Type Patterns

### API Response Types

```typescript
interface ApiResponse<T> {
  data: T;
  status: number;
  message: string;
}

interface User {
  id: number;
  name: string;
}

async function fetchUser(id: number): Promise<ApiResponse<User>> {
  const response = await fetch(`/api/users/${id}`);
  return response.json();
}
```

### Express.js Types

```typescript
import { Request, Response, NextFunction } from 'express';

// Route handler
app.get('/users', (req: Request, res: Response) => {
  res.json({ users: [] });
});

// Middleware
function authMiddleware(req: Request, res: Response, next: NextFunction): void {
  if (req.headers.authorization) {
    next();
  } else {
    res.status(401).json({ error: 'Unauthorized' });
  }
}
```

### Event Handlers

```typescript
// DOM Events
function handleClick(event: MouseEvent): void {
  console.log(event.target);
}

// React Events
import { ChangeEvent, FormEvent } from 'react';

function handleChange(event: ChangeEvent<HTMLInputElement>): void {
  setValue(event.target.value);
}

function handleSubmit(event: FormEvent<HTMLFormElement>): void {
  event.preventDefault();
}
```

---

## Fixing Dynamic Imports

### require() in Tests

**Before:**
```javascript
describe('MyModule', () => {
  let myModule;
  
  beforeEach(() => {
    myModule = require('./myModule');
  });
  
  it('should work', () => {
    expect(myModule.doSomething()).toBe(true);
  });
});
```

**After:**
```typescript
import { describe, it, expect, beforeEach } from '@jest/globals';
import * as myModule from './myModule';

describe('MyModule', () => {
  it('should work', () => {
    expect(myModule.doSomething()).toBe(true);
  });
});
```

### Conditional require()

**Before:**
```javascript
if (process.env.NODE_ENV === 'development') {
  const devTools = require('dev-tools');
  devTools.init();
}
```

**After:**
```typescript
if (process.env.NODE_ENV === 'development') {
  const { default: devTools } = await import('dev-tools');
  devTools.init();
}
```

---

## Test File Conversion

### Jest Test File

**Before:**
```javascript
const { add } = require('./math');

describe('math', () => {
  test('adds numbers', () => {
    expect(add(1, 2)).toBe(3);
  });
});
```

**After:**
```typescript
import { add } from './math';

describe('math', () => {
  test('adds numbers', () => {
    expect(add(1, 2)).toBe(3);
  });
});
```

### Mock Types

```typescript
import { jest } from '@jest/globals';

// Mock a module
jest.mock('./api', () => ({
  fetchData: jest.fn<() => Promise<{ data: string }>>().mockResolvedValue({ data: 'test' })
}));

// Mock with type
const mockFn = jest.fn<(x: number) => string>();
mockFn.mockReturnValue('test');
```

---

## JSX to TSX Conversion

### React Component Props

**Before (JSX):**
```javascript
function UserCard({ user, onEdit, onDelete }) {
  return (
    <div className="user-card">
      <h2>{user.name}</h2>
      <button onClick={onEdit}>Edit</button>
      <button onClick={onDelete}>Delete</button>
    </div>
  );
}
```

**After (TSX):**
```typescript
import React from 'react';

interface User {
  id: number;
  name: string;
  email: string;
}

interface UserCardProps {
  user: User;
  onEdit: (user: User) => void;
  onDelete: (userId: number) => void;
}

function UserCard({ user, onEdit, onDelete }: UserCardProps): React.ReactElement {
  return (
    <div className="user-card">
      <h2>{user.name}</h2>
      <button onClick={() => onEdit(user)}>Edit</button>
      <button onClick={() => onDelete(user.id)}>Delete</button>
    </div>
  );
}
```

### Functional Components with Hooks

**Before (JSX):**
```javascript
import { useState, useEffect } from 'react';

function UserList() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchUsers().then(data => setUsers(data));
  }, []);

  return (
    <ul>
      {users.map(user => <li key={user.id}>{user.name}</li>)}
    </ul>
  );
}
```

**After (TSX):**
```typescript
import React, { useState, useEffect } from 'react';

interface User {
  id: number;
  name: string;
}

function UserList(): React.ReactElement {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    fetchUsers().then((data: User[]) => setUsers(data));
  }, []);

  return (
    <ul>
      {users.map(user => <li key={user.id}>{user.name}</li>)}
    </ul>
  );
}
```

### React Event Handlers

**Before (JSX):**
```javascript
function Form() {
  const handleChange = (e) => {
    console.log(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // submit logic
  };

  return (
    <form onSubmit={handleSubmit}>
      <input onChange={handleChange} />
    </form>
  );
}
```

**After (TSX):**
```typescript
import React, { ChangeEvent, FormEvent } from 'react';

function Form(): React.ReactElement {
  const handleChange = (e: ChangeEvent<HTMLInputElement>): void => {
    console.log(e.target.value);
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    // submit logic
  };

  return (
    <form onSubmit={handleSubmit}>
      <input onChange={handleChange} />
    </form>
  );
}
```

### Refs

**Before (JSX):**
```javascript
function TextInput() {
  const inputRef = useRef(null);

  const focus = () => {
    inputRef.current.focus();
  };

  return <input ref={inputRef} />;
}
```

**After (TSX):**
```typescript
import React, { useRef } from 'react';

function TextInput(): React.ReactElement {
  const inputRef = useRef<HTMLInputElement>(null);

  const focus = (): void => {
    inputRef.current?.focus();
  };

  return <input ref={inputRef} />;
}
```

### Required Dependencies for TSX

Install React type definitions:

```bash
# npm
npm install --save-dev @types/react @types/react-dom

# yarn
yarn add --dev @types/react @types/react-dom

# pnpm
pnpm add --save-dev @types/react @types/react-dom
```

### tsconfig.json for React

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "jsx": "react-jsx",
    "module": "ESNext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "allowJs": true,
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true
  },
  "include": ["src"]
}
```

---

## Fixing `any` Types

When converting JavaScript to TypeScript, `any` types often appear implicitly or explicitly. Here's how to properly type them.

### Strategy 1: Analyze Usage Patterns

Look at how the value is used to determine its type:

**Before:**
```typescript
function process(data: any) {
  return data.map(x => x.id);
}
```

**After:**
```typescript
interface Item {
  id: number;
}

function process(data: Item[]): number[] {
  return data.map(x => x.id);
}
```

### Strategy 2: Create Interfaces from Objects

When objects have consistent structure, create interfaces:

**Before:**
```typescript
const user: any = {
  name: 'John',
  age: 30,
  email: 'john@example.com'
};

function greet(user: any): string {
  return `Hello ${user.name}`;
}
```

**After:**
```typescript
interface User {
  name: string;
  age: number;
  email: string;
}

const user: User = {
  name: 'John',
  age: 30,
  email: 'john@example.com'
};

function greet(user: User): string {
  return `Hello ${user.name}`;
}
```

### Strategy 3: Use Union Types for Multiple Types

**Before:**
```typescript
function format(value: any): string {
  if (typeof value === 'string') return value.toUpperCase();
  if (typeof value === 'number') return value.toFixed(2);
  return String(value);
}
```

**After:**
```typescript
function format(value: string | number): string {
  if (typeof value === 'string') return value.toUpperCase();
  return value.toFixed(2);
}
```

### Strategy 4: Generic Types for Reusable Code

**Before:**
```typescript
function filter(items: any[], predicate: any): any[] {
  return items.filter(predicate);
}
```

**After:**
```typescript
function filter<T>(items: T[], predicate: (item: T) => boolean): T[] {
  return items.filter(predicate);
}
```

### Strategy 5: Type Assertions for Known Types

Use when you know more than TypeScript:

**Before:**
```typescript
const element = document.getElementById('app'); // any
```

**After:**
```typescript
const element = document.getElementById('app') as HTMLDivElement;
```

### Strategy 6: Use `unknown` Over `any`

When type is truly unknown at compile time:

**Before:**
```typescript
function parseData(data: any) {
  return data.nested.value;
}
```

**After:**
```typescript
function parseData(data: unknown): string {
  if (typeof data === 'object' && data !== null && 'nested' in data) {
    const nested = (data as { nested: { value: string } }).nested;
    return nested.value;
  }
  throw new Error('Invalid data structure');
}
```

### Strategy 7: Type API Responses

**Before:**
```typescript
async function fetchUser(id: number): Promise<any> {
  const response = await fetch(`/api/users/${id}`);
  return response.json();
}
```

**After:**
```typescript
interface User {
  id: number;
  name: string;
  email: string;
}

async function fetchUser(id: number): Promise<User> {
  const response = await fetch(`/api/users/${id}`);
  return response.json() as Promise<User>;
}
```

### Strategy 8: Function Parameter Types

**Before:**
```typescript
const handlers: any = {
  click: (e: any) => console.log(e.target),
  submit: (data: any) => save(data)
};
```

**After:**
```typescript
interface Handlers {
  click: (e: MouseEvent) => void;
  submit: (data: FormData) => Promise<void>;
}

const handlers: Handlers = {
  click: (e) => console.log(e.target),
  submit: (data) => save(data)
};
```

### Strategy 9: Fix Implicit Any in Callbacks

**Before:**
```typescript
const numbers = [1, 2, 3];
numbers.map(x => x * 2); // x is implicit any
```

**After:**
```typescript
const numbers: number[] = [1, 2, 3];
numbers.map((x: number) => x * 2);
// Or let inference work:
numbers.map(x => x * 2); // x inferred as number
```

### Strategy 10: Module Declaration for Untyped Libraries

**Before:**
```typescript
import { someFn } from 'untyped-lib'; // any
```

**After:**
```typescript
// types/untyped-lib.d.ts
declare module 'untyped-lib' {
  export function someFn(options: { name: string; value: number }): string;
  export const version: string;
}
```

### Quick Reference: Replacing `any`

| When you see... | Replace with... |
|----------------|-----------------|
| `data: any` (API response) | Define interface for response shape |
| `event: any` | Specific event type: `MouseEvent`, `ChangeEvent`, etc. |
| `ref: any` | `useRef<ElementType>` or `createRef<ElementType>` |
| `props: any` | Interface defining all props |
| `callback: any` | Function type: `(param: Type) => ReturnType` |
| `array: any[]` | `Array<Type>` or `Type[]` |
| `object: any` | Interface or `Record<string, Type>` |
| `value: any` (truly unknown) | `unknown` with type guards |

---

## Common Pitfalls

### 1. Implicit Any

**Problem:**
```typescript
// NoImplicitAny: true will error here
function process(data) {
  return data.map(x => x.id);
}
```

**Fix:**
```typescript
interface Item {
  id: number;
}

function process(data: Item[]): number[] {
  return data.map(x => x.id);
}
```

### 2. Window/Object Extensions

**Problem:**
```typescript
window.myGlobal = 'value'; // Error: Property 'myGlobal' does not exist
```

**Fix:**
```typescript
// Create a type declaration file (global.d.ts)
declare global {
  interface Window {
    myGlobal: string;
  }
}

export {}; // Make this a module
```

### 3. JSON Imports

**Problem:**
```typescript
import config from './config.json'; // Error if resolveJsonModule is not enabled
```

**Fix:**
Ensure `tsconfig.json` has:
```json
{
  "compilerOptions": {
    "resolveJsonModule": true,
    "esModuleInterop": true
  }
}
```

### 4. Third-party Libraries Without Types

**Problem:**
```typescript
import { someFn } from 'untyped-lib'; // Error: Could not find declaration
```

**Fix:**
```typescript
// Option 1: Install types if available
// npm install --save-dev @types/untyped-lib

// Option 2: Create a declaration file (types/untyped-lib.d.ts)
declare module 'untyped-lib' {
  export function someFn(): void;
}

// Option 3: Use as last resort
declare module 'untyped-lib';
```

### 5. Class Property Initialization

**Problem:**
```typescript
class User {
  name: string; // Error: Property has no initializer
  
  constructor() {}
}
```

**Fix:**
```typescript
class User {
  name: string;
  
  constructor(name: string) {
    this.name = name;
  }
}

// Or with definite assignment assertion (use sparingly)
class User {
  name!: string;
  
  init() {
    this.name = 'default';
  }
}
```

### 6. Null/Undefined Checks

**Problem:**
```typescript
const user = await fetchUser(1);
console.log(user.name); // Error: Object is possibly 'undefined'
```

**Fix:**
```typescript
const user = await fetchUser(1);

// Option 1: Type guard
if (user) {
  console.log(user.name);
}

// Option 2: Optional chaining
console.log(user?.name);

// Option 3: Non-null assertion (use carefully)
console.log(user!.name);
```

---

## Best Practices

1. **Enable strict mode** - Set `"strict": true` in tsconfig.json
2. **Avoid `any`** - Use `unknown` when type is truly unknown
3. **Use interfaces for objects** - More extensible than type aliases
4. **Leverage type inference** - Don't annotate when TypeScript can infer
5. **Create declaration files** - For external modules without types
6. **Use discriminated unions** - For complex state management
7. **Prefer readonly** - For data that shouldn't be modified
