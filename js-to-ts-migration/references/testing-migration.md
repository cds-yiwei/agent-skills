# Test Framework Migration to TypeScript

Migrating test suites from JavaScript to TypeScript.

## Jest

### Installation

```bash
npm install --save-dev @types/jest ts-jest
```

### Configuration

```typescript
// jest.config.ts
import type { Config } from 'jest';

const config: Config = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',  // or 'node' for backend
  roots: ['<rootDir>/src'],
  testMatch: [
    '**/__tests__/**/*.+(ts|tsx|js)',
    '**/*.(test|spec).+(ts|tsx|js)'
  ],
  transform: {
    '^.+\\.(ts|tsx)$': 'ts-jest'
  },
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1'
  },
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts']
};

export default config;
```

### Setup File

```typescript
// jest.setup.ts
import '@testing-library/jest-dom';

// Global mocks
global.fetch = jest.fn();

// Extend matchers
declare global {
  namespace jest {
    interface Matchers<R> {
      toBeWithinRange(a: number, b: number): R;
    }
  }
}
```

### Writing Tests

```typescript
// Button.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { Button } from './Button';

describe('Button', () => {
  it('renders with correct text', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });

  it('calls onClick when clicked', () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Click me</Button>);
    fireEvent.click(screen.getByText('Click me'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('is disabled when loading', () => {
    render(<Button loading>Loading</Button>);
    expect(screen.getByRole('button')).toBeDisabled();
  });
});
```

### Mocking with TypeScript

```typescript
// Mocking modules
jest.mock('../api', () => ({
  fetchUser: jest.fn()
}));

import { fetchUser } from '../api';
const mockedFetchUser = fetchUser as jest.MockedFunction<typeof fetchUser>;

// Mocking with types
interface MockUser {
  id: string;
  name: string;
}

mockedFetchUser.mockResolvedValue({ id: '1', name: 'John' } as MockUser);

// Mocking React hooks
jest.mock('react', () => ({
  ...jest.requireActual('react'),
  useState: jest.fn()
}));

const mockUseState = React.useState as jest.Mock;
mockUseState.mockImplementation((initial: any) => [initial, jest.fn()]);
```

## Vitest

### Installation

```bash
npm install --save-dev vitest @vitejs/plugin-react jsdom
```

### Configuration

```typescript
// vitest.config.ts
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./src/test/setup.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html']
    }
  }
});
```

### Writing Tests

```typescript
// sum.test.ts
import { describe, it, expect } from 'vitest';
import { sum } from './sum';

describe('sum', () => {
  it('adds two numbers', () => {
    expect(sum(1, 2)).toBe(3);
  });

  it('handles negative numbers', () => {
    expect(sum(-1, -2)).toBe(-3);
  });
});
```

### Vue Testing with Vitest

```typescript
// Component.test.ts
import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import Component from './Component.vue';

describe('Component', () => {
  it('renders properly', () => {
    const wrapper = mount(Component, {
      props: { msg: 'Hello Vitest' }
    });
    expect(wrapper.text()).toContain('Hello Vitest');
  });
});
```

## Mocha

### Installation

```bash
npm install --save-dev mocha @types/mocha chai @types/chai ts-node
```

### Configuration

```json
// .mocharc.json
{
  "require": ["ts-node/register"],
  "extension": ["ts"],
  "spec": "src/**/*.test.ts"
}
```

### Writing Tests

```typescript
// math.test.ts
import { expect } from 'chai';
import { add } from './math';

describe('Math', () => {
  describe('add', () => {
    it('should add two numbers', () => {
      expect(add(1, 2)).to.equal(3);
    });

    it('should handle negative numbers', () => {
      expect(add(-1, -2)).to.equal(-3);
    });
  });
});
```

### Async Tests

```typescript
import { expect } from 'chai';
import { fetchUser } from './api';

describe('API', () => {
  it('should fetch user', async () => {
    const user = await fetchUser('123');
    expect(user).to.have.property('id');
    expect(user).to.have.property('name');
  });
});
```

## Test File Naming Convention

During migration, rename test files:

```
# Before
src/
  components/
    Button.test.js
    Form.spec.js
  utils/
    helper.test.js

# After
src/
  components/
    Button.test.tsx  # React
    Form.spec.tsx
  utils/
    helper.test.ts   # Pure TypeScript
```

## Mock Strategies

### Mocking Modules

```typescript
// __mocks__/api.ts
import { jest } from '@jest/globals';

export const fetchUser = jest.fn();
export const updateUser = jest.fn();
```

### Mocking External Libraries

```typescript
// Mock axios
jest.mock('axios');
import axios from 'axios';
const mockedAxios = axios as jest.Mocked<typeof axios>;

mockedAxios.get.mockResolvedValue({ data: { users: [] } });
```

### Manual Mocks

```typescript
// Create typed mocks
function createMockUser(overrides?: Partial<User>): User {
  return {
    id: '1',
    name: 'Test User',
    email: 'test@example.com',
    ...overrides
  };
}

// Use in tests
const user = createMockUser({ name: 'Custom Name' });
```

## Testing Utilities

### Custom Render for React Testing Library

```typescript
// test-utils.tsx
import { render as rtlRender, RenderOptions } from '@testing-library/react';
import { ReactElement } from 'react';
import { ThemeProvider } from '../context/Theme';

interface CustomRenderOptions extends Omit<RenderOptions, 'wrapper'> {
  theme?: 'light' | 'dark';
}

function render(
  ui: ReactElement,
  { theme = 'light', ...options }: CustomRenderOptions = {}
) {
  const Wrapper = ({ children }: { children: React.ReactNode }) => (
    <ThemeProvider initialTheme={theme}>
      {children}
    </ThemeProvider>
  );

  return rtlRender(ui, { wrapper: Wrapper, ...options });
}

// Re-export everything
export * from '@testing-library/react';
export { render };
```

### Vue Test Utils Configuration

```typescript
// test/utils.ts
import { config } from '@vue/test-utils';
import { createPinia } from 'pinia';

// Global plugins
config.global.plugins = [createPinia()];

// Global mocks
config.global.mocks = {
  $t: (key: string) => key
};

// Custom mount with defaults
export function mountWithDefaults(component: any, options = {}) {
  return mount(component, {
    global: {
      stubs: ['RouterLink', 'RouterView']
    },
    ...options
  });
}
```

## Coverage Configuration

### Jest

```json
// jest.config.js
module.exports = {
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!src/**/*.d.ts',
    '!src/**/__tests__/**',
    '!src/**/mocks/**'
  ],
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80
    }
  }
};
```

### Vitest

```typescript
// vitest.config.ts
export default defineConfig({
  test: {
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        'src/test/',
        '**/*.d.ts'
      ],
      thresholds: {
        lines: 80,
        functions: 80,
        branches: 80,
        statements: 80
      }
    }
  }
});
```
