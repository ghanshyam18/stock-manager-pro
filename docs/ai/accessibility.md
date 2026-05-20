# Accessibility (A11y) & Semantic Engineering Standards

This document outlines the accessibility standards and implementation patterns required to ensure the application is inclusive, screen-reader friendly, and highly usable for touch screen interfaces on modern mobile platforms.

---

## 1. Keyboard Navigation & Focus Ring Standards

All interactive elements must be accessible via keyboard and display high-visibility focus indicator rings when navigated to via sequential focus keys.

### 1.1 Custom Interactive Controls

- **Interactive Wrappers**: Never add `onClick` triggers directly to static block elements (`<div>`, `<span>`, `<Paper>`) without transforming the root component.
- **Conversion Standard**: Always utilize Mantine's built-in `component` polymorphic property to convert structural cards into true semantic buttons:
  ```tsx
  <Paper component="button" onClick={handleClick} aria-label="Select design item">
    {/* Card content */}
  </Paper>
  ```
- **Focus Rings**: Ensure that interactive components display standard focus rings. Do not override `:focus-visible` or outline styles with `outline: none` without providing a highly visible theme focus ring alternative.

---

## 2. ARIA Description & Labeling Protocol

Every interactive control that does not render clear, unique, read-aloud text must declare a explicit ARIA label.

### 2.1 ActionIcon Labeling

- **Strict Requirement**: Every `<ActionIcon>` representing an icon-only CTA (e.g. Delete, Download, Close) MUST possess an `aria-label` attribute:
  ```tsx
  <ActionIcon
    variant="subtle"
    color="red"
    aria-label="Delete transaction history record"
    onClick={onDelete}
  >
    <Trash size={16} />
  </ActionIcon>
  ```

### 2.2 Modal Architecture A11y

- **Modal Headers**: Modals must feature a clean, descriptive close control with `aria-label="Close modal"` or `aria-label="Close details"`.
- **Title Relationships**: Ensure the modal's primary title element is correctly related to its wrapper. If utilizing custom modals, implement `aria-labelledby` linking back to the title node.

---

## 3. Visual & Screen Contrast

### 3.1 Dark Mode Contrast Compliance

- **Dynamic Themes Only**: Avoid inline styling overrides using static color variables. Custom elements must read from standard CSS variables (e.g. `var(--mantine-color-text)` or standard colors from the Mantine color palette).
- **Contrast Ratios**: The visual text content must meet Web Content Accessibility Guidelines (WCAG) AAA contrast ratios (4.5:1 minimum for body text, 3:1 for large headlines) on both light and dark backgrounds.

### 3.2 Mobile Touch Size Constraints

- **Minimum Target Size**: Touch targets must be at least `44px` by `44px` in active surface area (or standard minimum of `48px` where layout spacing allows) to prevent accidental taps from users with motor impairments or large thumbs.
- **Interactive Spacing**: Group rows and action icons with distinct spacing padding parameters (`gap="md"`, `p="sm"`) to provide clear visual margins.
