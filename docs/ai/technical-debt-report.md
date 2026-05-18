# Technical Debt Report

This report presents a thorough audit of the project's structural, visual, logic, and performance technical debt. It identifies violations against standard design tokens, mobile-first guidelines, FSD isolation rules, and IndexedDB performance.

---

## 1. Structural Debt (Database & FSD)

### Fat Infrastructure Hook Aggregations

- **File Location:** [db.ts](file:///home/ghanshyam/.gemini/antigravity/scratch/stock-management-app/src/features/inventory/services/db.ts#L205-L360)
- **Violation:** Major transactional business calculations (calculating stock quantities, value aggregates, transferring design totals) are hardcoded inside low-level Dexie lifecycle hooks (`creating`, `updating`, `deleting`).
- **Risk Level:** **High**
- **Business Impact:** High cost of maintenance. Extremely difficult to write automated unit tests for business rules without spinning up active IndexedDB databases.
- **UX Impact:** Silent failure cases in hooks only output to `console.error`, meaning UI state can become permanently desynchronized from the actual data without notifying the user.
- **Performance Impact:** Multi-row batch operations (like imports) trigger an avalanche of individual Read-Modify-Write disk operations, freezing the user's browser.
- **Recommended Solution:** Deprecate DB lifecycle hooks. Move the aggregate calculation logic directly into the service layer [inventoryService.ts](file:///home/ghanshyam/.gemini/antigravity/scratch/stock-management-app/src/features/inventory/services/inventoryService.ts) wrapped inside a single atomic Dexie transaction `db.transaction('rw', ... )`.

---

## 2. UI & Design System Debt

### 1. Hardcoded Borders, Backgrounds & Radii

- **File Locations:**
  - [InventoryStats.tsx](file:///home/ghanshyam/.gemini/antigravity/scratch/stock-management-app/src/features/inventory/components/InventoryStats.tsx#L61-L68) (toggle static styles with raw hex variables)
  - [InventoryStats.tsx](file:///home/ghanshyam/.gemini/antigravity/scratch/stock-management-app/src/features/inventory/components/InventoryStats.tsx#L92-L95) (`radius="20px"` and `bg="white"`)
  - [ItemDetailModal.tsx](file:///home/ghanshyam/.gemini/antigravity/scratch/stock-management-app/src/features/inventory/components/ItemDetailModal.tsx#L389-L395) (`radius="20px"` card with hardcoded background)
  - [AddStockForm.tsx](file:///home/ghanshyam/.gemini/antigravity/scratch/stock-management-app/src/features/inventory/components/AddStockForm.tsx#L80-L84) (inline borders and backgrounds)
- **Violation:** Bypasses central theme tokens. Hardcodes absolute pixels and white colors.
- **Risk Level:** **Medium**
- **Business Impact:** High brand updating costs. Re-branding typography, margins, or shapes requires auditing every single component.
- **UX Impact:** **Breaks Dark Mode.** Hardcoded absolute white backgrounds will remain white when the system switches to dark mode, blinding users and ruining the premium app aesthetic.
- **Performance Impact:** None directly, but increases rendering DOM node styling bloat.
- **Recommended Solution:** Systematically migrate all hardcoded values to Mantine props (`radius="lg"`, `bg="var(--mantine-color-body)"`, `withBorder`, `p="sm"`).

### 2. Missing Mobile Safe Area Insets

- **File Location:** [QuickInvoiceForm.tsx](file:///home/ghanshyam/.gemini/antigravity/scratch/stock-management-app/src/features/invoices/components/QuickInvoiceForm.tsx#L238-L250) (Bottom Action Footer Panel)
- **Violation:** The sticky submit bar uses a hardcoded vertical padding `p="md"` (`16px`) and does not account for iOS home indicators.
- **Risk Level:** **High**
- **Business Impact:** Negative reputation. App feels cheap and buggy on modern iOS/Android screens.
- **UX Impact:** **Overlapping Interactive Zones.** The iOS home swipe indicator will sit directly on top of the "Save & Download PDF" CTA button, making it difficult or impossible for mobile users to trigger the action without triggering page-exit swipes.
- **Performance Impact:** None.
- **Recommended Solution:** Update the sticky footer layout wrapper to dynamically add iOS safe areas:
  ```css
  padding-bottom: calc(env(safe-area-inset-bottom, 0px) + 12px);
  ```

---

## 3. Logic & State Debt

### Autocomplete Data Table Leak

- **File Location:** [InvoiceItemsTable.tsx](file:///home/ghanshyam/.gemini/antigravity/scratch/stock-management-app/src/features/invoices/components/InvoiceItemsTable.tsx#L28-L34)
- **Violation:** The autocomplete list queries and maps the ENTIRE designs master table synchronously on component mount:
  ```typescript
  db.designs.toArray().then((designs) => { ... });
  ```
- **Risk Level:** **High**
- **Business Impact:** App becomes unusable as business scale increases.
- **UX Impact:** Delayed screen loading. Opening the "New Quick Invoice" screen will freeze for several seconds once a user has accumulated a substantial design catalog.
- **Performance Impact:** **Main Thread Blocking & Memory Bloat.** Pulling thousands of records and storing them inside local React component state blocks rendering frames entirely.
- **Recommended Solution:** Replace the universal mount fetch with a query-on-input debounced search suggestion system, matching the dynamic matching mechanism inside [AddStockForm.tsx](file:///home/ghanshyam/.gemini/antigravity/scratch/stock-management-app/src/features/inventory/components/AddStockForm.tsx).

---

## 4. Performance & Memory Leaks Debt

### 1. Dynamic Hover Style DOM Manipulation

- **File Location:** [InvoiceListing.tsx](file:///home/ghanshyam/.gemini/antigravity/scratch/stock-management-app/src/features/invoices/components/InvoiceListing.tsx#L212-L215)
- **Violation:** Row hovers dynamically alter element styles on the fly via React listeners (`onMouseEnter` and `onMouseLeave`), bypassing standard style bindings.
- **Risk Level:** **Medium**
- **Business Impact:** Laggy interaction feel during data reviews.
- **UX Impact:** Micro-stuttering and dropped frames during fast scrolls and hover swipes.
- **Performance Impact:** Bypasses virtual DOM diff calculations and forces expensive browser rendering recalculations.
- **Recommended Solution:** Migrate row hover styles to standard CSS modules `:hover` declarations or utilizing Mantine's class styling overrides.

### 2. Un-Revoked Object Blob URL Memory Leaks

- **File Location:** [InvoiceItemsTable.tsx](file:///home/ghanshyam/.gemini/antigravity/scratch/stock-management-app/src/features/invoices/components/InvoiceItemsTable.tsx#L36-L42)
- **Violation:** Object URLs are created dynamically to display product thumbnail previews on form rows, but they are NEVER revoked:
  ```typescript
  const url = design.image instanceof Blob ? URL.createObjectURL(design.image) : design.image;
  form.setFieldValue(`items.${index}.thumbnailUrl`, url);
  ```
- **Risk Level:** **High**
- **Business Impact:** High rate of mobile browser crashes over long-session invoice creation.
- **UX Impact:** Browser tab crashing, reloading, and unexpected application resets on Safari and Chrome.
- **Performance Impact:** **Critical Memory Bloat.** Every time a user changes the design or deletes a row, the previously created Blob Object URL remains allocated in browser memory until the tab is closed, leading to severe memory leaks.
- **Recommended Solution:** Decouple inline Object URL creation. Standardize on the `<SafeImage>` component (which automatically manages creation and cleanup of Blob object URLs via React `useEffect` cleanups).

---

## 5. Resolution & Verification Status

All technical debt identified in this audit has been completely resolved and verified:

1. **Structural & Database Hook Debt**: **Resolved**. Lifecycle hooks pruned from `db.ts`. Business transactions migrated to `inventoryService.ts` utilizing single transaction blocks, eliminating the risk of aggregate desynchronization.
2. **UI & Theme Styling Debt**: **Resolved**. Hardcoded pixel values, custom white/gray layouts, and absolute inline CSS removed. Replaced with responsive Mantine properties and theme variables. Safe area bottom navigation and quick invoice footers use CSS safe-area variables, making the mobile iOS/Android touch targets flawless.
3. **Logic & Memory Bloat (Autocomplete & Lazy Loading)**: **Resolved**. Replaced main-thread blocking mount query in `InvoiceItemsTable.tsx` with high-performance debounced lookup keys. Lazy loaded PDF renderer with dynamic importing to keep main bundle sizes extremely small.
4. **Memory Leaks & DOM Manipulation Debt**: **Resolved**. Hover handlers refactored to CSS hover selectors in `InvoiceListing.tsx`. Blob Object URL leaks eradicated by standardizing on `<SafeImage>` with native URL auto-revocation inside active lifecycles.
