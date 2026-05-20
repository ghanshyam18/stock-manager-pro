# Mantine v9 UI Standards & Design System

This document establishes the UI framework standards, design tokens, layout architecture, typography, surface elevations, form patterns, overlay systems, and theme integration rules.

---

## 1. Mantine-First Development Principles

Before creating any custom UI component, styling class, or wrapper element, you MUST verify if Mantine already provides a native solution.

> **Mantine is our entire UI Foundation:** Do not use plain HTML elements (`div`, `span`, `p`, `img`, `button`) for structural or stylized components. Always use their Mantine equivalents: `<Box>`, `<Text>`, `<Title>`, `<Image>`, `<Button>`.

### What Mantine Already Solves

Do NOT create custom implementations for:

- Spacing systems → Use Mantine spacing tokens (`xs`, `sm`, `md`, `lg`, `xl`)
- Typography systems → Use `<Text>`, `<Title>` with size/weight props
- Button systems → Use `<Button>` with variants, colors, sizes
- Modal/Drawer systems → Use `<Modal>`, `<Drawer>` with provider defaults
- Notification systems → Use `notifications.show()` from `@mantine/notifications`
- Form validation → Use `useForm` from `@mantine/form`

---

## 2. Design Tokens & Theme SSOT

### Brand Color Palette

The primary brand palette is a curated royal blue designed for high legibility and premium quality.

| Token     | Hex Value | Semantic Usage                                 |
| --------- | --------- | ---------------------------------------------- |
| `brand.0` | `#eef3ff` | App backgrounds, active selection backgrounds  |
| `brand.1` | `#dce4ff` | Subtle borders, light alert backgrounds        |
| `brand.2` | `#bac8ff` | Focus rings, card hover outlines               |
| `brand.3` | `#91a7ff` | Inactive icon colors, secondary boundaries     |
| `brand.4` | `#748ffc` | Disabled text, element accents                 |
| `brand.5` | `#5c7cfa` | Muted button backgrounds                       |
| `brand.6` | `#4c6ef5` | **Primary Color** (Active states, primary CTA) |
| `brand.7` | `#4263eb` | Hover state primary button                     |
| `brand.8` | `#3b5bdb` | Pressed state primary button                   |
| `brand.9` | `#364fc7` | Text headers, dark icons                       |

### Global Structural Colors

- **App Canvas:** `var(--mantine-color-body)` (`#f8f9fa` Light / `#1a1b1e` Dark)
- **Surfaces/Cards:** `var(--mantine-color-white)` Light / `#25262b` Dark
- **Text Primary:** `var(--mantine-color-text)` (`#212529` Light / `#c1c2c5` Dark)

---

## 3. Typography Hierarchy

The project uses two premium font sets:

1. **Headings:** Plus Jakarta Sans or Outfit (premium look).
2. **Body Text:** Inter.

### Typography Scale

Never use hardcoded CSS pixel font sizes. Use standard Mantine sizes:

```typescript
<Title order={1} size="h1" fw={900}>   // Main Page Title
<Title order={3} size="h3" fw={800}>   // Section Headers
<Text size="md" fw={700}>              // Card Primary Text
<Text size="sm" c="dimmed" fw={600}>   // Card Secondary Text
<Text size="xs" fw={800} tt="uppercase" lts="1px"> // Metadata Tag
```

**The "Metric Block" Pattern:** A metadata label (`size="xs" fw={800} c="dimmed" tt="uppercase" lts={1}`) placed above a heavy-weighted value (`size="xl" fw={900} c="blue.7"`).

---

## 4. Layout & Flex Grid Architecture

All structural grouping, grids, and alignments must use Mantine's theme-aware layout primitives.

### Vertical Stacking: `<Stack>`

```typescript
<Stack gap="md">
  <Text>First Item</Text>
  <Text>Second Item</Text>
</Stack>
```

### Horizontal Grouping: `<Group>`

Always specify `justify` and `align`. Use `wrap="nowrap"` for compact mobile layouts.

```typescript
<Group justify="space-between" align="center" wrap="nowrap">
  <Text fw={700}>Grand Total</Text>
  <Text size="lg" c="blue.7">₹5,000</Text>
</Group>
```

### Layout Grid: `<Grid>`

12-column layout. Use breakpoint props for responsive shifts.

```typescript
<Grid gutter="md">
  <Grid.Col span={{ base: 12, md: 6 }}>Left Content</Grid.Col>
  <Grid.Col span={{ base: 12, md: 6 }}>Right Content</Grid.Col>
</Grid>
```

### Flexbox Engine: `<Flex>`

For advanced flex layouts that cannot be solved with `<Group>` or `<Stack>`.

---

## 5. Surface Elevations & Radii

- **Border Radius:** Inputs/Buttons use `radius="md"` (`8px`). Cards/Papers/Modals use `radius="lg"` (`16px`).
- **Elevations:**
  - Standard cards: `shadow="xs"`
  - Floating actions: `shadow="md"`
  - Bottom drawers: `shadow="xl"`
- **Interactive cards** must use semantic button conversion:
  ```typescript
  <Card component="button" onClick={handleSelect} radius="lg" withBorder>
  ```

---

## 6. Spacing & Mobile Container Grid

| Device Breakpoint       | Gutter Spacing    | Outer Padding     | Tap Target Size |
| ----------------------- | ----------------- | ----------------- | --------------- |
| **Mobile (`<768px`)**   | `p="sm"` (`12px`) | `p="md"` (`16px`) | **Min 44px**    |
| **Tablet (`<1024px`)**  | `p="md"` (`16px`) | `p="lg"` (`24px`) | Min 44px        |
| **Desktop (`>1024px`)** | `p="lg"` (`24px`) | `p="xl"` (`32px`) | Min 40px        |

### Structural Spacing Standards

Gutters between logical sections must follow strict theme tokens:

- **`gap="xs"` (`8px`):** Tight pairings (labels above inputs).
- **`gap="md"` (`16px`):** Standard element spacing (form items, card contents).
- **`gap="xl"` (`32px`):** Primary section separation (below headers, between grids and listings).

---

## 7. Form Standards (`@mantine/form`)

All data entry forms must use Mantine's native form system.

- **Unified Validation:** `useForm` for state tracking and client validation.
- **Input Components:** `<TextInput>`, `<NumberInput>`, `<Textarea>`, `<Select>`, `<Combobox>`.
- **Instant Visual Feedback:** Set form errors dynamically:

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
      />
    </form>
  );
  ```

---

## 8. Overlay & Feedback Systems

### Notifications

Toasts for all CRUD confirmations. Never use native `alert()`:

```typescript
import { notifications } from '@mantine/notifications';

notifications.show({
  title: 'Transaction Saved',
  message: 'Stock item was successfully added.',
  color: 'green',
});
```

### Modals & Drawers

- Standard overlay settings (blur, opacity) configured globally in providers.
- Full-screen mobile overlays use bottom drawers. Centered modals for desktop.

### Loaders & Skeletons

- `<Skeleton>` layouts matching expected component size.
- `<Loader color="blue" size="sm" type="dots" />` for inline feedback.

---

## 9. Fixed Layouts & Safe Area Insets

### Bottom ActionBar Rules

1. **Opaque background:** Solid `var(--mantine-color-body)` with border boundary.
2. **Safe area inset:** Apply iOS bottom padding:
   ```css
   padding-bottom: calc(env(safe-area-inset-bottom, 0px) + 12px);
   ```
3. **z-index:** `100` for layout bars, `200+` for dropdown containers.

---

## 10. Theme Integration: Dark Mode

All implementations must use semantic colors for automatic dark mode support:

```diff
- <div style={{ backgroundColor: '#ffffff', borderRadius: '16px', padding: '16px' }}>
+ <Paper bg="var(--mantine-color-body)" radius="lg" p="md" withBorder>
```

- **Correct text:** `var(--mantine-color-text)`
- **Correct background:** `var(--mantine-color-body)`
- **Correct border:** `var(--mantine-color-default-border)`
- **Color scheme hook:** `useMantineColorScheme()` for complex logic.
