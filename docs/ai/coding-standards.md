# Coding Standards & Best Practices

This document establishes the React engineering principles, TypeScript standards, state management patterns, and hook discipline enforced across the project.

---

## 1. React Component Engineering

### 1.1 Pure Components & Render Efficiency

Components should be **pure functions of their props and state**. A component's output must be entirely predictable from its inputs.

- **Avoid unnecessary rerenders.** If a parent rerenders but none of the child's props changed, the child should not rerender. Use `React.memo` when a component is demonstrably expensive and receives stable-reference props.
- **Avoid unnecessary state.** Not every value needs `useState`. If a value can be computed from props or other state, compute it during render.

### 1.2 The `useEffect` Discipline

`useEffect` is the most misused React hook. Follow these rules strictly:

**Legitimate `useEffect` uses:**

- Synchronizing with external systems (IndexedDB subscriptions, DOM APIs, browser events)
- Cleanup logic (revoking Object URLs, removing event listeners)

**Forbidden `useEffect` uses:**

- Computing derived values from state or props
- Resetting state when props change
- Transforming data for rendering
- Synchronizing two pieces of state

```typescript
// FORBIDDEN: useEffect for derived calculations
const [items, setItems] = useState([]);
const [total, setTotal] = useState(0);

useEffect(() => {
  setTotal(items.reduce((sum, item) => sum + item.price, 0));
}, [items]);

// CORRECT: Direct derivation during render
const [items, setItems] = useState([]);
const total = items.reduce((sum, item) => sum + item.price, 0);
```

```typescript
// FORBIDDEN: useEffect to sync state from props
useEffect(() => {
  setFilteredItems(items.filter((item) => item.category === activeCategory));
}, [items, activeCategory]);

// CORRECT: Derive during render
const filteredItems = items.filter((item) => item.category === activeCategory);
```

### 1.3 Memoization Guidelines

Use `useMemo` and `useCallback` **only when you can demonstrate a measurable benefit**:

- **`useMemo`**: For expensive computations (O(n²) sorting, complex aggregations) or when referential equality matters (objects/arrays passed to memoized children).
- **`useCallback`**: For callbacks passed to memoized child components or used in dependency arrays.

```typescript
// CORRECT: Expensive computation with large dataset
const sortedItems = useMemo(() => items.sort((a, b) => b.updatedAt - a.updatedAt), [items]);

// UNNECESSARY: Simple derivation
// Don't memoize: const fullName = useMemo(() => `${first} ${last}`, [first, last]);
const fullName = `${first} ${last}`;
```

### 1.4 Component Composition

Prefer **composition over monolithic components**. Large components with deeply nested conditionals should be broken into focused sub-components.

```typescript
// FORBIDDEN: Monolithic component with inline conditionals
function Dashboard() {
  return (
    <Stack>
      {isLoading ? <Skeleton /> : null}
      {error ? <Alert>{error}</Alert> : null}
      {data ? (
        <>
          {data.map((item) => (
            <Card key={item.id}>
              {/* 50 lines of inline card layout */}
            </Card>
          ))}
        </>
      ) : null}
    </Stack>
  );
}

// CORRECT: Composed sub-components
function Dashboard() {
  if (isLoading) return <DashboardSkeleton />;
  if (error) return <DashboardError error={error} />;
  return <DashboardContent data={data} />;
}

function DashboardContent({ data }: { data: DesignItem[] }) {
  return (
    <Stack>
      {data.map((item) => (
        <DesignCard key={item.id} item={item} />
      ))}
    </Stack>
  );
}
```

---

## 2. State Management Patterns

### 2.1 Zustand: Atomic Selectors

Never consume the entire Zustand store in a component. Export individual atomic selector hooks:

```typescript
// CORRECT: Atomic selectors (re-render only when specific value changes)
export const useActiveTab = () => useUIStore((state) => state.activeTab);
export const useSetActiveTab = () => useUIStore((state) => state.setActiveTab);

// FORBIDDEN: Whole-store consumption
const { activeTab, isModalOpen, filters } = useUIStore();
```

### 2.2 Database Reactive State

Always fetch database results with reactive live query hooks. This allows IndexedDB mutations to automatically propagate to views without manual polling or global context dispatchers.

### 2.3 Deferred Inputs

Input lookups and auto-completes must decouple user typing from async database matching. Use deferred value hooks to defer the autocomplete lists query state:

```typescript
const [searchText, setSearchText] = useState('');
const deferredSearch = useDeferredValue(searchText);

// Database query uses deferred value (doesn't block typing)
const results = useLiveQuery(
  () => db.designs.where('name').startsWithIgnoreCase(deferredSearch).limit(20).toArray(),
  [deferredSearch]
);
```

---

## 3. TypeScript Standards

### 3.1 Strict Typing

- **`any` is forbidden.** ESLint enforces `@typescript-eslint/no-explicit-any` as an error.
- **No unsafe casting.** `as any` and `as unknown as T` require explicit documented justification.
- **Discriminated unions** over loose string types for state machines and action types.

### 3.2 Type-Safe Component Props

Custom components must extend Mantine's base types to preserve style prop forwarding:

```typescript
import { Box, type BoxProps, Text } from '@mantine/core';

interface MetricCardProps extends BoxProps {
  label: string;
  value: string | number;
  color?: string;
}

export function MetricCard({ label, value, color = 'blue.7', ...others }: MetricCardProps) {
  return (
    <Box p="md" {...others}>
      <Text size="xs" fw={800} c="dimmed" tt="uppercase">{label}</Text>
      <Text size="xl" fw={900} c={color}>{value}</Text>
    </Box>
  );
}
```

### 3.3 Reusable Type Organization

- **Domain types**: Co-located in `src/features/<domain>/` alongside the feature they serve.
- **Global types**: Shared across multiple domains in `src/types/`.
- **Avoid type duplication**: Define once, import everywhere.

---

## 4. Import Organization

Imports follow the `simple-import-sort` ESLint plugin with this priority:

1. **Built-in / External packages** (react, next, @mantine, dexie, zustand)
2. **Shared modules** (@/shared/\*, @/types/\*)
3. **Feature modules** (@/features/\*)
4. **Relative imports** (./components, ./hooks)
5. **Styles** (./styles.css, .module.css)

---

## 5. Styling Rules

### 5.1 Strict Zero-Inline-Styles

You are **forbidden** from using inline `style={{ ... }}` objects for static styling. Dynamic style calculations (virtualization heights, dynamic translate vectors) are the **only** exception.

### 5.2 Theme-Prop Dominance

Prioritize Mantine's built-in style props over custom classes:

```typescript
// CORRECT: Mantine style props
<Paper bg="var(--mantine-color-body)" radius="lg" p="md" mt="xl" withBorder>

// FORBIDDEN: Inline styles
<div style={{ backgroundColor: '#ffffff', borderRadius: '16px', padding: '16px' }}>
```

### 5.3 Dark Mode Compliance

All implementations must use semantic colors. Never hardcode absolute color values:

```typescript
// CORRECT: Semantic variables
c = 'var(--mantine-color-text)';
bg = 'var(--mantine-color-body)';

// FORBIDDEN: Absolute values
color: 'white';
backgroundColor: '#1a1b1e';
```

---

## 6. Local-First Architecture Rules

- **Offline-First**: All data operations must go through the IndexedDB client layer via domain service files.
- **No HTTP fetch**: Do not write fetch queries to backend endpoints.
- **Client-Side Dominance**: Set client boundaries at the highest page/layout node.
