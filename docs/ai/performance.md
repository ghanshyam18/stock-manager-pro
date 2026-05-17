# Performance Engineering & Optimization

This document outlines standard performance rules, rendering optimization methodologies, and memory guidelines for local IndexedDB databases on mobile environments.

---

## 1. Local Database Query Constraints (IndexedDB)

IndexedDB resides entirely inside browser disk memory. Mobile devices have slower flash storage write speeds and limited memory heaps compared to desktop environments.

### The "Anti-toArray" Law

NEVER load an entire database collection or table into a JS array using `.toArray()` or iteration-loops like `.each()` for the sole purpose of sorting, filtering, or grouping records in JavaScript memory.

- **Why it's bad:** Pulling thousands of transaction records (e.g. inventory history log) blocks the JavaScript main thread, freezes the browser UI, and triggers browser Out-of-Memory (OOM) crashes on low-resource iOS/Android WebKit engines.
- **The Correct Index-First Solution:** Always run queries utilizing **Dexie indices** (`orderBy()`, `where()`, `between()`). Allow IndexedDB's B-Tree indices to perform the filtering and sort operations at the system level.

### Case Study: Refactoring `useInventory` Date Filter

In [useInventory.ts](file:///home/ghanshyam/.gemini/antigravity/scratch/stock-management-app/src/features/inventory/hooks/useInventory.ts#L132-L161), when a date filter is active, the hook reads the entire inventory log, aggregates items in memory inside a Javascript Map, and sorts the final array:

```typescript
// Legacy Anti-Pattern: In-Memory Aggregation
let collection = db.inventory.toCollection();
// Iterates EVERY item in table to group in-memory
await collection.each((item) => { ... });
const sorted = Array.from(groups.values()).sort(...);
const paginated = sorted.slice(0, limit);
```

**Refactored High-Performance Paradigm:**

1. **Materialized Views:** Keep aggregates pre-computed. Our architecture uses a `designs` table to keep total quantities and values materialized per design.
2. **Compound Indices:** Query using IndexedDB compound indexes (like `[designNo+date]`) and append `.limit()` to retrieve only the paginated slice needed for the viewport:
   ```typescript
   // Fast Path
   const paginatedResult = await db.designs.orderBy('updatedAt').reverse().limit(limit).toArray();
   ```

---

## 2. Mandatory Virtualization Standard

Any list expected to grow larger than 50 elements (e.g., invoice listings, inventory transaction histories) MUST implement list virtualization using `@tanstack/react-virtual`.

- **Benefit:** DOM bloat is completely eliminated. The browser renders only the specific cards visible in the scroll viewport, maintaining a constant 60FPS scroll performance regardless of list size.
- **Row Estimation Rule:** Provide accurate, device-specific size estimates in `useVirtualizer`:
  ```typescript
  const rowVirtualizer = useVirtualizer({
    count: invoices.length,
    getScrollElement: () => scrollRef.current,
    estimateSize: () => (isMobile ? 132 : 72), // Mobile card height vs Desktop table row
    overscan: 10,
  });
  ```
- Refer to [InvoiceListing.tsx](file:///home/ghanshyam/.gemini/antigravity/scratch/stock-management-app/src/features/invoices/components/InvoiceListing.tsx) for our standard virtualization reference.

---

## 3. Code-Splitting Heavy Dependencies

Heavy, secondary-feature dependencies must never bloat the initial application bundle or block the main thread.

### Dynamic PDF Generator Loading

The `@react-pdf/renderer` library is extremely heavy (~4.5MB uncompressed) and blocks the main UI thread during calculation.

- **Rule:** Never import `@react-pdf/renderer` statically. Use `next/dynamic` or `React.lazy` to code-split PDF loading.
- **UI Decoupling:** Trigger rendering only when a download action occurs, keeping initial bundle size minimal and page loading instantaneous.
- Refer to `downloadInvoicePdf.ts` for our standard asynchronous lazy-evaluation pattern.

---

## 4. Web Blob Memory Management

Because IndexedDB stores images as binary `Blob` files (Version 3 Schema onwards), the application relies on `URL.createObjectURL(blob)` to render them in standard HTML `<img />` tags via [SafeImage.tsx](file:///home/ghanshyam/.gemini/antigravity/scratch/stock-management-app/src/shared/components/SafeImage.tsx).

- **The Leak Risk:** Every created Object URL persists in browser memory until explicitly revoked, or until the entire browser tab is closed. Leaving these unmanaged triggers major memory leaks.
- **The Mandatory Cleanup Rule:** When using Object URLs in state, always hook unmounting cleanup functions or revoke old URLs immediately when a new one is selected:

  ```typescript
  // Standard Object URL Lifecycle Hook inside SafeImage.tsx
  useEffect(() => {
    if (!src || !(src instanceof Blob)) return;

    const url = URL.createObjectURL(src);
    setObjectUrl(url);

    return () => {
      URL.revokeObjectURL(url); // Automated clean up on unmount or src change
    };
  }, [src]);
  ```

- **Form State Upload Cleanups:** During image selection in form states (like `useAddStock`), if the user uploads multiple temporary images before hitting submit, you must call `URL.revokeObjectURL(previousUrl)` for each intermediate file replaced in state.
