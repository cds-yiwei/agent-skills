# TypeScript Configuration Templates

Reference templates for different project types.

## Table of Contents

1. [Base Configuration](#base-configuration)
2. [Node.js Backend](#nodejs-backend)
3. [React Application](#react-application)
4. [Express.js API](#expressjs-api)
5. [Library/Package](#librarypackage)
6. [Jest Testing Setup](#jest-testing-setup)

---

## Base Configuration

Standard `tsconfig.json` for most projects:

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "commonjs",
    "lib": ["ES2020"],
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true,
    "declaration": true,
    "declarationMap": true,
    "sourceMap": true,
    "moduleResolution": "node",
    "allowSyntheticDefaultImports": true,
    "experimentalDecorators": true,
    "emitDecoratorMetadata": true
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist", "**/*.test.ts", "**/*.spec.ts"]
}
```

---

## Node.js Backend

For Node.js server applications:

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "commonjs",
    "lib": ["ES2020"],
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true,
    "moduleResolution": "node",
    "allowSyntheticDefaultImports": true,
    "sourceMap": true,
    "declaration": false,
    "noImplicitAny": true,
    "strictNullChecks": true,
    "noImplicitThis": true,
    "alwaysStrict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noImplicitReturns": true,
    "noFallthroughCasesInSwitch": true
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist", "**/*.test.ts", "**/*.spec.ts"]
}
```

### Recommended package.json scripts:
```json
{
  "scripts": {
    "build": "tsc",
    "start": "node dist/index.js",
    "dev": "ts-node src/index.ts",
    "type-check": "tsc --noEmit",
    "clean": "rm -rf dist"
  }
}
```

### Dependencies to install:
```bash
npm install --save-dev typescript @types/node ts-node nodemon
```

---

## React Application

For React projects (often with Create React App or Vite):

### Vite + React
```json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"]
    }
  },
  "include": ["src"],
  "references": [{ "path": "./tsconfig.node.json" }]
}
```

### tsconfig.node.json (for Vite config):
```json
{
  "compilerOptions": {
    "composite": true,
    "skipLibCheck": true,
    "module": "ESNext",
    "moduleResolution": "bundler",
    "allowSyntheticDefaultImports": true
  },
  "include": ["vite.config.ts"]
}
```

### Dependencies:
```bash
npm install --save-dev typescript @types/react @types/react-dom
```

---

## Express.js API

Specifically tailored for Express applications:

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "commonjs",
    "lib": ["ES2020"],
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true,
    "moduleResolution": "node",
    "sourceMap": true,
    "declaration": false,
    "noImplicitAny": true,
    "strictNullChecks": true,
    "noImplicitThis": true,
    "alwaysStrict": true
  },
  "ts-node": {
    "esm": false
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist"]
}
```

### Dependencies:
```bash
npm install --save-dev typescript @types/node @types/express @types/cors @types/helmet @types/morgan ts-node
```

### nodemon.json:
```json
{
  "watch": ["src"],
  "ext": ".ts,.js",
  "ignore": [],
  "exec": "ts-node ./src/index.ts"
}
```

---

## Library/Package

For npm packages meant to be consumed by others:

```json
{
  "compilerOptions": {
    "target": "ES2018",
    "module": "commonjs",
    "lib": ["ES2018"],
    "outDir": "./lib",
    "rootDir": "./src",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "declaration": true,
    "declarationMap": true,
    "sourceMap": true,
    "moduleResolution": "node",
    "allowSyntheticDefaultImports": true,
    "experimentalDecorators": true,
    "emitDecoratorMetadata": true,
    "noImplicitAny": true,
    "strictNullChecks": true,
    "noImplicitThis": true,
    "alwaysStrict": true,
    "noUnusedLocals": false,
    "noUnusedParameters": false,
    "noImplicitReturns": true,
    "noFallthroughCasesInSwitch": true
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "lib", "**/*.test.ts", "**/*.spec.ts"]
}
```

### package.json configuration:
```json
{
  "main": "lib/index.js",
  "types": "lib/index.d.ts",
  "files": ["lib/**/*"],
  "scripts": {
    "build": "tsc",
    "prepare": "npm run build",
    "prepublishOnly": "npm test && npm run lint",
    "preversion": "npm run lint",
    "version": "npm run format && git add -A src",
    "postversion": "git push && git push --tags"
  }
}
```

---

## Jest Testing Setup

For projects using Jest for testing:

### tsconfig.json:
```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "commonjs",
    "lib": ["ES2020"],
    "outDir": "./dist",
    "rootDir": ".",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true,
    "moduleResolution": "node",
    "allowSyntheticDefaultImports": true,
    "sourceMap": true
  },
  "include": ["src/**/*", "tests/**/*"],
  "exclude": ["node_modules", "dist"]
}
```

### jest.config.js:
```javascript
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/src', '<rootDir>/tests'],
  testMatch: ['**/__tests__/**/*.ts', '**/?(*.)+(spec|test).ts'],
  transform: {
    '^.+\\.ts$': 'ts-jest',
  },
  collectCoverageFrom: ['src/**/*.ts', '!src/**/*.d.ts'],
  moduleFileExtensions: ['ts', 'js', 'json'],
  setupFilesAfterEnv: ['<rootDir>/tests/setup.ts']
};
```

### Dependencies:
```bash
npm install --save-dev jest @types/jest ts-jest
```

### TypeScript-specific Jest setup (tests/setup.ts):
```typescript
import '@jest/globals';

// Global test setup
global.beforeAll(() => {
  // Setup code
});
```

---

## Monorepo Configuration

For large monorepos with multiple packages, use TypeScript project references for faster builds and better organization.

### Root tsconfig.json

```json
{
  "files": [],
  "references": [
    { "path": "./packages/core" },
    { "path": "./packages/ui" },
    { "path": "./packages/api" },
    { "path": "./packages/utils" }
  ]
}
```

### Base tsconfig.json (tsconfig.base.json)

Shared configuration extended by all packages:

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "ESNext",
    "lib": ["ES2020"],
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "moduleResolution": "node",
    "resolveJsonModule": true,
    "declaration": true,
    "declarationMap": true,
    "sourceMap": true,
    "incremental": true
  }
}
```

### Package tsconfig.json (packages/core/tsconfig.json)

```json
{
  "extends": "../../tsconfig.base.json",
  "compilerOptions": {
    "composite": true,
    "outDir": "./dist",
    "rootDir": "./src"
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist", "**/*.test.ts"],
  "references": [
    { "path": "../utils" }
  ]
}
```

### Key Options for Project References

| Option | Purpose | Required |
|--------|---------|----------|
| `composite: true` | Enable project references | Yes |
| `declaration: true` | Generate `.d.ts` files | Yes |
| `declarationMap: true` | Enable "Go to Definition" across projects | Recommended |
| `incremental: true` | Cache compilation results | Recommended |

### Building Monorepo

```bash
# Build all projects in dependency order
tsc --build

# Build specific project and its dependencies
tsc --build packages/core

# Clean all build outputs
tsc --build --clean

# Force rebuild
tsc --build --force
```

### Using Build Tools

For better performance, use monorepo build tools:

**Turborepo**:
```json
{
  "pipeline": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": ["dist/**"]
    },
    "type-check": {
      "dependsOn": ["^type-check"]
    }
  }
}
```

**Nx**:
```bash
npx nx run-many --target=build --all
```

---

## Migration-Specific Configurations

Different `tsconfig.json` settings for different migration stages.

### Stage 1: Initial Migration (Relaxed)

Use when first converting JavaScript to TypeScript:

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "ESNext",
    "lib": ["ES2020", "DOM"],
    "allowJs": true,           // Allow JS files
    "checkJs": false,          // Don't type-check JS yet
    "strict": false,           // Relax strictness
    "noImplicitAny": false,    // Allow implicit any
    "strictNullChecks": false, // Don't enforce null checks
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "moduleResolution": "node",
    "resolveJsonModule": true,
    "outDir": "./dist",
    "rootDir": "./src"
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist"]
}
```

**Use when**: Just starting migration, need to get project compiling.

### Stage 2: Intermediate Migration (Moderate Strictness)

Use when 50%+ of files are converted:

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "ESNext",
    "lib": ["ES2020", "DOM"],
    "allowJs": true,
    "checkJs": true,           // Enable type-checking for JS
    "strict": false,
    "noImplicitAny": true,     // Require explicit types
    "strictNullChecks": false,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "moduleResolution": "node",
    "resolveJsonModule": true,
    "outDir": "./dist",
    "rootDir": "./src"
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist"]
}
```

**Use when**: Most files converted, ready to enforce some strictness.

### Stage 3: Final Migration (Full Strictness)

Use when 90%+ of files are converted:

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "ESNext",
    "lib": ["ES2020", "DOM"],
    "allowJs": false,          // No more JS files
    "strict": true,            // Full strictness
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "moduleResolution": "node",
    "resolveJsonModule": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noImplicitReturns": true,
    "noFallthroughCasesInSwitch": true,
    "outDir": "./dist",
    "rootDir": "./src"
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist"]
}
```

**Use when**: Migration complete, enforcing best practices.

### Performance-Optimized Configuration

For large projects, optimize compilation speed:

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "ESNext",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,      // Skip checking node_modules types
    "incremental": true,       // Cache compilation results
    "tsBuildInfoFile": "./.tsbuildinfo",
    "assumeChangesOnlyAffectDirectDependencies": true,
    "moduleResolution": "node",
    "resolveJsonModule": true,
    "outDir": "./dist",
    "rootDir": "./src"
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist"]
}
```

### Separate Type Checking Configuration

For projects using fast transpilers (esbuild, SWC):

**tsconfig.json** (type checking only):
```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "ESNext",
    "strict": true,
    "noEmit": true,            // Don't emit files
    "esModuleInterop": true,
    "skipLibCheck": true,
    "moduleResolution": "node",
    "resolveJsonModule": true
  },
  "include": ["src/**/*"]
}
```

**Build script**:
```json
{
  "scripts": {
    "build": "npm run type-check && esbuild src/index.ts --bundle --outfile=dist/bundle.js",
    "type-check": "tsc --noEmit"
  }
}
```

---

## Compiler Options Reference

### Essential Options

| Option | Description | Recommended |
|--------|-------------|-------------|
| `target` | JavaScript version to compile to | ES2020 |
| `module` | Module system | commonjs (Node), ESNext (Browser) |
| `strict` | Enable all strict type-checking | true |
| `esModuleInterop` | Better CommonJS/ESM interop | true |
| `skipLibCheck` | Skip type checking of declaration files | true |
| `forceConsistentCasingInFileNames` | Ensure file name casing | true |

### Strict Mode Options

When `strict: true`, all these are enabled:

| Option | Description |
|--------|-------------|
| `noImplicitAny` | Error on expressions with implied `any` |
| `noImplicitThis` | Error on `this` with implied `any` |
| `alwaysStrict` | Parse in strict mode and emit "use strict" |
| `strictNullChecks` | Enable strict null checks |
| `strictFunctionTypes` | Enable strict function type checking |
| `strictPropertyInitialization` | Ensure class properties initialized |
| `strictBindCallApply` | Enable strict `bind`, `call`, `apply` |

### Output Options

| Option | Description | Use When |
|--------|-------------|----------|
| `declaration` | Generate `.d.ts` files | Building libraries |
| `declarationMap` | Generate sourcemaps for declarations | Building libraries |
| `sourceMap` | Generate `.js.map` files | Debugging |
| `outDir` | Output directory for compiled files | Always |
| `rootDir` | Root directory of input files | Always |
