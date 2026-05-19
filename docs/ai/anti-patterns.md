# Architectural & Code Anti-patterns

This catalog outlines forbidden coding paradigms, styling violations, and database patterns found in the repository. Avoid these anti-patterns at all costs.

---

## 1. Direct DOM Styles Override (Hover Listeners)

### The Offense

Using React event handlers (`onMouseEnter`, `onMouseLeave`) to manually alter style colors and override background styling directly in the DOM.

**Forbidden Example:**

```typescript
onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'var(--mantine-color-gray-0)')}
onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
```

### Why it's an Anti-pattern

1. **Bypasses Virtual DOM:** Directly manipulates the standard HTML DOM nodes, bypassing React's rendering pipeline.
2. **Poor Performance:** Forces standard browser layout recalculations on every mouse enter/leave gesture, leading to stuttering lists on budget touch devices.
3. **Breaks Dark Mode:** Hardcodes background variables that bypass Mantine's centralized light/dark system settings.

### Correct Refactored Pattern

Standardize hover behaviors using native CSS Modules or global utility classes (such as hover classes in global stylesheets):

```typescript
// Correct Mantine v9 styling wrapper
<UnstyledButton className={classes.hoverRow}>
```

---

## 2. In-Memory Big Data Operations

### The Offense

Fetching full tables of data into JavaScript arrays via `.toArray()` and executing O(N) filtering, grouping, or aggregations in browser memory.

**Forbidden Example:**

```typescript
let collection = db.transactions.toCollection();
// Loads thousands of transaction records into JS memory
await collection.each((item) => {
  const existing = groups.get(item.designNo);
  // ... in-memory Map aggregations ...
});
```

### Why it's an Anti-pattern

1. **Scales Horribly:** As database rows scale from 100 to 10,000, browser memory consumption spikes exponentially.
2. **Main Thread Blocking:** JavaScript is single-threaded. Running complex grouping and sort cycles in JS blocks rendering, freezing the UI input cursor.

### Correct Refactored Pattern

Let the database do the work. Utilize pre-materialized aggregates (such as keeping summary statistics in a master summary table) or leverage B-Tree compound index filters coupled with `.limit()` constraints.

---

## 3. Fat Infrastructure Layer (Logic in DB Hooks)

### The Offense

Embedding highly complex domain business rules (recalculating total inventory quantities, calculating average prices, transferring category totals) inside low-level database lifecycle hooks (e.g. database creation or update interceptors).

**Forbidden Example:**

```typescript
this.transactions.hook('creating', (primKey, obj, transaction) => {
  // Recalculates total values and writes to designs table directly in low-level DB hook
});
```

### Why it's an Anti-pattern

1. **Coupled Layers:** Infrastructure database schemas are tightly coupled to domain rules, violating Single Responsibility.
2. **Unpredictable Failure Mode:** Hook errors are hard to capture, leading to silent database corruptions or aggregate mismatches.
3. **No Mocking/Testing:** Running unit tests on simple business rules requires instantiating complete IndexedDB drivers in memory.

### Correct Refactored Pattern

Move calculations to a clean Service layer, executing operations inside explicit transactional blocks:

```typescript
export async function addStockTransaction(data: StockData) {
  return await db.transaction('rw', [db.inventory, db.designs], async () => {
    // Perform insertions and updates atomicity inside transaction
  });
}
```

---

## 4. Heavy Static Inline Styles

### The Offense

Hardcoding inline layout vectors, widths, offsets, paddings, and hex codes directly inside `style={{ ... }}` blocks.

**Forbidden Example:**

```typescript
<Card style={{ backgroundColor: '#ffffff', borderRadius: '16px', padding: '16px', marginTop: '24px' }}>
```

### Why it's an Anti-pattern

1. **Violates SSOT:** Bypasses central theme variables, preventing updates to border radius, shadows, or branding.
2. **Breaks Dark Mode:** Hardcoded hex values (like `#ffffff`) will render blindingly white panels even when dark mode is activated.
3. **Bloats markup:** Direct inline style attributes make the final HTML DOM heavy and harder to maintain.

### Correct Refactored Pattern

Translate inline style configurations to Mantine's theme-aware style properties:

```typescript
<Paper bg="var(--mantine-color-body)" radius="lg" p="md" mt="xl" withBorder>
```
