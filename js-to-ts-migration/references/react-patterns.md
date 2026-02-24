# React TypeScript Migration Patterns

Common patterns for converting React projects from JavaScript to TypeScript.

## Component Types

### Function Components

```typescript
// Before (JavaScript)
function UserCard({ name, email, isActive }) {
  return <div>{name}</div>;
}

// After (TypeScript)
interface UserCardProps {
  name: string;
  email: string;
  isActive: boolean;
}

function UserCard({ name, email, isActive }: UserCardProps) {
  return <div>{name}</div>;
}

// Or with type inference
function UserCard({ name, email, isActive }: { 
  name: string; 
  email: string; 
  isActive: boolean;
}) {
  return <div>{name}</div>;
}
```

### Using React.FC (Discouraged)

```typescript
// React.FC automatically includes children prop
const UserCard: React.FC<UserCardProps> = ({ name, email, isActive }) => {
  return <div>{name}</div>;
};

// Better approach - explicit props
function UserCard({ name, email, isActive, children }: UserCardProps & { children?: React.ReactNode }) {
  return <div>{name}{children}</div>;
}
```

## PropTypes to TypeScript

```typescript
// Before: PropTypes
import PropTypes from 'prop-types';

UserCard.propTypes = {
  name: PropTypes.string.isRequired,
  email: PropTypes.string.isRequired,
  isActive: PropTypes.bool,
  onUpdate: PropTypes.func.isRequired
};

// After: TypeScript interface
interface UserCardProps {
  name: string;
  email: string;
  isActive?: boolean;  // Optional prop
  onUpdate: (id: string) => void;
}
```

## Hooks

### useState

```typescript
// Type is inferred from initial value
const [count, setCount] = useState(0);  // number

// Explicit typing for complex types
const [user, setUser] = useState<User | null>(null);

// Type for arrays
const [items, setItems] = useState<string[]>([]);
```

### useEffect

```typescript
useEffect(() => {
  // No special typing needed
  const fetchData = async () => {
    const result = await api.getData();
    setData(result);
  };
  fetchData();
}, []);  // Dependencies array is type-checked
```

### useRef

```typescript
// DOM element ref
const inputRef = useRef<HTMLInputElement>(null);

// Mutable ref
const countRef = useRef<number>(0);
```

### useReducer

```typescript
type State = { count: number };
type Action = { type: 'increment' } | { type: 'decrement' } | { type: 'reset'; payload: number };

const [state, dispatch] = useReducer<React.Reducer<State, Action>>(reducer, initialState);
```

## Event Handlers

```typescript
// Form events
const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault();
};

// Change events
const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  setValue(e.target.value);
};

// Click events
const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
  console.log(e.currentTarget);
};

// Keyboard events
const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
  if (e.key === 'Enter') {
    submitForm();
  }
};
```

## Context

```typescript
// Create context with proper types
interface ThemeContextType {
  theme: 'light' | 'dark';
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// Custom hook with type safety
function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
```

## Generic Components

```typescript
// Generic list component
interface ListProps<T> {
  items: T[];
  renderItem: (item: T) => React.ReactNode;
}

function List<T>({ items, renderItem }: ListProps<T>) {
  return <ul>{items.map(renderItem)}</ul>;
}

// Usage
<List<User> items={users} renderItem={(user) => <li>{user.name}</li>} />
```

## Common Types

```typescript
// Children prop
type PropsWithChildren<P = unknown> = P & { children?: React.ReactNode };

// Style prop
type StyleProps = { style?: React.CSSProperties };

// ClassName prop
type ClassNameProps = { className?: string };

// Event handlers
type ButtonProps = {
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  onSubmit?: React.FormEventHandler<HTMLFormElement>;
};

// Ref forwarding
const FancyButton = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (props, ref) => (
    <button ref={ref}>{props.children}</button>
  )
);
```

## Next.js Specifics

### Page Components

```typescript
// pages/index.tsx
import { GetServerSideProps, NextPage } from 'next';

interface HomePageProps {
  data: string[];
}

const HomePage: NextPage<HomePageProps> = ({ data }) => {
  return <div>{data}</div>;
};

export const getServerSideProps: GetServerSideProps<HomePageProps> = async () => {
  const data = await fetchData();
  return { props: { data } };
};
```

### API Routes

```typescript
// pages/api/users.ts
import { NextApiRequest, NextApiResponse } from 'next';

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<User[] | { error: string }>
) {
  if (req.method === 'GET') {
    res.status(200).json(users);
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
```
