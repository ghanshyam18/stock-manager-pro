# Component Architecture & Design Patterns

This document defines guidelines for building reusable UI components, extending Mantine's styles, organizing layouts, optimizing rendering, and adding premium micro-interactions.

---

## 1. When to Abstract Components

Extract custom components according to these strict rules:

1. **The "Rule of Two":** If a specific visual layout, stylized configuration, or complex card layout is repeated in two or more files, it MUST be extracted into a dedicated, reusable component.
2. **Never Re-invent Mantine:** If a feature or layout behavior can be solved using standard Mantine properties, do not write a custom wrapper.
3. **Keep components focused:** Each component should have a single, clear responsibility. If a component file exceeds ~150 lines, consider splitting it.

---

## 2. Component API Design

All custom components MUST seamlessly extend Mantine's core style props. This preserves developer speed and allows custom components to support spacing, padding, alignment, and background overrides directly.

### Prop Extension Pattern

```typescript
import { Box, type BoxProps, Text } from '@mantine/core';

interface MetricCardProps extends BoxProps {
  label: string;
  value: string | number;
  color?: string;
}

export function MetricCard({ label, value, color = 'blue.7', ...others }: MetricCardProps) {
  return (
    <Box p="md" {...others}>
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

## 3. Composition Patterns

### 3.1 Children Composition

Prefer `children` props over deeply nested conditional rendering:

```typescript
// CORRECT: Composable card wrapper
interface SectionCardProps extends BoxProps {
  title: string;
  children: React.ReactNode;
}

export function SectionCard({ title, children, ...others }: SectionCardProps) {
  return (
    <Paper p="md" radius="lg" withBorder {...others}>
      <Text size="sm" fw={700} mb="sm">{title}</Text>
      {children}
    </Paper>
  );
}

// Usage: flexible composition
<SectionCard title="Statistics">
  <MetricCard label="Total" value={42} />
</SectionCard>
```

### 3.2 Render Optimization

When child components are expensive, use `React.memo` with stable props:

```typescript
// Memoized list item (prevents re-render when list scrolls)
const InventoryRow = React.memo(function InventoryRow({
  item,
  onSelect,
}: {
  item: DesignItem;
  onSelect: (id: string) => void;
}) {
  return (
    <Card component="button" onClick={() => onSelect(item.id)}>
      <Text fw={700}>{item.designNo}</Text>
      <Text size="sm" c="dimmed">{item.totalQuantity} pcs</Text>
    </Card>
  );
});
```

### 3.3 Form Sub-Component Extraction

Decouple complex monolithic forms by extracting inputs into memoized sub-components. This prevents entire page re-renders on every keystroke:

```typescript
// CORRECT: Extracted, memoized form section
const QuantityInput = React.memo(function QuantityInput({
  value,
  onChange,
}: {
  value: number;
  onChange: (val: number) => void;
}) {
  return <NumberInput label="Quantity" value={value} onChange={onChange} min={1} />;
});
```

---

## 4. Structural Layout Groupings

Never construct structural gaps by manually styling child margins. Use nested layout primitives:

```typescript
// FORBIDDEN: Ad-hoc margin definitions on children
<div>
  <h2 style={{ marginBottom: 12 }}>Title</h2>
  <p style={{ marginBottom: 24 }}>Subtitle</p>
  <button style={{ marginTop: 8 }}>Action</button>
</div>

// CORRECT: Stack-driven gutters
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

Gutter spacing standards:

- **`gap="xs"` (`8px`):** Tight structural pairings (labels above inputs).
- **`gap="md"` (`16px`):** Standard spacing (form items, card elements).
- **`gap="xl"` (`32px`):** Primary section separation.

---

## 5. Premium Micro-interactions & Animations

### 5.1 Hover/Active Scale Transitions

Interactive buttons and card-buttons should transition smoothly:

```css
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

### 5.2 Standard State Transitions

- **Hover:** Muted opacity transitions or subtle color drops (`0.15s` ease).
- **Loading States:** Use `<Button loading loaderProps={{ type: 'dots' }}>` — not custom spinners.
- **Button Press:** Global Button default styles include `transition: transform 100ms ease`.

---

## 6. Conditional Rendering Patterns

### Early Returns for Loading/Error

```typescript
function FeatureView({ data, isLoading, error }: Props) {
  if (isLoading) return <FeatureSkeleton />;
  if (error) return <ErrorDisplay error={error} />;
  return <FeatureContent data={data} />;
}
```

### Null Checks with Fallbacks

```typescript
// CORRECT: Guard clause with fallback
const displayName = item?.name ?? 'Unknown Design';

// FORBIDDEN: Inline ternary chains
{
  item ? (item.name ? item.name : 'Unknown') : '—';
}
```
