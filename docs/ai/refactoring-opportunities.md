# Refactoring Opportunities

## 1. Styling Migration to Mantine System

- **Action:** Eradicate all `style={{}}` inline props and manual DOM manipulation (like `onMouseEnter` background color changes).
- **Solution:** Utilize Mantine's CSS Modules, `className`, or style props on standard components. Use standard CSS `:hover` states for interactive elements.
- **Benefit:** Cleaner DOM, better performance, easier theming (dark mode compatibility).

## 2. Decoupling Business Logic from Database

- **Action:** Move the inventory aggregation logic out of Dexie hooks (`db.ts`) and into a dedicated `InventoryService` or Repository pattern.
- **Solution:** Create explicit functions like `addInventoryTransaction()`, `updateInventoryTransaction()`, which handle writing to both the transaction log and updating the materialized `designs` table in a single Dexie `.transaction()`.
- **Benefit:** Highly testable logic, explicit error handling, and transactional safety.

## 3. Optimize Date Filtered Queries

- **Action:** Refactor `useInventory.ts` date filtering to avoid loading all records into memory.
- **Solution:**
  - Introduce new compound indexes in Dexie (e.g., `[designNo+date]`) to allow grouped cursor iterations.
  - Alternatively, limit the date filter to pre-aggregated time buckets (e.g., daily summaries) if real-time dynamic grouping proves too slow for IndexedDB.
- **Benefit:** Prevents UI thread blocking and memory crashes on large datasets.

## 4. Unify 'use client' Declarations

- **Action:** Audit the `src/features` directories. Since the app is offline-first, nearly all UI is client-rendered. Ensure that the boundary is properly set at the highest necessary level (e.g., `page.tsx` or `layout.tsx` providers) rather than redundantly putting `'use client'` in every single component file.
- **Benefit:** Cleaner code, better alignment with Next.js App Router mental models.
