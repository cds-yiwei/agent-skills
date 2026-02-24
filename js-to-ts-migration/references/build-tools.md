# Build Tool Configuration for TypeScript

Configuring build tools to support TypeScript during and after migration.

## Vite (Recommended)

Vite has native TypeScript support - no extra configuration needed for basic usage.

```typescript
// vite.config.ts
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';  // For Vue
import react from '@vitejs/plugin-react';  // For React

export default defineConfig({
  plugins: [vue()],  // or react()
  resolve: {
    alias: {
      '@': '/src'
    }
  },
  build: {
    target: 'es2020',
    outDir: 'dist'
  }
});
```

### Type Checking

Vite uses esbuild for fast transpilation but doesn't type-check. Add type checking:

```json
// package.json scripts
{
  "scripts": {
    "dev": "vite",
    "build": "vue-tsc --noEmit && vite build",  // Vue
    "build": "tsc --noEmit && vite build",      // React/Vanilla
    "preview": "vite preview"
  }
}
```

## Webpack

### Installation

```bash
npm install --save-dev typescript ts-loader source-map-loader
```

### Configuration

```javascript
// webpack.config.js
const path = require('path');

module.exports = {
  entry: './src/index.ts',
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/
      },
      {
        test: /\.js$/,
        use: 'source-map-loader',
        enforce: 'pre'
      }
    ]
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
    alias: {
      '@': path.resolve(__dirname, 'src')
    }
  },
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist')
  },
  devtool: 'source-map'
};
```

### tsconfig.json for Webpack

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "ESNext",
    "lib": ["ES2020", "DOM"],
    "jsx": "react-jsx",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "moduleResolution": "node",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true
  },
  "include": ["src/**/*"]
}
```

## Rollup

### Installation

```bash
npm install --save-dev rollup @rollup/plugin-typescript @rollup/plugin-node-resolve @rollup/plugin-commonjs
```

### Configuration

```typescript
// rollup.config.ts
import typescript from '@rollup/plugin-typescript';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';

export default {
  input: 'src/index.ts',
  output: [
    {
      file: 'dist/bundle.cjs.js',
      format: 'cjs'
    },
    {
      file: 'dist/bundle.esm.js',
      format: 'esm'
    }
  ],
  plugins: [
    resolve(),
    commonjs(),
    typescript({
      tsconfig: './tsconfig.json'
    })
  ]
};
```

### tsconfig.json for Rollup

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "ESNext",
    "lib": ["ES2020", "DOM"],
    "declaration": true,
    "declarationMap": true,
    "sourceMap": true,
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "moduleResolution": "node"
  },
  "include": ["src/**/*"]
}
```

## Parcel

Parcel has built-in TypeScript support. Just install TypeScript:

```bash
npm install --save-dev typescript
```

No configuration needed for basic usage. Add a tsconfig.json for customization.

## Rspack (Rust-based Webpack alternative)

```javascript
// rspack.config.js
module.exports = {
  entry: {
    main: './src/index.ts'
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.jsx']
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        exclude: /node_modules/,
        use: {
          loader: 'builtin:swc-loader',
          options: {
            jsc: {
              parser: {
                syntax: 'typescript',
                tsx: true
              }
            }
          }
        }
      }
    ]
  }
};
```

## Mixed JavaScript/TypeScript During Migration

### Vite

```typescript
// vite.config.ts
export default defineConfig({
  build: {
    commonjsOptions: {
      transformMixedEsModules: true
    }
  }
});
```

### Webpack

```javascript
// webpack.config.js
module.exports = {
  resolve: {
    // Allow importing both .js and .ts files
    extensions: ['.tsx', '.ts', '.js']
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/
      },
      {
        test: /\.js$/,
        use: 'source-map-loader',
        enforce: 'pre'
      }
    ]
  }
};
```

### tsconfig.json for Mixed Codebases

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "ESNext",
    "lib": ["ES2020", "DOM"],
    "allowJs": true,           // Allow JavaScript files
    "checkJs": false,          // Don't type-check JS (migration mode)
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": false,           // Start relaxed
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "moduleResolution": "node",
    "resolveJsonModule": true,
    "isolatedModules": true
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist"]
}
```

## Path Aliases

### TypeScript Config

```json
// tsconfig.json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"],
      "@components/*": ["src/components/*"],
      "@utils/*": ["src/utils/*"]
    }
  }
}
```

### Vite

```typescript
// vite.config.ts
import path from 'path';

export default defineConfig({
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@components': path.resolve(__dirname, './src/components'),
      '@utils': path.resolve(__dirname, './src/utils')
    }
  }
});
```

### Webpack

```javascript
// webpack.config.js
const path = require('path');

module.exports = {
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
      '@components': path.resolve(__dirname, 'src/components'),
      '@utils': path.resolve(__dirname, 'src/utils')
    }
  }
};
```

### Jest (if using for testing)

```javascript
// jest.config.js
module.exports = {
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '^@components/(.*)$': '<rootDir>/src/components/$1',
    '^@utils/(.*)$': '<rootDir>/src/utils/$1'
  }
};
```

## Environment-Specific Configs

### Development vs Production

```typescript
// webpack.config.js
const path = require('path');

const isDevelopment = process.env.NODE_ENV !== 'production';

module.exports = {
  mode: isDevelopment ? 'development' : 'production',
  devtool: isDevelopment ? 'eval-source-map' : 'source-map',
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: [
          {
            loader: 'ts-loader',
            options: {
              transpileOnly: isDevelopment,  // Faster builds in dev
              configFile: isDevelopment ? 'tsconfig.json' : 'tsconfig.prod.json'
            }
          }
        ]
      }
    ]
  }
};
```

## Common Issues and Solutions

### Issue: "Cannot find module" for path aliases

**Solution**: Ensure both TypeScript and build tool are configured with same aliases.

### Issue: TypeScript compilation is slow

**Solution**: 
- Use `transpileOnly: true` in ts-loader during development
- Enable `isolatedModules: true` in tsconfig
- Use incremental compilation

### Issue: Source maps not working

**Solution**:
- Enable `sourceMap: true` in tsconfig
- Enable `devtool: 'source-map'` in webpack
- Install and configure source-map-loader

### Issue: Importing JSON files

**Solution**:
```json
// tsconfig.json
{
  "compilerOptions": {
    "resolveJsonModule": true,
    "esModuleInterop": true
  }
}
```
