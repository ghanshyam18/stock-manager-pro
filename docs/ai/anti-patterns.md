# Architectural & Code Anti-patterns

This catalog outlines forbidden coding paradigms with clear explanations of why they are harmful and the correct replacement pattern. Every anti-pattern includes a forbidden example and its refactored correction.

---

## 1. `useEffect` for Derived State

### The Offense

Using `useEffect` to synchronize state that can be computed directly from existing state or props.

**Forbidden:**

```typescript
const [items, setItems] = useState([]);
const [total, setTotal] = useState(0);

useEffect(() => {
  setTotal(items.reduce((sum, item) => sum + item.price, 0));
}, [items]);
```

### Why it's an Anti-pattern

1. **Unnecessary render cycle:** Component renders once with stale `total`, then `useEffect` fires, updates state, and triggers a second render.
2. **State duplication:** `total` is entirely derivable from `items`, so storing it separately creates a synchronization risk.
3. **Cascading effects:** Other effects depending on `total` now fire one render late.

### Correct Pattern

```typescript
const [items, setItems] = useState([]);
const total = items.reduce((sum, item) => sum + item.price, 0);
```

---

## 2. Direct DOM Style Overrides (Hover Listeners)

### The Offense

Using React event handlers (`onMouseEnter`, `onMouseLeave`) to manually alter styles directly in the DOM.

**Forbidden:**

```typescript
onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'var(--mantine-color-gray-0)')}
onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
```

### Why it's an Anti-pattern

1. **Bypasses Virtual DOM:** Directly manipulates DOM nodes, bypassing React's rendering pipeline.
2. **Poor Performance:** Forces browser layout recalculations on every gesture.
3. **Breaks Dark Mode:** Hardcodes background variables that bypass Mantine's theme system.

### Correct Pattern

```typescript
// CSS hover class in stylesheet
<UnstyledButton className={classes.hoverRow}>

// Or Mantine's component-level styles
```

---

## 3. In-Memory Big Data Operations

### The Offense

Fetching full tables into JavaScript arrays via `.toArray()` and running O(N) operations in browser memory.

**Forbidden:**

```typescript
let collection = db.transactions.toCollection();
await collection.each((item) => {
  const existing = groups.get(item.designNo);
  // In-memory Map aggregations
});
```

### Why it's an Anti-pattern

1. **Scales horribly:** Memory consumption spikes exponentially as rows grow.
2. **Main thread blocking:** Single-threaded JavaScript blocks rendering during complex operations.

### Correct Pattern

Use pre-materialized aggregates or B-Tree compound index filters with `.limit()`:

```typescript
const results = await db.catalog.orderBy('updatedAt').reverse().limit(limit).toArray();
```

---

## 4. Business Logic in Database Hooks

### The Offense

Embedding complex domain business rules inside low-level database lifecycle hooks.

**Forbidden:**

```typescript
this.transactions.hook('creating', (primKey, obj, transaction) => {
  // Recalculates totals inside DB hook
});
```

### Why it's an Anti-pattern

1. **Coupled layers:** Infrastructure tightly coupled to domain rules.
2. **Unpredictable failures:** Hook errors are hard to capture.
3. **Untestable:** Requires full IndexedDB driver to test simple business logic.

### Correct Pattern

```typescript
export async function addStockTransaction(data: StockData) {
  return await db.transaction('rw', [db.inventory, db.designs], async () => {
    // Insertions and updates inside explicit transaction
  });
}
```

---

## 5. Heavy Static Inline Styles

### The Offense

Hardcoding layout values directly inside `style={{ ... }}` blocks.

**Forbidden:**

```typescript
<Card style={{ backgroundColor: '#ffffff', borderRadius: '16px', padding: '16px', marginTop: '24px' }}>
```

### Why it's an Anti-pattern

1. **Violates SSOT:** Bypasses central theme variables.
2. **Breaks dark mode:** Hardcoded hex values won't adapt to color scheme changes.
3. **Bloats markup:** Inline styles make DOM heavy and hard to maintain.

### Correct Pattern

```typescript
<Paper bg="var(--mantine-color-body)" radius="lg" p="md" mt="xl" withBorder>
```

---

## 6. Whole Zustand Store Consumption

### The Offense

Destructuring or consuming the entire Zustand store object in a component.

**Forbidden:**

```typescript
const { activeTab, isModalOpen, filters, setActiveTab } = useUIStore();
```

### Why it's an Anti-pattern

1. **Re-render avalanche:** Component re-renders on every store mutation, even those affecting unrelated state slices.
2. **Performance degradation:** Cascading re-renders across all consumers.

### Correct Pattern

```typescript
const activeTab = useActiveTab();
const setActiveTab = useSetActiveTab();
```

---

## 7. Prop Drilling Instead of Composition

### The Offense

Passing data through multiple intermediate components that don't use it.

**Forbidden:**

```typescript
// PageComponent → SectionComponent → CardComponent → ButtonComponent
// Each level passes `onDelete` and `itemId` without using them
<SectionComponent onDelete={onDelete} itemId={itemId}>
  <CardComponent onDelete={onDelete} itemId={itemId}>
    <ButtonComponent onDelete={onDelete} itemId={itemId} />
  </CardComponent>
</SectionComponent>
```

### Why it's an Anti-pattern

1. **Tight coupling:** Every intermediate layer must know about props it doesn't use.
2. **Fragile refactoring:** Changing the prop shape requires editing every layer.

### Correct Pattern

Use composition with `children`, render props, or Context for deeply shared state:

```typescript
<SectionComponent>
  <CardComponent>
    <DeleteButton onClick={() => onDelete(itemId)} />
  </CardComponent>
</SectionComponent>
```

---

## 8. Non-Semantic Interactive Elements

### The Offense

Adding `onClick` handlers to generic structural elements without keyboard accessibility.

**Forbidden:**

```typescript
<Paper onClick={handleClick} style={{ cursor: 'pointer' }}>
  <Text>Click me</Text>
</Paper>
```

### Why it's an Anti-pattern

1. **Not keyboard accessible:** Cannot be focused or activated via Enter/Space.
2. **Not announced to screen readers:** Assistive technology cannot identify it as interactive.

### Correct Pattern

```typescript
<Paper component="button" onClick={handleClick} aria-label="Select item">
  <Text>Click me</Text>
</Paper>
```

---

## 9. Unnecessary State Duplication

### The Offense

Storing values in state that are entirely derivable from other state or props.

**Forbidden:**

```typescript
const [items, setItems] = useState([]);
const [filteredItems, setFilteredItems] = useState([]);
const [count, setCount] = useState(0);

useEffect(() => {
  const filtered = items.filter((i) => i.active);
  setFilteredItems(filtered);
  setCount(filtered.length);
}, [items]);
```

### Why it's an Anti-pattern

1. **Three pieces of state** where one suffices.
2. **Synchronization risk:** Derived state can fall out of sync during complex updates.
3. **Double render:** `useEffect` triggers a second render cycle.

### Correct Pattern

```typescript
const [items, setItems] = useState([]);
const filteredItems = items.filter((i) => i.active);
const count = filteredItems.length;
```
