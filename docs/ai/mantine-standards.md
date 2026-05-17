# Mantine v9 UI Standards

This document establishes the official coding standards, layout structures, overlay patterns, and accessibility guidelines for all **Mantine v9** component integrations in this repository.

---

## 1. Mantine-First Development Principles

Before creating any custom UI component, styling class, or wrapper element, you MUST verify if Mantine already provides a native solution.

> **Mantine is our entire UI Foundation:** Do not use plain HTML elements (`div`, `span`, `p`, `img`, `button`) for structural or stylized components. Always use their Mantine equivalents: `<Box>`, `<Text>`, `<Title>`, `<Image>`, `<Button>`.

---

## 2. Layout & Flex Grid Architecture

To preserve a consistent responsive design, all structural grouping, grids, and alignments must use Mantine's theme-aware layout primitives:

### 1. Vertical Stacking: `<Stack>`

For vertical lists or sections. Use the `gap` property instead of margin overrides.

```typescript
// Correct
<Stack gap="md">
  <Text>First Item</Text>
  <Text>Second Item</Text>
</Stack>
```

### 2. Horizontal Grouping: `<Group>`

For button bars, inline items, and label pairings. Always specify `justify` and `align`. Use `wrap="nowrap"` for compact mobile card layouts.

```typescript
// Correct
<Group justify="space-between" align="center" wrap="nowrap">
  <Text fw={700}>Grand Total</Text>
  <Text size="lg" c="blue.7">₹5,000</Text>
</Group>
```

### 3. Layout Grid: `<Grid>`

For multi-column layouts. Grid uses a 12-column layout by default. Specify the `span` prop on columns, utilizing breakpoint props for responsive shifts.

```typescript
// Correct responsive grid
<Grid gutter="md">
  <Grid.Col span={{ base: 12, md: 6 }}>Left Content</Grid.Col>
  <Grid.Col span={{ base: 12, md: 6 }}>Right Content</Grid.Col>
</Grid>
```

### 4. Flexbox Engine: `<Flex>`

For advanced or dynamic flex layouts that cannot be solved easily using `<Group>` or `<Stack>` (e.g. variable orders, flex-grow/shrink distributions).

---

## 3. Form Standards (`@mantine/form`)

All data entry forms (e.g., [AddStockForm.tsx](file:///home/ghanshyam/.gemini/antigravity/scratch/stock-management-app/src/features/inventory/components/AddStockForm.tsx), [QuickInvoiceForm.tsx](file:///home/ghanshyam/.gemini/antigravity/scratch/stock-management-app/src/features/invoices/components/QuickInvoiceForm.tsx)) must be built using Mantine's native form system.

- **Unified Validation Hooks:** Utilize `useForm` for state tracking and client validation.
- **Form Formats:**
  - **Inputs:** `<TextInput>`, `<NumberInput>`, `<Textarea>`
  - **Selects:** `<Select>`, `<Combobox>` (For dynamic, live-search searchable lists)
  - **Date Controls:** Standard text inputs with `type="date"` styled as Mantine inputs (using standard classes or Mantine components).
- **Validation Feedbacks:** Set form errors dynamically. Provide instant visual validation on inputs:

  ```typescript
  const form = useForm({
    initialValues: { designNo: '', quantity: 1 },
    validate: {
      designNo: (value) => (value.trim().length === 0 ? 'Design number is required' : null),
      quantity: (value) => (value < 1 ? 'Quantity must be at least 1' : null),
    },
  });

  return (
    <form onSubmit={form.onSubmit(handleSubmit)}>
      <TextInput
        label="Design No"
        placeholder="Enter design code"
        {...form.getInputProps('designNo')}
        error={form.errors.designNo} // Displays native Mantine error typography
      />
    </form>
  );
  ```

---

## 4. Overlay & Feedback Systems

All modal dialogs, loading states, and notification toasts must leverage standard Mantine overlay patterns.

### 1. Notifications

Toasts are used for all CRUD confirmation feedbacks. Never use native browser `alert()` or custom popup toast libraries.

```typescript
import { notifications } from '@mantine/notifications';

// Success Toast
notifications.show({
  title: 'Transaction Saved',
  message: 'Stock item was successfully added to inventory.',
  color: 'green',
});

// Error Toast
notifications.show({
  title: 'Save Failed',
  message: 'An error occurred while updating the transaction database.',
  color: 'red',
});
```

### 2. Modals & Drawers

Modal overlays are configured globally to maintain visual cohesion:

- **Standard Overlay Settings:** Blur `3` and opacity `0.55` defined in [Providers.tsx](file:///home/ghanshyam/.gemini/antigravity/scratch/stock-management-app/src/app/Providers.tsx#L53-L56).
- **Desktop/Mobile Adaptability:** Full-screen overlays on mobile screens should utilize bottom `<Drawer>` drawers rather than center `<Modal>` modals. Center modals are reserved for tablet/desktop profiles.

### 3. Loaders & Skeletons

During async database retrievals, prevent layout shift using:

- **Skeletons:** Match the approximate size of the expected component using `<Skeleton>` (e.g. [InventorySkeleton.tsx](file:///home/ghanshyam/.gemini/antigravity/scratch/stock-management-app/src/features/inventory/components/InventorySkeleton.tsx)).
- **Loaders:** Use `<Loader color="blue" size="sm" type="dots" />` for inline status feedback.

---

## 5. Accessibility (a11y) Standards

As a core guideline, all interactive elements must remain completely accessible to screen readers and keyboard-only users.

- **Interactive Component Conversions:** When creating custom button cards, always pass `component="button"` to allow the browser to include the element in the focus ring chain and let users activate it via `Space` / `Enter`:
  ```typescript
  <Card component="button" onClick={handleSelect} radius="lg" withBorder>
  ```
- **Action Icons:** Every `<ActionIcon>` button that contains no raw text must receive a descriptive `aria-label`:
  ```typescript
  <ActionIcon aria-label="Delete stock record" color="red">
    <TrashIcon size={16} />
  </ActionIcon>
  ```
- **Focus Rings:** Never hide or strip focus rings from interactive elements. Maintain Mantine's built-in focus styling or use custom high-visibility borders for `:focus-visible` pseudo-states.

---

## 6. Theme Integration & Dynamic Dark Mode

All components must remain compatible with theme state switches.

- **Reference Theme CSS Variables:** Use Mantine's automated variables instead of hardcoding light/dark colors.
  - Correct text color: `color: 'var(--mantine-color-text)'`
  - Correct background: `backgroundColor: 'var(--mantine-color-body)'`
  - Muted borders: `borderColor: 'var(--mantine-color-gray-2)'` (which translates to dark gray in dark mode).
- **Mantine Hooks:** Use hooks like `useMantineColorScheme()` to read active scheme states when executing complex logic.
