# UI Layer & Design System Architecture

This document describes the design tokens, visual hierarchy, atomic design structure, and components system that define the application's premium mobile interface.

---

## 1. Unified Theme Tokens & SSOT

The visual style is built entirely on Mantine 9 design tokens. All spacing, typography, colors, shadows, and radii are governed by the Mantine theme defined in [Providers.tsx](file:///home/ghanshyam/.gemini/antigravity/scratch/stock-management-app/src/app/Providers.tsx).

### Brand Color Palette

The primary brand palette is a sleek, curated royal blue shade designed for high legibility, clean status representation, and modern aesthetic premium quality.

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

- **App Canvas:** `var(--background)` / `var(--mantine-color-body)` (`#f8f9fa` in Light, `#1a1b1e` in Dark)
- **Surfaces/Cards:** `var(--mantine-color-white)` in Light, `#25262b` in Dark
- **Text Primary:** `var(--foreground)` / `var(--mantine-color-text)` (`#212529` in Light, `#c1c2c5` in Dark)

---

## 2. Typography Pairings & Hierarchy

The project uses two premium font sets to separate reading comfort from bold structural UI indicators.

1. **Headings:** Plus Jakarta Sans (`var(--font-jakarta)`) or Outfit (premium look).
2. **Body Text:** Inter (`var(--font-inter)`).

### Typography Scale & Token Mapping

Never use hardcoded CSS pixel font sizes. Utilize standard Mantine sizes:

```typescript
// Standard typography combinations
<Title order={1} size="h1" fw={900}>   // Main Page Title (e.g. Invoices page)
<Title order={3} size="h3" fw={800}>   // Section Headers
<Text size="md" fw={700}>             // Card Primary Text (Party Name)
<Text size="sm" c="dimmed" fw={600}>  // Card Secondary Text (Date, Details)
<Text size="xs" fw={800} tt="uppercase" lts="1px"> // Metadata Tag (Invoice #)
```

- **The "Metric Block":** A recurring aesthetic pattern where a metadata label (`size="xs" fw={800} c="dimmed" tt="uppercase" lts={1}`) is placed above a massive, heavy-weighted value (`size="xl" fw={900} c="blue.7"`).

---

## 3. Surface Elevations & Radii

To maintain visual consistency and visual alignment across elements, card elevations, borders, and rounded corners are strictly defined:

- **Border Radius:** Default elements (such as Inputs, Buttons, and smaller panels) use `radius="md"` (`8px`). Larger structural elements (Cards, Papers, and Modals) use `radius="lg"` (`16px`).
- **Elevations (Shadows):**
  - Standard cards and list containers: `shadow="xs"` (`0 1px 3px rgba(0,0,0,0.05)`)
  - Floating actions, context menus: `shadow="md"`
  - Full bottom-drawers: `shadow="xl"`
- **Semantic Card Components:** Interactive cards must be converted to buttons to restore correct keyboard focus:
  ```typescript
  // Correct Mantine semantic pattern
  <Card component="button" onClick={...} radius="lg" withBorder>
  ```

---

## 4. Spacing & Mobile Container Grid

Grid spacing is mobile-first. Margins and gutters expand as the user transitions across display sizes:

| Device Breakpoint       | Gutter Spacing    | Outer Padding     | Tap Target Size |
| ----------------------- | ----------------- | ----------------- | --------------- |
| **Mobile (`<768px`)**   | `p="sm"` (`12px`) | `p="md"` (`16px`) | **Min 44px**    |
| **Tablet (`<1024px`)**  | `p="md"` (`16px`) | `p="lg"` (`24px`) | Min 44px        |
| **Desktop (`>1024px`)** | `p="lg"` (`24px`) | `p="xl"` (`32px`) | Min 40px        |

### Touch Targets Standard

All interactive elements (buttons, delete ActionIcons, list items) MUST have a touch target of at least **44x44px** on mobile screen profiles. Use Mantine's `size="lg"` for smaller action buttons, or apply spacing pads so touch zones do not overlap.

---

## 5. Fixed Layouts & Safe Area Insets

Mobile devices with screen cutouts (like iPhone notch models and home indicators) require special layout padding rules.

### Standardized Bottom ActionBar Primitive

When creating a sticky or fixed footer (like [BottomNavigation.tsx](file:///home/ghanshyam/.gemini/antigravity/scratch/stock-management-app/src/shared/components/BottomNavigation.tsx) or [QuickInvoiceForm.tsx](file:///home/ghanshyam/.gemini/antigravity/scratch/stock-management-app/src/features/invoices/components/QuickInvoiceForm.tsx) totals submit bar), the layout must use the following structural rules:

1. **Opaque Background:** Background must be solid (`var(--mantine-color-body)` or a solid hex value) with a border boundary, preventing background list text from overlapping visually during scroll.
2. **Safe Area Inset:** Apply iOS bottom safe area padding using:
   ```css
   padding-bottom: calc(env(safe-area-inset-bottom, 0px) + 12px);
   ```
3. **Correct z-index:** Set a robust `z-index` (typically `100` for layout bars, and `200+` for active dropdown containers).

---

## 6. Theme Integration: Migrating Inline Styles

Every custom `style={{ ... }}` block is a form of architectural debt. Migrate raw style attributes to Mantine tokens:

```diff
- <div style={{ backgroundColor: '#ffffff', borderRadius: '16px', padding: '16px', marginTop: '24px' }}>
+ <Paper bg="var(--mantine-color-body)" radius="lg" p="md" mt="xl" withBorder>
```

By using Mantine primitives (`Paper`, `Box`, `Stack`, `Group`) and their theme-aware style props, you ensure:

- Automated support for Light/Dark color scheme switches.
- Strict visual consistency with the design system.
- Clean and semantic HTML rendering.
