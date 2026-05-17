# Component Migration & Standardisation Plan

This document outlines the step-by-step component replacements, wrapper deprecations, and structural merges required to standardize the UI layer under Mantine 9 design tokens.

---

## 1. Custom Element Migrations to Mantine Primitives

We must systematically eliminate raw HTML elements and low-level styled wrappers that bypass Mantine's theme integration.

### 1. Replace Raw `<img>` in Invoices Table

- **Target File:** [InvoiceItemsTable.tsx:L71-L75](file:///home/ghanshyam/.gemini/antigravity/scratch/stock-management-app/src/features/invoices/components/InvoiceItemsTable.tsx#L71-L75)
- **Current Implementation:** Uses raw HTML `<img>` tag with custom styles.
- **Standards Violation:** Bypasses `<SafeImage>` abstraction, fails to manage Blob URL cleanups, and introduces image formatting code bloat.
- **Migration Plan:** Replace with `<SafeImage>` using a standard size wrapper.
  ```diff
  - <img
  -   src={item.thumbnailUrl}
  -   alt="Thumb"
  -   style={{ width: 40, height: 40, objectFit: 'contain' }}
  - />
  + <SafeImage
  +   src={item.thumbnailUrl}
  +   alt="Thumbnail"
  +   w={40}
  +   h={40}
  +   fit="contain"
  +   radius="sm"
  + />
  ```

### 2. Replace Raw Style Accordions

- **Target File:** [InventoryStats.tsx:L57-L84](file:///home/ghanshyam/.gemini/antigravity/scratch/stock-management-app/src/features/inventory/components/InventoryStats.tsx#L57-L84)
- **Current Implementation:** Manually wraps an `<UnstyledButton>` in detailed inline style configurations to mimic a rounded accordion panel header.
- **Standards Violation:** Massive CSS variable overrides that bypass dark-mode color schema changes.
- **Migration Plan:** Merge into a standardized interactive `<Paper>` component or leverage Mantine's native `<Accordion>` component directly.
  ```typescript
  <Paper
    component="button"
    onClick={toggleStats}
    w="100%"
    p="xs"
    radius="lg"
    withBorder
    style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      cursor: 'pointer',
      backgroundColor: 'var(--mantine-color-body)'
    }}
  >
  ```

---

## 2. Inline Style Purge & Theme Token Mapping

Migrate hardcoded pixel shapes and values to our central design system tokens.

### 1. Standardize Card Borders & Border-Radius

- **Target Files:**
  - [InventoryStats.tsx:L92](file:///home/ghanshyam/.gemini/antigravity/scratch/stock-management-app/src/features/inventory/components/InventoryStats.tsx#L92)
  - [ItemDetailModal.tsx:L389](file:///home/ghanshyam/.gemini/antigravity/scratch/stock-management-app/src/features/inventory/components/ItemDetailModal.tsx#L389)
- **Current Implementation:** Hardcoded `radius="20px"`.
- **Standards Violation:** Violates Section 4 of the Constitution (Unified Spacing & Shapes SSOT).
- **Migration Plan:** Replace with standard Mantine token `radius="lg"` (which maps to `16px`, providing a unified visual aesthetic).

### 2. Standardize Sticky Panels Backgrounds

- **Target File:** [QuickInvoiceForm.tsx:L238-L250](file:///home/ghanshyam/.gemini/antigravity/scratch/stock-management-app/src/features/invoices/components/QuickInvoiceForm.tsx#L238-L250) (Sticky submit bar)
- **Current Implementation:** Hardcoded background `bg="white"`, and absolute border `borderTop: '1px solid #e5e7eb'`.
- **Standards Violation:** Bypasses dark-mode scheme tokens.
- **Migration Plan:** Use Mantine theme tokens to allow color schemes to shift:
  ```typescript
  bg="var(--mantine-color-body)"
  style={{
    borderTop: '1px solid var(--mantine-color-gray-2)',
    paddingBottom: 'calc(env(safe-area-inset-bottom, 0px) + 12px)',
    zIndex: 100
  }}
  ```

### 3. Replace Hardcoded Metric Color Spans

- **Target File:** [QuickInvoiceForm.tsx:L282](file:///home/ghanshyam/.gemini/antigravity/scratch/stock-management-app/src/features/invoices/components/QuickInvoiceForm.tsx#L282)
- **Current Implementation:** `<span style={{ color: '#228be6' }}>`.
- **Standards Violation:** Hardcoded color hex.
- **Migration Plan:** Replace with `<Text span c="blue.6">` or standard brand token.

---

## 3. Abstracting Spacing Composites

Replace multiple nested margins with Mantine layout blocks.

- **Target File:** [ItemDetailModal.tsx:L171](file:///home/ghanshyam/.gemini/antigravity/scratch/stock-management-app/src/features/inventory/components/ItemDetailModal.tsx#L171)
- **Current Implementation:** `<Stack p="md" gap="md" mt="-32px" style={{ position: 'relative', zIndex: 10 }}>`.
- **Standards Violation:** Hardcoded overlapping margin (`mt="-32px"`).
- **Migration Plan:** Abstract this section. Place structural controls inside a standard `<Stack gap="md">` and utilize a semantic overlay wrapper to structure floating badges rather than direct margin shifts.

---

## 4. Summary of Component Refactoring batches

| Custom Component / Wrapper    | Target Action   | Replaced By                                            |
| ----------------------------- | --------------- | ------------------------------------------------------ |
| Raw `<img>` in Invoices Table | **DEPRECATE**   | `<SafeImage>`                                          |
| Inline styled Toggle Header   | **REFACTOR**    | `<Paper component="button">`                           |
| Sticky footer bar in Forms    | **STANDARDIZE** | `<Box>` with safe area and `var(--mantine-color-body)` |
| `radius="20px"` custom cards  | **MAP**         | Standard theme token `radius="lg"`                     |
| `bg="white"` on overlays      | **MAP**         | `bg="var(--mantine-color-body)"`                       |
