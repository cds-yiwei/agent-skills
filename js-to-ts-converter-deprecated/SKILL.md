---
name: js-to-ts-converter
description: DEPRECATED - Use js-to-ts-migration instead. This skill has been merged into js-to-ts-migration.
---

> ⚠️ **DEPRECATED** - This skill has been deprecated and merged into `js-to-ts-migration`.
> 
> Please use `js-to-ts-migration` instead, which now includes:
> - Automated ts-migrate integration
> - Type analysis and generation
> - Test-aware migration workflow
> - Modern TypeScript 5.x support
> - Better error handling

# JavaScript to TypeScript Converter (DEPRECATED)

Convert JavaScript projects to TypeScript with a comprehensive workflow covering configuration, conversion, dependency management, and verification.

## Quick Start

### Choose Your Migration Strategy

Before starting, choose the right approach for your project:

- **Incremental Migration**: Convert files as you work on them (best for small-medium projects)
- **Phased Migration**: Structured 3-phase approach (best for large projects)
- **Hybrid Approach**: Combine both strategies (best for complex projects)

See `references/migration-strategies.md` for detailed guidance on choosing and executing your strategy.

### Complete Conversion Workflow

1. Set up TypeScript configuration
2. Find JavaScript files in the project
3. Convert files with type annotations
4. Install type dependencies
5. Fix imports and module statements
6. Improve type safety (reduce `any`)
7. Fix dynamic loading in tests
8. Verify with test suite and type coverage

## Conversion Workflow

### Step 1: TypeScript Configuration

Check for existing `tsconfig.json`. If missing:

1. Copy the base template from `assets/tsconfig.base.json`
2. Adapt it based on project type (see `references/tsconfig-templates.md`):
   - Node.js backend: Use commonjs modules
   - React app: Use ESNext with JSX
   - Express API: Include Express-specific settings
   - Library: Enable declaration generation

3. Place in project root
4. Ensure `strict: true` for best type safety

Common `tsconfig.json` adjustments:
- `outDir`: Where compiled JS goes (typically `./dist`)
- `rootDir`: Source directory (typically `./src`)
- `include`: Which files to compile
- `exclude`: Skip node_modules, tests, build output

### Step 2: Find JavaScript Files

Use the helper script to identify files needing conversion:

```bash
python3 @scripts/find_js_files.py <project-path> --categorize
```

This categorizes files as:
- `src`: Application source code (priority 1)
- `tests`: Test files (priority 2)
- `config`: Configuration files (priority 3)
- `scripts`: Build/utility scripts (priority 4)
- `other`: Uncategorized

JSON output for automation:
```bash
python3 @scripts/find_js_files.py . --json --categorize
```

Show recommended conversion targets (.ts vs .tsx):
```bash
python3 @scripts/find_js_files.py . --with-target
```

This detects JSX syntax in `.js` files and suggests `.tsx` as the target extension.

### Step 3: Convert JavaScript to TypeScript

**Extension Mapping:**
- `.js` → `.ts` (JavaScript to TypeScript)
- `.jsx` → `.tsx` (JSX to TSX for React components)

**Files to Skip:**
Vite config files (`vite.config.js`, `vitest.config.js`, etc.) are automatically excluded and should remain as JavaScript.

For each file to convert:

1. **Rename**: Change extension based on mapping above
2. **Convert imports**: Transform `require()` to ES module `import`
3. **Add type annotations**:
   - Function parameters and return types
   - Variable declarations where types aren't inferred
   - Object interfaces for data structures
4. **Handle CommonJS exports**: Convert `module.exports` to `export`

See `references/conversion-patterns.md` for detailed examples of:
- CommonJS to ES Modules
- Type annotations for functions and objects
- API response types
- Express.js middleware types
- React component types

### JSX to TSX Conversion

For React components (`.jsx` files):

1. **Rename**: Change extension from `.jsx` to `.tsx`
2. **Add Props interface**: Define interface for component props
3. **Type hooks**: Add generic types to `useState`, `useRef`, etc.
4. **Type events**: Use React event types (`ChangeEvent`, `FormEvent`, etc.)

**Example:**
```typescript
// Before (JSX)
function UserCard({ user, onEdit }) {
  const [editing, setEditing] = useState(false);
  return <div>{user.name}</div>;
}

// After (TSX)
import React, { useState } from 'react';

interface UserCardProps {
  user: { name: string; id: number };
  onEdit: (user: { name: string; id: number }) => void;
}

function UserCard({ user, onEdit }: UserCardProps): React.ReactElement {
  const [editing, setEditing] = useState<boolean>(false);
  return <div>{user.name}</div>;
}
```

See `references/conversion-patterns.md` section "JSX to TSX Conversion" for complete patterns.

### Step 4: Add Type Dependencies

Check which `@types/*` packages are needed:

```bash
python3 @scripts/check_type_deps.py package.json
```

The script auto-detects your package manager (npm, yarn, or pnpm) by checking for lock files. Install missing types:

```bash
python3 @scripts/check_type_deps.py package.json --install-command
```

Specify package manager manually if needed:
```bash
python3 @scripts/check_type_deps.py package.json --package-manager yarn --install-command
```

Common types to install:
- `@types/node` - Always needed for Node.js projects
- `@types/express` - For Express apps
- `@types/react` `@types/react-dom` - For React apps
- `@types/jest` `@types/mocha` - For testing
- `@types/lodash` `@types/underscore` - For utility libraries

### Step 5: Fix Imports

Common import issues after conversion:

1. **Remove .js extensions**: Change `import './utils.js'` to `import './utils'`
2. **Convert require()**: Change `const x = require('y')` to `import x from 'y'`
3. **Named exports**: Change `const { a } = require('b')` to `import { a } from 'b'`
4. **Dynamic imports**: Use `await import()` instead of `require()` in async contexts

Verify imports with:
```bash
python3 @scripts/verify_conversion.py . --skip-tests
```

### Step 6: Fix `any` Types

Replace both **explicit** `any` annotations and **implicit** `any` (when TypeScript infers `any` due to lack of types).

**Strategies for replacing `any`:**

1. **Analyze usage patterns** - Look at how the value is used to determine its type
2. **Create interfaces from objects** - When objects have consistent structure
3. **Use union types** - For parameters accepting multiple types
4. **Use generic types** - For reusable functions and data structures
5. **Type assertions** - When you know more than TypeScript about a type
6. **Use `unknown` over `any`** - For truly unknown types at compile time
7. **Type API responses** - Define interfaces for API data structures
8. **Fix implicit any in callbacks** - Ensure array types are properly annotated

**Quick Reference:**
| When you see... | Replace with... |
|----------------|-----------------|
| `data: any` (API response) | Define interface for response shape |
| `event: any` | Specific event type: `MouseEvent`, `ChangeEvent`, etc. |
| `props: any` | Interface defining all props |
| `callback: any` | Function type: `(param: Type) => ReturnType` |
| `array: any[]` | `Array<Type>` or `Type[]` |
| `object: any` | Interface or `Record<string, Type>` |
| `value: any` (truly unknown) | `unknown` with type guards |

See `references/conversion-patterns.md` section "Fixing `any` Types" for complete strategies with examples.

### Step 7: Fix Dynamic Loading in Tests

Common test patterns that need updating:

**Before:**
```javascript
let module;
beforeEach(() => {
  module = require('./module');
});
```

**After:**
```typescript
import * as module from './module';
```

For conditional loading:
```typescript
const module = await import('./module');
```

For Jest mocks:
```typescript
import { jest } from '@jest/globals';
jest.mock('./api', () => ({
  fetchData: jest.fn<() => Promise<Data>>()
}));
```

### Step 8: Run Tests and Verify

Complete verification:

```bash
python3 @scripts/verify_conversion.py .
```

This checks:
- TypeScript compilation (no type errors)
- Test suite passes
- Import statements are correct
- `any` type usage is tracked

Individual checks:
```bash
# Only TypeScript compiler
python3 @scripts/verify_conversion.py . --skip-tests

# Only tests
python3 @scripts/verify_conversion.py . --skip-compiler
```

Fix any issues and repeat until all checks pass.

## Reference Documentation

### Migration Strategies
See `references/migration-strategies.md` for:
- Choosing the right migration approach
- Incremental migration strategy
- Phased migration strategy (Build → Migrate → Improve)
- Hybrid approach
- Migration prioritization guide
- Handling large codebases
- **Common mistakes to avoid**

### Conversion Patterns
See `references/conversion-patterns.md` for:
- Module system conversions (CommonJS → ES Modules)
- Type annotation patterns
- Function and interface examples
- Express.js, React, and API type patterns
- **Fixing `any` types - 10 strategies with examples**
- Common pitfalls and solutions

### Advanced TypeScript
See `references/advanced-typescript.md` for:
- Advanced type patterns (conditional, mapped, template literals)
- Discriminated unions and recursive types
- Utility types deep dive (built-in and custom)
- Generics best practices
- Declaration files and module augmentation
- Type guards and narrowing
- Performance considerations

### Testing and Verification
See `references/testing-and-verification.md` for:
- Testing during migration
- Type coverage tools (`type-coverage`, `typescript-coverage-report`)
- Verification strategies
- CI/CD integration
- Build tool configuration (Webpack, Vite, Babel, Jest)

### tsconfig Templates
See `references/tsconfig-templates.md` for:
- Base configuration
- Node.js backend setup
- React application setup
- Express.js API setup
- Library/package setup
- Jest testing setup
- **Monorepo configuration with project references**
- **Migration-specific configurations (relaxed → strict)**
- Compiler options reference

## Common Pitfalls to Avoid

❌ **All-at-Once Migration**: Renaming all files simultaneously causes overwhelming errors
- ✅ Solution: Use incremental or phased approach

❌ **Over-Reliance on `any`**: Using `any` everywhere defeats TypeScript's purpose
- ✅ Solution: Use `any` temporarily, create tickets to refine types, prefer `unknown`

❌ **Ignoring Type Definitions**: Not installing `@types/*` packages
- ✅ Solution: Run `check_type_deps.py` and install all type definitions

❌ **Underestimating Build Tooling**: Assuming TypeScript works without configuration
- ✅ Solution: Research tool-specific setup, test early

❌ **Direct Porting**: Converting line-by-line without refactoring
- ✅ Solution: Refactor as you convert, leverage TypeScript features

❌ **No Team Training**: Expecting developers to learn on their own
- ✅ Solution: Provide training, create documentation, pair programming

❌ **Ignoring Strictness**: Leaving `strict: false` permanently
- ✅ Solution: Plan to enable strict mode incrementally

See `references/migration-strategies.md` for complete list of mistakes and solutions.

## Tips for Successful Conversion

1. **Choose the right strategy** - Incremental vs. Phased vs. Hybrid
2. **Start with high-value files** - Utilities, core modules, shared components
3. **Enable strict mode gradually** - Start relaxed, increase strictness over time
4. **Use interfaces** for object types rather than inline types
5. **Leverage type inference** - don't annotate when TS can infer
6. **Install @types early** to catch missing definitions
7. **Run tsc --noEmit** frequently to catch type errors
8. **Keep tests passing** throughout the conversion
9. **Use `unknown` over `any`** when type is truly unknown
10. **Track progress** with type coverage tools
11. **Create declaration files** for untyped third-party modules
12. **Gradual conversion** is OK - mix of JS and TS works fine

## Troubleshooting

### Type errors in node_modules
Add `"skipLibCheck": true` to tsconfig.json

### Cannot find module
Install corresponding `@types/` package or create declaration file

### Implicit any errors
Enable `"noImplicitAny": true` and add explicit types

### require() not found
Convert to ES module syntax or install `@types/node`

### Tests fail after conversion
Check import paths, mock types, and dynamic imports

### JSX files not compiling
Ensure `tsconfig.json` has `"jsx": "react-jsx"` (or appropriate JSX setting) and install `@types/react`

### Vite config files are being converted
Vite config files (`vite.config.js`, `vitest.config.js`) are automatically excluded from conversion. If you need to convert them manually, rename them after the main conversion is complete.

### Low type coverage
Use type coverage tools to identify and fix areas with weak typing:
```bash
npx type-coverage --detail
```
See `references/testing-and-verification.md` for type coverage tools and strategies.

### Migration taking too long
If incremental migration is stalling:
- Set concrete goals ("Convert all files touched this sprint")
- Track progress weekly with metrics
- Create tickets to convert specific modules
- Consider switching to phased approach

See `references/migration-strategies.md` for detailed strategies.
