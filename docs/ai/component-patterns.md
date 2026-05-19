# Component Architecture & Design Patterns

This document defines the guidelines and best practices for building reusable UI components, extending Mantine's styles, organizing layouts, and adding premium micro-interactions.

---

## 1. When to Abstract Components

To avoid boilerplate and maintain a unified design system, extract custom components according to these strict rules:

1. **The "Rule of Two":** If a specific visual layout composition, stylized configuration, or complex card layout is repeated in two or more files, it MUST be extracted into a dedicated, reusable component in the shared components directory or features directory.
2. **Never Re-invent Mantine:** If a feature or layout behavior can be solved using standard Mantine properties (e.g. padding, borders, shadows), do not write a custom wrapper or class.

---

## 2. Proper Component API Design

All custom-built components MUST seamlessly extend Mantine's core style props. This preserves developer speed and allows custom components to support spacing margin (`mt`, `mb`), padding (`px`), alignment, and background overrides directly.

### Recommended Prop Extension Pattern

When wrapping a Mantine component or primitive, use React's standard typing or Mantine's polymorphic types:

```typescript
import { Box, type BoxProps, Text } from '@mantine/core';

interface MetricCardProps extends BoxProps {
  label: string;
  value: string | number;
  color?: string;
}

export function MetricCard({ label, value, color = 'blue.7', ...others }: MetricCardProps) {
  return (
    <Box
      p="md"
      radius="lg"
      withBorder
      style={{ display: 'flex', flexDirection: 'column' }}
      {...others} // Passes all Mantine style props (e.g., mt="xl", w={200}) and HTML attributes
    >
      <Text size="xs" fw={800} c="dimmed" tt="uppercase" lts="0.5px">
        {label}
      </Text>
      <Text size="xl" fw={900} c={color} mt={4}>
        {value}
      </Text>
    </Box>
  );
}
```

---

## 3. Structural Layout Groupings

Never construct structural gaps by manually styling child margins inside parent components. Standardize structural grids using nested layout primitives:

```typescript
// Forbidden: Ad-hoc margin definitions on children
<div>
  <h2 style={{ marginBottom: 12 }}>Title</h2>
  <p style={{ marginBottom: 24 }}>Subtitle</p>
  <button style={{ marginTop: 8 }}>Action</button>
</div>

// Correct Standard: Stack-driven gutters
<Stack gap="xl">
  <Stack gap="xs">
    <Title order={2}>Title</Title>
    <Text c="dimmed">Subtitle</Text>
  </Stack>

  <Group justify="flex-end">
    <Button>Action</Button>
  </Group>
</Stack>
```

Gutters between logical sections must follow strict theme tokens:

- **`gap="xs"` (`8px`):** Tight, structural pairings (e.g., Labels directly above inputs).
- **`gap="md"` (`16px`):** Standard spacing between elements (e.g., elements in cards, form items).
- **`gap="xl"` (`32px`):** Margins between primary sections (e.g., space below headers, gap between statistics grid and listings).

---

## 4. Premium Micro-interactions & Animations

To provide a satisfying and premium feel that mimics a native mobile application, apply subtle interactive micro-animations.

### 1. Hover/Active Scale Transitions

Interactive buttons and buttons styled as cards should transition smoothly when hovered, focused, or clicked.

```css
/* Define standard animations in global stylesheets */
.interactive-scale-card {
  transition:
    transform 150ms ease,
    box-shadow 150ms ease,
    border-color 150ms ease;
}

.interactive-scale-card:hover {
  transform: translateY(-2px);
  box-shadow: var(--mantine-shadow-sm);
  border-color: var(--mantine-color-blue-4) !important;
}

.interactive-scale-card:active {
  transform: translateY(0) scale(0.98);
}
```

- When using Mantine elements, apply classes like standard hover cards or use the button active scales defined in the global provider settings:
  ```typescript
  // global provider Button defaults
  styles: {
    root: {
      transition: 'transform 100ms ease';
    }
  }
  ```

### 2. Standard State Transitions

- **Hover States:** Muted opacity transitions or subtle color drops (e.g. transition times `0.15s` or `0.2s` with `ease`).
- **Loading States:** CTA buttons must show native loading indicators (`loading` prop in `<Button>`) instead of custom overlay spinners. Use `loaderProps={{ type: 'dots' }}` for a modern look.
