# Coding Standards & Best Practices

Based on the existing codebase, the following standards and patterns are enforced:

## React & Performance

- **Client-Side Rendering:** As an offline-first app, most components must declare `'use client'` at the top.
- **Virtualization:** All lists expected to grow over 100 items (e.g., inventory history, invoices) MUST use `@tanstack/react-virtual` to prevent DOM bloat and maintain 60FPS scrolling.
- **Search Optimization:** Input searches MUST use `useDeferredValue` to detach typing responsiveness from heavy list re-renders and Dexie queries.

## State Management

- **Zustand Selectors:** When using Zustand, do not consume the entire state object. Export individual selector hooks to prevent unnecessary re-renders (e.g., `export const useActiveTab = () => useUIStoreBase((state) => state.activeTab);`).
- **Reactive Database:** Use `useLiveQuery` for all data fetching to ensure the UI stays synchronized automatically with IndexedDB changes.

## Database & Schema (Dexie)

- **Migrations:** All schema changes must be added as a new `.version()` in `db.ts`. Never modify past versions.
- **Data Types:** Binary data (like images) should be stored as `Blob` objects rather than Base64 strings to optimize IndexedDB storage and access speeds (as established in Schema Version 3).

## TypeScript

- Interfaces should be exported alongside the database initialization or service functions.
- Avoid using `any`; utilize proper mapping for Dexie collections.
