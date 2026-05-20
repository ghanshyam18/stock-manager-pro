# Performance Engineering & Optimization

This document outlines standard performance rules, rendering optimization methodologies, and memory guidelines for local IndexedDB databases on mobile environments.

---

## 1. Local Database Query Constraints (IndexedDB)

IndexedDB resides entirely inside browser disk memory. Mobile devices have slower flash storage write speeds and limited memory heaps compared to desktop environments.

### The "Anti-toArray" Law

NEVER load an entire database collection or table into a JS array using `.toArray()` or iteration-loops like `.each()` for the sole purpose of sorting, filtering, or grouping records in JavaScript memory.

- **Why it's bad:** Pulling thousands of transaction records blocks the JavaScript main thread, freezes the browser UI, and triggers browser Out-of-Memory (OOM) crashes on low-resource browser engines.
- **The Correct Index-First Solution:** Always run queries utilizing **B-Tree indices** (`orderBy()`, `where()`, `between()`). Allow database B-Tree indices to perform the filtering and sort operations at the system level.

### High-Performance Paradigm: Date Filters & Sorting

When applying filters (e.g. date filters, keyword filters), avoid reading the entire log and sorting the final array in memory:

```typescript
// Legacy Anti-Pattern: In-Memory Aggregation
let collection = db.transactions.toCollection();
// Iterates EVERY item in table to group in-memory
await collection.each((item) => { ... });
const sorted = Array.from(groups.values()).sort(...);
const paginated = sorted.slice(0, limit);
```

**Refactored High-Performance Paradigm:**

1. **Materialized Views:** Keep aggregates pre-computed. Our architecture uses a summary catalog table to keep total quantities and values materialized per category on write.
2. **Compound Indices:** Query using database compound indexes (such as `[id+date]`) and append `.limit()` to retrieve only the paginated slice needed for the viewport:
   ```typescript
   // Fast Path
   const paginatedResult = await db.catalog.orderBy('updatedAt').reverse().limit(limit).toArray();
   ```

---

## 2. Mandatory Virtualization Standard

Any list expected to grow larger than 50 elements (e.g., billing history listings, inventory transaction histories) MUST implement list virtualization.

- **Benefit:** DOM bloat is completely eliminated. The browser renders only the specific elements visible in the scroll viewport, maintaining a constant 60FPS scroll performance regardless of list size.
- **Row Estimation Rule:** Provide accurate, device-specific size estimates:
  ```typescript
  const rowVirtualizer = useVirtualizer({
    count: items.length,
    getScrollElement: () => scrollRef.current,
    estimateSize: () => (isMobile ? 132 : 72), // Mobile card height vs Desktop table row
    overscan: 10,
  });
  ```

---

## 3. Code-Splitting Heavy Dependencies

Heavy, secondary-feature dependencies must never bloat the initial application bundle or block the main thread.

### Dynamic Large Exporter Loading

Heavy libraries (such as PDF generators or spreadsheet exporters) are extremely heavy and block the main UI thread during calculation.

- **Rule:** Never import heavy secondary modules statically. Use dynamic chunk lazy loading to code-split imports.
- **UI Decoupling:** Trigger rendering only when a specific user action occurs (such as clicking a download button), keeping initial bundle size minimal and page loading instantaneous.

---

## 4. Web Blob Memory Management

Because local databases store images as binary `Blob` files, the application relies on Object URLs to render them in standard elements.

- **The Leak Risk:** Every created Object URL persists in browser memory until explicitly revoked, or until the entire browser tab is closed. Leaving these unmanaged triggers major memory leaks.
- **The Mandatory Cleanup Rule:** When using Object URLs in state, always hook unmounting cleanup functions or revoke old URLs immediately when a new one is selected:

  ```typescript
  // Standard Object URL Lifecycle Hook inside dynamic elements
  useEffect(() => {
    if (!src || !(src instanceof Blob)) return;

    const url = URL.createObjectURL(src);
    setObjectUrl(url);

    return () => {
      URL.revokeObjectURL(url); // Automated clean up on unmount or src change
    };
  }, [src]);
  ```

- **Form State Upload Cleanups:** During image selection in form states, if the user uploads multiple temporary images before hitting submit, you must call `URL.revokeObjectURL(previousUrl)` for each intermediate file replaced in state.

---

## 5. React Rendering Performance

### Component-Level Optimization

- **`React.memo` for expensive components:** Apply to list items in virtualized lists and complex card layouts that receive stable props.
- **Stable callback references:** Use `useCallback` for event handlers passed to memoized children. Avoid creating new function references on every render.
- **State colocation:** Keep state as close to the consuming component as possible. A form input's local state should not live in a parent that re-renders unrelated siblings.
- **Avoid render-triggering patterns:** Never create objects or arrays inline in JSX props — this defeats `React.memo`:

  ```typescript
  // FORBIDDEN: New object on every render
  <Component style={{ margin: 10 }} data={[1, 2, 3]} />

  // CORRECT: Stable references
  const style = useMemo(() => ({ margin: 10 }), []);
  const data = useMemo(() => [1, 2, 3], []);
  <Component style={style} data={data} />
  ```
