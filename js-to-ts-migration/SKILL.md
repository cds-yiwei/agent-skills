---
name: js-to-ts-migration
description: "Migrate JavaScript projects to TypeScript using ts-migrate with guided automation. Supports React/Next.js, Node.js/Express, Vue.js 3, and vanilla JavaScript. Features include: type analysis, common type generation, test-aware migration, TypeScript 5.x support, and better error handling. Use when converting .js/.jsx to .ts/.tsx, setting up TypeScript, adding type definitions, configuring build tools for TypeScript, or migrating test suites to TypeScript."
---

# JavaScript to TypeScript Migration

This skill provides an automated, guided approach to migrating JavaScript projects to TypeScript with enhanced type analysis and test-aware migration.

## Quick Start

```bash
# 0. Validate environment
node scripts/validate-environment.js

# 1. Analyze your project
node scripts/analyze-project.js

# 2. Generate tsconfig.json
node scripts/generate-tsconfig.js

# 3. Analyze missing types (excludes tests)
node scripts/analyze-missing-types.js

# 4. Generate types from YOUR project code (analyzes actual code, not templates)
node scripts/generate-common-types.js

# 5. Setup type dependencies
node scripts/setup-type-dependencies.js

# 6. Migrate ALL source files under src/ (finds .js/.jsx in all subdirs, excludes tests)
node scripts/migrate-source-only.js

# 7. Fix implicit any types
node scripts/fix-implicit-any.js

# 8. Fix explicit any types  
node scripts/replace-any-types.js

# 9. Migrate test files
node scripts/migrate-test-files.js

# 10. Run tests and fix errors
node scripts/run-tests-and-fix.js

# 11. Fix @ts-ignore comments
node scripts/fix-ts-ignores.js

# 12. Enable strict mode (FINAL STEP - only after all type fixes)
node scripts/strict-mode-enabler.js
```

## Migration Workflow

### Phase 0: Environment Validation

Validate your development environment before starting:

```bash
node scripts/validate-environment.js
```

Checks:
- Node.js version (minimum 14.0.0)
- TypeScript version (minimum 4.5.0, recommended 5.0.0+)
- package.json exists
- tsconfig.json (if exists)
- src/ directory
- Required dependencies

### Phase 1: Project Analysis

Run the analysis script to detect your project type and configuration:

```bash
node scripts/analyze-project.js
```

This creates `.migration-analysis.json` with:
- Project type (react | vue3 | node | vanilla)
- Build tool (vite | webpack | rollup | parcel | rspack)
- Test framework (jest | vitest | mocha | jasmine)
- Package manager (npm | yarn | pnpm)

### Phase 2: TypeScript Setup

Generate a migration-friendly tsconfig.json:

```bash
node scripts/generate-tsconfig.js
```

This creates a tsconfig with:
- `allowJs: true` - Allow mixed JS/TS during migration
- `strict: false` - Start relaxed, enable later
- Framework-specific settings

### Phase 3: Analyze Missing Types

**New: Analyze types before migration, excluding test files**

```bash
node scripts/analyze-missing-types.js
```

This analyzes source files (excluding tests) to detect:
- Missing `@types/*` packages
- Implicit `any` usage patterns
- API response shapes needing interfaces
- Common object patterns (pagination, errors, users, etc.)

Creates `.migration-missing-types.json` with:
- List of packages needing `@types/*`
- Packages needing custom declarations
- Object patterns detected
- API patterns found

### Phase 4: Generate Types from Project Analysis

**New: Analyzes YOUR project code and generates types based on actual usage**

```bash
node scripts/generate-common-types.js
```

Unlike template-based approaches, this script:
- Scans all your JavaScript/TypeScript files
- Extracts object shapes and patterns from your actual code
- Generates interfaces from PropTypes (React)
- Creates project-specific types (not generic templates)

Generates files in `src/types/`:
- `api.types.ts` - Types from API response patterns
- `domain.types.ts` - Domain model types (User, Account, etc.)
- `config.types.ts` - Configuration object types
- `components.types.ts` - React component props (React projects)
- `utils.types.ts` - Utility types

See [references/common-types.md](references/common-types.md) for details.

### Phase 5: Setup Type Dependencies

**New: Install type packages and create declarations**

```bash
node scripts/setup-type-dependencies.js
```

This:
- Installs missing `@types/*` packages
- Creates declaration files for untyped libraries
- Updates tsconfig.json with type roots

Options:
- `--dry-run` - Preview without making changes
- `--install pkg1,pkg2` - Install specific packages
- `--declare pkg1,pkg2` - Create declarations for packages

### Phase 6: Migrate ALL Source Files Under src/ (Skip Tests)

**Enhanced: Finds and migrates ALL .js/.jsx files under src/**

```bash
node scripts/migrate-source-only.js
```

This converts `.js/.jsx` → `.ts/.tsx` for ALL source files under `src/`:
- **Searches src/ and ALL subdirectories** (lib/, components/, utils/, etc.)
- Excludes all test files (*.test.*, *.spec.*, __tests__/*)
- Excludes Vite config files
- Uses ts-migrate for automated conversion
- Falls back to manual conversion if needed

Options:
- `--dry-run` - Preview without making changes
- `--no-ts-migrate` - Use manual conversion instead
- `--verbose` - Show detailed output

### Phase 7: Fix Implicit Any Types

**New: Automatically fix implicit any types**

```bash
node scripts/fix-implicit-any.js
```

Analyzes function parameters and infers types from usage:
- Detects function parameters without type annotations
- Infers types from parameter names (e.g., `event` → `Event`)
- Infers types from usage patterns (e.g., `param.map()` → `unknown[]`)
- Adds type annotations to fix `noImplicitAny` errors

Options:
- `--dry-run` - Preview changes without modifying files
- `--verbose` - Show detailed output

### Phase 8: Migrate Test Files

**New: Migrate tests using newly created types**

```bash
node scripts/migrate-test-files.js
```

Runs AFTER source migration is complete:
- Uses types created during source migration
- Updates test imports to use new types
- Converts Jest/Vitest mocks with proper types
- Adds proper type imports for test utilities

### Phase 9: Fix Explicit `any` Types

Replace explicit `any` types with proper TypeScript types:

```bash
node scripts/replace-any-types.js
```

Priority-based fixing:
1. **High**: Public APIs, exported functions
2. **Medium**: Internal functions
3. **Low**: Test mocks

See [references/advanced-typescript.md](references/advanced-typescript.md) for type patterns.

### Phase 10: Run Tests and Fix

**New: Iterative test fixing with suggestions**

```bash
node scripts/run-tests-and-fix.js
```

This:
- Checks TypeScript compilation
- Runs test suite
- Categorizes errors (type, import, mock, assertion)
- Generates fix suggestions
- Iterates until tests pass or max iterations reached

Options:
- `--max-iterations N` - Maximum fix iterations (default: 5)
- `--skip-ts-check` - Skip TypeScript check
- `--verbose` - Show detailed suggestions

### Phase 11: Fix @ts-ignore Comments

Address @ts-ignore comments added during migration:

```bash
node scripts/fix-ts-ignores.js
```

**Common fixes by category:**

**null-safety:** Add null checks or optional chaining
```typescript
// From:
// @ts-ignore
const length = data.length

// To:
const length = data?.length ?? 0
```

**type-mismatch:** Add proper type annotations
```typescript
// From:
// @ts-ignore
const user = getUser()

// To:
const user: User = getUser()
```

### Phase 12: Strict Mode Enablement (FINAL STEP)

**⚠️ Only run this AFTER all type fixes are complete!**

Gradually enable strict mode with rollback support:

```bash
node scripts/strict-mode-enabler.js
```

**Pre-checks before enabling:**
- Counts explicit `any` types in your codebase
- Warns if many any types found (recommends fixing first)
- Checks TypeScript compilation

**8-Level Progression:**
1. `noImplicitAny` - Disallow implicit any types (run fix-implicit-any.js first!)
2. `strictNullChecks` - Enable strict null/undefined checks
3. `strictFunctionTypes` - Enable strict function type checking
4. `strictBindCallApply` - Enable strict bind/call/apply checking
5. `strictPropertyInitialization` - Enable strict class property initialization
6. `noImplicitThis` - Disallow implicit any for this
7. `alwaysStrict` - Enable strict mode in emitted JS
8. `strict` - Enable all strict options + unused code detection (run replace-any-types.js first!)

### Phase 13: Progress Tracking

**New: Track migration progress over time**

```bash
node scripts/progress-tracker.js
```

Tracks:
- JS vs TS file counts
- `any` type usage
- @ts-ignore counts
- TypeScript error counts
- Type coverage percentage

Options:
- `--reset` - Clear progress history
- `--verbose` - Show files with most issues

## Framework-Specific Guidance

### React Projects

See [references/react-patterns.md](references/react-patterns.md) for:
- PropTypes to TypeScript conversion
- Function component types
- Hook typing (useState, useEffect, useRef)
- Event handler types
- Context API typing
- Next.js specifics

### Node.js/Express Projects

See [references/node-patterns.md](references/node-patterns.md) for:
- Request/Response types
- Middleware typing
- Controller patterns
- Environment variables typing
- Service layer patterns
- Database model types (TypeORM, Prisma)

### Vue 3 Projects

See [references/vue3-patterns.md](references/vue3-patterns.md) for:
- Script setup with TypeScript
- defineProps/defineEmits typing
- Composables patterns
- Reactive state typing
- Pinia store typing
- Vue Router typed navigation
- Provide/Inject typing

### Vanilla JavaScript

Standard TypeScript setup applies. Focus on:
- Adding types to function parameters
- Creating interfaces for data structures
- Typing module exports

## TypeScript 5.x Features

See [references/typescript-5-features.md](references/typescript-5-features.md) for:
- `satisfies` operator for type checking without widening
- `const` type parameters for precise inference
- `using` keyword for resource management
- `moduleResolution: "bundler"` for modern bundlers
- Improved decorators support
- `verbatimModuleSyntax` for cleaner imports

## Migration Strategies

See [references/migration-strategies.md](references/migration-strategies.md) for:
- Incremental migration strategy
- Phased migration strategy (Build → Migrate → Improve)
- Hybrid approach
- Migration prioritization guide
- Handling large codebases
- Common mistakes to avoid

## Troubleshooting

See [references/troubleshooting.md](references/troubleshooting.md) for solutions to:
- "Cannot find module" errors
- Missing type definitions
- Import/export issues
- Null/undefined errors
- JSX/TSX problems
- Build performance issues
- Memory issues

Common quick fixes:

```typescript
// @ts-ignore - Ignore next line
// @ts-nocheck - Ignore entire file
// any - Temporary escape hatch (use sparingly)
// Type assertion - const el = document.getElementById('app') as HTMLElement
```

## Scripts Reference

### Core Migration Scripts

| Script | Purpose |
|--------|---------|
| `validate-environment.js` | Check Node.js, TypeScript versions, dependencies |
| `analyze-project.js` | Detect project configuration |
| `generate-tsconfig.js` | Create framework-specific tsconfig |
| `analyze-missing-types.js` | Detect missing types before migration |
| `generate-common-types.js` | **NEW** Analyze project code, generate types from actual usage |
| `setup-type-dependencies.js` | Install @types, create declarations |
| `migrate-source-only.js` | **UPDATED** Convert ALL .js/.jsx files under src/ |
| `fix-implicit-any.js` | **NEW** Auto-fix implicit any types |
| `migrate-test-files.js` | Convert test files with existing types |
| `run-ts-migrate.js` | Execute ts-migrate with validation |
| `run-tests-and-fix.js` | Run tests with iterative fixing |

### Cleanup Scripts

| Script | Purpose |
|--------|---------|
| `cleanup-unused-vars.js` | Remove unused variables |
| `replace-any-types.js` | Replace any types with proper types |
| `fix-ts-ignores.js` | Fix @ts-ignore comments |
| `strict-mode-enabler.js` | Gradual strict mode enablement |
| `progress-tracker.js` | **NEW** Track migration progress |

### Utility Scripts

| Script | Purpose |
|--------|---------|
| `check-types.js` | Check npm for @types packages |
| `analyze-dependencies.js` | Build dependency graph |
| `suggest-plugins.js` | Recommend ts-migrate plugins |
| `detect-package-manager.js` | Detect npm/yarn/pnpm |
| `cleanup-report.js` | Generate cleanup report |
| `error-utils.js` | Shared error handling utilities |

## Best Practices

1. **Validate environment first** - Ensure Node.js and TypeScript are up to date
2. **Analyze before migrating** - Understand what types are missing in YOUR code
3. **Generate types from code** - Use generate-common-types.js to analyze actual patterns
4. **Migrate source first, tests later** - Defer test migration until types exist
5. **Find ALL js/jsx files** - migrate-source-only.js searches entire project
6. **Fix implicit any first** - Run fix-implicit-any.js before noImplicitAny
7. **Fix explicit any second** - Run replace-any-types.js before strict mode
8. **Use `allowJs: true`** - Keep mixing JS/TS during migration
9. **Disable strict mode initially** - Enable ONLY after all type fixes complete
10. **Install @types first** - Before running ts-migrate
11. **Fix errors incrementally** - Don't try to fix all at once
12. **Test frequently** - Ensure nothing breaks during migration
13. **Track progress** - Use progress-tracker.js to monitor

## Migration Timeline

**Week 1: Setup & Analysis**
- Environment validation
- Project analysis
- tsconfig creation
- Type dependency check
- **Analyze YOUR code** with generate-common-types.js

**Week 2: Source Migration**
- Run analyze-missing-types.js
- Setup type dependencies
- **Migrate ALL .js/.jsx files under src/** (all subdirectories)
- Run fix-implicit-any.js
- Fix explicit any types

**Week 3: Test Migration**
- Run migrate-test-files.js
- Update test imports
- Fix mock types
- Verify tests pass

**Week 4: Cleanup & Pre-Strict**
- Fix @ts-ignore comments
- Run tests iteratively
- **Ensure minimal any types**

**Week 5+: Enable Strict Mode (FINAL)**
- Verify noImplicitAny is ready (fix-implicit-any.js done)
- Verify no any types remain (replace-any-types.js done)
- Run strict-mode-enabler.js repeatedly
- Fix errors at each level
- Rollback if overwhelmed

## Success Criteria

- All files compile without errors
- Type coverage > 80%
- **Strict mode enabled** (strict: true)
- **No implicit any** (noImplicitAny: true)
- **No explicit any types** (except in specific escape hatches with comments)
- No unnecessary @ts-ignore comments
- All tests passing
- No runtime behavior changes

## Resources

- ts-migrate GitHub: https://github.com/airbnb/ts-migrate
- TypeScript Handbook: https://www.typescriptlang.org/docs/
- TypeScript 5.x Features: [references/typescript-5-features.md](references/typescript-5-features.md)
- Common Types: [references/common-types.md](references/common-types.md)
- React TypeScript Cheatsheet: https://react-typescript-cheatsheet.netlify.app/
- Vue 3 TypeScript Guide: https://vuejs.org/guide/typescript/overview.html
