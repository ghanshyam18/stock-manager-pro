# Coding Standards & Best Practices

This document outlines the absolute engineering standards, code conventions, styling rules, and architectural guidelines enforced across the project. Adherence to these standards is critical to preserving high performance, mobile touch accessibility, dark mode compliance, and stable local database transactions.

---

## 1. React & Performance Standards

### 1.1 Local-First Architecture

- **Offline-First**: All data operations must go through the IndexedDB client layer. Do not write HTTP fetch queries to backend endpoints; use the domain-specific service files.
- **Atomic Rendering**: Always place `'use client'` at the top of feature views.

### 1.2 Virtualization for Large Datasets

- **List Virtualization**: Any scrolling list containing master catalog records, transaction history, or billing history listings MUST be virtualized. This prevents browser DOM bloat, layout thrashing, and maintains stable 60FPS scrolls.
- **Scroll Container Box**: Avoid raw HTML scrollable containers. Use Mantine `<Box>` wrapper elements to handle virtual sizing cleanly.

### 1.3 Keystroke & Computation Decoupling

- **De-prioritize Input Lag**: Input lookups and auto-completes must decouple user typing from async database matching. Use deferred value hooks to defer the autocomplete lists query state, eliminating lag on low-end mobile devices during rapid typing.

---

## 2. Styling & Design System Rules (Mantine 9)

### 2.1 Theme-Driven Principle (Strict Zero Hardcoding)

- **Zero Hex Colors**: Never use custom color variables or raw Hex codes (e.g. `#fff`, `#f8f9fa`) inside component inline styles. Use Mantine theme colors (e.g. `c="blue"`, `c="teal"`) or theme CSS variables (`var(--mantine-color-body)`, `var(--mantine-color-text)`, `var(--mantine-color-default-border)`).
- **Dark Mode Support**: All paper surfaces must handle background transitions dynamically. Avoid hardcoded backgrounds; use theme body variables instead.
- **No Inline Styles for Text/Layout Attributes**: Do not use dynamic styled properties inside standard inline style blocks for text decorations. Utilize Mantine's built-in text decoration props directly (e.g. `<Title tt="uppercase" lts={1}>`).

### 2.2 Mobile-First Viewport Safety

- **Safe Area Insets**: Sticky footers and floating action drawers must respect device hardware contours (e.g. iOS home indicators). Calculate bottom padding dynamically:
  ```css
  padding-bottom: calc(env(safe-area-inset-bottom, 0px) + 12px);
  ```
- **Viewport Layout**: Prefer touch-friendly bottom-bar nav patterns over sidebar widgets.

---

## 3. Accessibility (A11y) & Semantic Correctness

### 3.1 Standard Semantic Elements

- **Interactive Wrappers**: Never add `onClick` events to flat structural tags (`<div>`, `<Paper>`) without a semantic definition. Use polymorphic attributes so browsers treat them as true interactive components (e.g. buttons).
- **Title Nesting**: Ensure proper document outline flow. Use single `<h1>` headers per root layout, followed by sequential sub-levels.

### 3.2 Focus & ARIA Descriptions

- **Action Icons A11y**: Every `<ActionIcon>` representing an action (e.g. delete, download, close modal) MUST declare a explicit, descriptive `aria-label`.
- **Keyboard Navigation**: Interactive button sheets must remain focusable, utilizing Mantine's built-in key listeners for touch-free access.

---

## 4. State Management (Zustand)

### 4.1 Atomic State Selection

- **Anti-Re-render Bloat**: Never select whole state blocks from the global store. Export individual atomic selector hooks to isolate state updates:
  ```typescript
  export const useActiveTab = () => useUIStore((state) => state.activeTab);
  ```
- **Live Queries**: Always fetch database results with reactive live query hooks to let changes in local storage propagate to views automatically.

---

## 5. Memory Management & Asset Safety

### 5.1 Blob URL Lifetime Control

- **Safe Image Standard**: Do not use raw image tags for displaying Blob assets. Standardize on the safe image viewer component.
- **Auto-Revocation**: When creating Blob Object URLs for user previews, the URL must be systematically revoked using cleanup effects when the component unmounts or when the target image changes, avoiding mobile browser tab crashes.

### 5.2 Dynamic Module Lazy Loading

- **Avoid Main Bundle Bloat**: Large runtime utilities (such as PDF generators or spreadsheet exporters) must be dynamically imported at runtime to keep startup bundles extremely lightweight.
