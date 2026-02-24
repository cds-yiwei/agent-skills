# Vue 3 TypeScript Migration Patterns

Common patterns for converting Vue 3 projects from JavaScript to TypeScript.

## Setup and Configuration

### env.d.ts Setup

```typescript
// env.d.ts
/// <reference types="vite/client" />

declare module '*.vue' {
  import type { DefineComponent } from 'vue';
  const component: DefineComponent<{}, {}, any>;
  export default component;
}
```

## Script Setup Pattern

### Basic Component

```vue
<script setup lang="ts">
// Props with type inference
const props = defineProps<{
  title: string;
  count?: number;
  items: string[];
}>();

// Emits with validation
const emit = defineEmits<{
  (e: 'update', value: string): void;
  (e: 'delete', id: number): void;
}>();

// Reactive state
import { ref, computed } from 'vue';

const message = ref<string>('Hello Vue');
const doubled = computed(() => props.count ? props.count * 2 : 0);

// Methods
function handleClick() {
  emit('update', message.value);
}
</script>
```

### With Default Values

```vue
<script setup lang="ts">
interface Props {
  title: string;
  count?: number;
  tags?: string[];
}

const props = withDefaults(defineProps<Props>(), {
  count: 0,
  tags: () => []
});
</script>
```

## Composables

### Basic Composable

```typescript
// useCounter.ts
import { ref, computed } from 'vue';

interface UseCounterOptions {
  initial?: number;
  min?: number;
  max?: number;
}

interface UseCounterReturn {
  count: Ref<number>;
  doubled: ComputedRef<number>;
  increment: () => void;
  decrement: () => void;
}

export function useCounter(options: UseCounterOptions = {}): UseCounterReturn {
  const { initial = 0, min, max } = options;
  const count = ref(initial);
  
  const doubled = computed(() => count.value * 2);
  
  function increment() {
    if (max === undefined || count.value < max) {
      count.value++;
    }
  }
  
  function decrement() {
    if (min === undefined || count.value > min) {
      count.value--;
    }
  }
  
  return {
    count,
    doubled,
    increment,
    decrement
  };
}

// Usage in component
const { count, doubled, increment } = useCounter({ initial: 10, max: 100 });
```

### Async Composable

```typescript
// useFetch.ts
import { ref, watchEffect } from 'vue';

interface UseFetchOptions {
  immediate?: boolean;
}

interface UseFetchReturn<T> {
  data: Ref<T | null>;
  error: Ref<Error | null>;
  loading: Ref<boolean>;
  execute: () => Promise<void>;
}

export function useFetch<T>(
  url: string | Ref<string>,
  options: UseFetchOptions = {}
): UseFetchReturn<T> {
  const data = ref<T | null>(null);
  const error = ref<Error | null>(null);
  const loading = ref(false);
  
  async function execute() {
    loading.value = true;
    error.value = null;
    
    try {
      const response = await fetch(unref(url));
      data.value = await response.json();
    } catch (e) {
      error.value = e as Error;
    } finally {
      loading.value = false;
    }
  }
  
  if (options.immediate !== false) {
    watchEffect(execute);
  }
  
  return { data, error, loading, execute };
}
```

## Reactive State

```typescript
import { reactive, ref } from 'vue';

// Reactive object (deep reactivity)
interface User {
  name: string;
  age: number;
  preferences: {
    theme: 'light' | 'dark';
  };
}

const user = reactive<User>({
  name: 'John',
  age: 30,
  preferences: {
    theme: 'dark'
  }
});

// Ref for primitives
const count = ref<number>(0);
const message = ref<string>('Hello');

// Ref for complex types
const users = ref<User[]>([]);
```

## Pinia Store

```typescript
// stores/user.ts
import { defineStore } from 'pinia';
import { ref, computed } from 'vue';

interface User {
  id: string;
  name: string;
  email: string;
}

interface UserState {
  users: User[];
  loading: boolean;
}

export const useUserStore = defineStore('user', () => {
  // State
  const users = ref<User[]>([]);
  const loading = ref(false);
  
  // Getters
  const userCount = computed(() => users.value.length);
  const getUserById = computed(() => (id: string) => 
    users.value.find(user => user.id === id)
  );
  
  // Actions
  async function fetchUsers() {
    loading.value = true;
    try {
      const response = await fetch('/api/users');
      users.value = await response.json();
    } finally {
      loading.value = false;
    }
  }
  
  function addUser(user: Omit<User, 'id'>) {
    const newUser: User = {
      ...user,
      id: crypto.randomUUID()
    };
    users.value.push(newUser);
  }
  
  return {
    users,
    loading,
    userCount,
    getUserById,
    fetchUsers,
    addUser
  };
});
```

## Vue Router Typed Navigation

```typescript
// router/index.ts
import { createRouter, createWebHistory } from 'vue-router';

// Route record types
const routes = [
  {
    path: '/',
    component: () => import('../views/Home.vue')
  },
  {
    path: '/user/:id',
    component: () => import('../views/User.vue'),
    props: true  // Pass route params as props
  }
] as const;

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;

// typed-router.d.ts (for unplugin-vue-router)
declare module 'vue-router/auto-routes' {
  export interface RouteNamedMap {
    '/': RouteRecordInfo<'/', '/', Record<never, never>, Record<never, never>>;
    '/user/[id]': RouteRecordInfo<'/user/[id]', '/user/:id', { id: string }, { id: string }>;
  }
}
```

### In Components

```vue
<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router';

const route = useRoute();
const router = useRouter();

// Access typed params
const userId = route.params.id as string;

// Typed navigation
function goToUser(id: string) {
  router.push({ name: 'user', params: { id } });
}

// Or with route path
function goHome() {
  router.push('/');
}
</script>
```

## Event Handling

```vue
<script setup lang="ts">
// Native events
function handleClick(event: MouseEvent) {
  console.log(event.target);
}

// Input events
function handleInput(event: Event) {
  const target = event.target as HTMLInputElement;
  console.log(target.value);
}

// Keyboard events
function handleKeydown(event: KeyboardEvent) {
  if (event.key === 'Enter') {
    submitForm();
  }
}

// Form events
function handleSubmit(event: Event) {
  event.preventDefault();
  // Handle form submission
}
</script>

<template>
  <button @click="handleClick">Click me</button>
  <input @input="handleInput" @keydown="handleKeydown" />
  <form @submit="handleSubmit">...</form>
</template>
```

## Component Emits with Validation

```vue
<script setup lang="ts">
const emit = defineEmits<{
  // With validation
  change: [id: number];
  update: [value: string];
  // With void return
  delete: [id: number];
}>();

// Runtime validation
const emit = defineEmits({
  change: (id: number) => {
    if (typeof id !== 'number') {
      console.warn('Invalid payload: id must be a number');
      return false;
    }
    return true;
  }
});
</script>
```

## Slots Typing

```vue
<script setup lang="ts">
import { SlotsType } from 'vue';

// Define slot types
defineSlots<{
  default: (props: { msg: string }) => any;
  item: (props: { id: number; name: string }) => any;
}>()
</script>

<template>
  <slot :msg="'Hello from slot'"></slot>
  <slot name="item" :id="1" :name="'Item 1'"></slot>
</template>
```

## Provide/Inject

```typescript
// Injection keys
import { InjectionKey } from 'vue';

interface UserContext {
  user: Ref<User | null>;
  login: (credentials: Credentials) => Promise<void>;
  logout: () => void;
}

const UserKey: InjectionKey<UserContext> = Symbol('user');

// Provider component
<script setup lang="ts">
import { provide, ref } from 'vue';

const user = ref<User | null>(null);

async function login(credentials: Credentials) {
  user.value = await authService.login(credentials);
}

function logout() {
  user.value = null;
}

provide(UserKey, {
  user,
  login,
  logout
});
</script>

// Consumer component
<script setup lang="ts">
import { inject } from 'vue';

const userContext = inject(UserKey);

if (!userContext) {
  throw new Error('UserContext must be provided');
}

const { user, login, logout } = userContext;
</script>
```
