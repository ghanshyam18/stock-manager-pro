# Performance Bottlenecks & Fixes

This report outlines critical rendering bottlenecks, memory leaks, and disk I/O performance limits within the current codebase, providing technical root causes and exact optimizations.

---

## Bottleneck 1: Autocomplete Table Memory Bloat

- **File Location:** [InvoiceItemsTable.tsx:L31-L33](file:///home/ghanshyam/.gemini/antigravity/scratch/stock-management-app/src/features/invoices/components/InvoiceItemsTable.tsx#L31-L33)
- **Impact:** **High** (Blocks UI rendering thread during load of invoice form)
- **Root Cause:**
  The table row Autocomplete fields call `db.designs.toArray()` upon mounting:

  ```typescript
  useEffect(() => {
    db.designs.toArray().then((designs) => {
      setDesignNos(designs.map((d) => d.designNo));
    });
  }, []);
  ```

  This loads every single unique design record in the catalog directly into the JS heap synchronously, mapping its values. If a merchant has 5,000 active designs, this blocks the browser thread, causing the screen transition to freeze for several seconds on mid-range Android or iOS Safari.

- **Recommended Optimization:**
  1. Deprecate the universal mount-fetch.
  2. Implement a dynamic, lazy-load suggestion query. Fetch matching options only when the user starts typing, utilizing standard B-Tree indexing and limiting results to the top 10 items:
     ```typescript
     const handleSearch = async (val: string) => {
       const lower = val.trim().toLowerCase();
       const matches = await db.designs
         .where('designNo')
         .startsWithIgnoreCase(lower)
         .limit(10)
         .toArray();
       setSuggestions(matches.map((m) => m.designNo));
     };
     ```

---

## Bottleneck 2: Blob Object URL Memory Leaks

- **File Location:** [InvoiceItemsTable.tsx:L36-L42](file:///home/ghanshyam/.gemini/antigravity/scratch/stock-management-app/src/features/invoices/components/InvoiceItemsTable.tsx#L36-L42)
- **Impact:** **Critical** (Triggers mobile browser tab crashes over long sessions)
- **Root Cause:**
  When a design is selected in the invoice items row, an Object URL is created dynamically:

  ```typescript
  const url = design.image instanceof Blob ? URL.createObjectURL(design.image) : design.image;
  form.setFieldValue(`items.${index}.thumbnailUrl`, url);
  ```

  However, there is no code that triggers `URL.revokeObjectURL(url)` when that row is modified, deleted, or when the form is reset. The created URL remains permanently allocated in browser memory, gradually causing the tab to crash due to RAM exhaustion on mobile devices.

- **Recommended Optimization:**
  1. Remove manual `URL.createObjectURL` logic inside the table row option handler.
  2. Standardize on the `<SafeImage>` component for rendering the thumbnail preview. `<SafeImage>` has a built-in React `useEffect` callback that automatically creates the Object URL on render, and revokes it on unmount or row deletion, guaranteeing safe memory cleanup.
     ```typescript
     <SafeImage src={item.image} w={40} h={40} radius="sm" />
     ```

---

## Bottleneck 3: O(N) In-Memory Query Aggregations

- **File Location:** [useInventory.ts:L132-L161](file:///home/ghanshyam/.gemini/antigravity/scratch/stock-management-app/src/features/inventory/hooks/useInventory.ts#L132-L161)
- **Impact:** **High** (UI lag when date filters are active)
- **Root Cause:**
  When a date filter is applied, the custom hook reads all matching transactions, groups them inside a JavaScript `Map` called `groups`, sorts the resulting array, and paginates. This O(N log N) JS calculation scales terribly as the offline history grows, locking up inputs and typing responsiveness.

- **Recommended Optimization:**
  1. Leverage our pre-computed materialized view: use the `designs` master table directly whenever possible, since aggregates are already materializing on write.
  2. If real-time date grouping is required, configure IndexedDB compound indexes (like `[designNo+date]`) in the database versioning, and use cursor-based limits to retrieve only the paginated slice needed, preventing main-thread freezes.

---

## Bottleneck 4: Monolithic Form Rendering Gaps

- **File Locations:**
  - [AddStockForm.tsx](file:///home/ghanshyam/.gemini/antigravity/scratch/stock-management-app/src/features/inventory/components/AddStockForm.tsx)
  - [QuickInvoiceForm.tsx](file:///home/ghanshyam/.gemini/antigravity/scratch/stock-management-app/src/features/invoices/components/QuickInvoiceForm.tsx)
- **Impact:** **Medium** (Sluggish typing response in inputs)
- **Root Cause:**
  The standard form hook `@mantine/form` is declared at the parent component root. Typing in a simple input field (like the quantity or price fields) updates form values in state, which triggers a full re-render of the entire component tree—including heavy image previews, dropdown search menus, and dynamic layout calculations.

- **Recommended Optimization:**
  1. Segment heavy form sub-components.
  2. Move image preview and catalog selections into memoized child elements using React `memo()`.
  3. Ensure they only re-render when their specific, isolated value props change (rather than any form value alteration).
