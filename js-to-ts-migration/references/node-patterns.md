# Node.js/Express TypeScript Migration Patterns

Common patterns for converting Node.js and Express projects from JavaScript to TypeScript.

## Express Request/Response Types

```typescript
import { Request, Response, NextFunction } from 'express';

// Basic route handler
app.get('/users', (req: Request, res: Response) => {
  res.json({ users: [] });
});

// With typed body
interface CreateUserBody {
  name: string;
  email: string;
}

app.post('/users', (req: Request<{}, {}, CreateUserBody>, res: Response) => {
  const { name, email } = req.body;
  // name and email are properly typed
});

// With typed params
app.get('/users/:id', (req: Request<{ id: string }>, res: Response) => {
  const { id } = req.params;  // string
});

// With typed query
app.get('/search', (req: Request<{}, {}, {}, { q: string }>, res: Response) => {
  const { q } = req.query;  // string
});
```

## Custom Request Types

```typescript
// Extend Express Request to include custom properties
declare global {
  namespace Express {
    interface Request {
      user?: User;
      requestId: string;
    }
  }
}

// Use in middleware
const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  req.user = { id: '123', name: 'John' };  // Now properly typed
  next();
};
```

## Middleware Typing

```typescript
import { Request, Response, NextFunction } from 'express';

// Error handling middleware
interface CustomError extends Error {
  statusCode?: number;
}

const errorHandler = (
  err: CustomError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const status = err.statusCode || 500;
  res.status(status).json({ error: err.message });
};

// Async middleware wrapper
type AsyncRequestHandler = (
  req: Request,
  res: Response,
  next: NextFunction
) => Promise<void>;

const asyncHandler = (fn: AsyncRequestHandler) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

// Usage
app.get('/users', asyncHandler(async (req, res) => {
  const users = await db.getUsers();
  res.json(users);
}));
```

## Controller Pattern

```typescript
// types.ts
interface User {
  id: string;
  name: string;
  email: string;
}

interface CreateUserDTO {
  name: string;
  email: string;
}

// controller.ts
import { Request, Response } from 'express';

export class UserController {
  constructor(private userService: UserService) {}

  async getAll(req: Request, res: Response): Promise<void> {
    const users = await this.userService.findAll();
    res.json(users);
  }

  async getById(req: Request<{ id: string }>, res: Response): Promise<void> {
    const user = await this.userService.findById(req.params.id);
    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }
    res.json(user);
  }

  async create(
    req: Request<{}, {}, CreateUserDTO>,
    res: Response
  ): Promise<void> {
    const user = await this.userService.create(req.body);
    res.status(201).json(user);
  }
}
```

## Environment Variables

```typescript
// types/env.d.ts
declare namespace NodeJS {
  interface ProcessEnv {
    NODE_ENV: 'development' | 'production' | 'test';
    PORT: string;
    DATABASE_URL: string;
    JWT_SECRET: string;
    API_KEY?: string;
  }
}

// config.ts
const config = {
  port: parseInt(process.env.PORT, 10) || 3000,
  env: process.env.NODE_ENV,
  databaseUrl: process.env.DATABASE_URL,
  jwtSecret: process.env.JWT_SECRET
} as const;

export default config;
```

## Service Layer

```typescript
// service.ts
interface UserRepository {
  findAll(): Promise<User[]>;
  findById(id: string): Promise<User | null>;
  create(data: CreateUserDTO): Promise<User>;
}

export class UserService {
  constructor(private repository: UserRepository) {}

  async findAll(): Promise<User[]> {
    return this.repository.findAll();
  }

  async findById(id: string): Promise<User | null> {
    return this.repository.findById(id);
  }

  async create(data: CreateUserDTO): Promise<User> {
    // Validation logic
    if (!data.email.includes('@')) {
      throw new ValidationError('Invalid email');
    }
    return this.repository.create(data);
  }
}

// Custom error classes
export class ValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ValidationError';
  }
}
```

## Database Models

```typescript
// Using with TypeORM
import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ unique: true })
  email: string;

  @Column({ default: true })
  isActive: boolean;
}

// Using with Prisma
// schema.prisma is already typed
// Generated types are in @prisma/client

import { PrismaClient, User } from '@prisma/client';
const prisma = new PrismaClient();

async function getUser(id: string): Promise<User | null> {
  return prisma.user.findUnique({ where: { id } });
}
```

## Route Handlers

```typescript
// routes.ts
import { Router } from 'express';
import { UserController } from './controller';

const router = Router();
const userController = new UserController(userService);

router.get('/', userController.getAll.bind(userController));
router.get('/:id', userController.getById.bind(userController));
router.post('/', userController.create.bind(userController));

export default router;

// app.ts
import express from 'express';
import userRoutes from './routes';

const app = express();
app.use('/users', userRoutes);
```

## File System Operations

```typescript
import { readFile, writeFile } from 'fs/promises';

interface Config {
  apiUrl: string;
  timeout: number;
}

async function loadConfig(path: string): Promise<Config> {
  const data = await readFile(path, 'utf-8');
  return JSON.parse(data) as Config;
}

async function saveConfig(path: string, config: Config): Promise<void> {
  await writeFile(path, JSON.stringify(config, null, 2));
}
```

## Common Middleware Patterns

```typescript
// Logger middleware
import { Request, Response, NextFunction } from 'express';

const logger = (req: Request, res: Response, next: NextFunction) => {
  console.log(`${req.method} ${req.path}`);
  next();
};

// CORS middleware
interface CorsOptions {
  origin?: string | string[] | boolean;
  methods?: string[];
  credentials?: boolean;
}

const cors = (options: CorsOptions = {}) => {
  return (req: Request, res: Response, next: NextFunction) => {
    res.header('Access-Control-Allow-Origin', options.origin || '*');
    next();
  };
};

// Rate limiting middleware
interface RateLimitOptions {
  windowMs: number;
  max: number;
}

const rateLimit = (options: RateLimitOptions) => {
  const requests = new Map<string, number[]>();
  
  return (req: Request, res: Response, next: NextFunction) => {
    const now = Date.now();
    const windowStart = now - options.windowMs;
    
    const clientRequests = requests.get(req.ip) || [];
    const recentRequests = clientRequests.filter(time => time > windowStart);
    
    if (recentRequests.length >= options.max) {
      res.status(429).json({ error: 'Too many requests' });
      return;
    }
    
    recentRequests.push(now);
    requests.set(req.ip, recentRequests);
    next();
  };
};
```
