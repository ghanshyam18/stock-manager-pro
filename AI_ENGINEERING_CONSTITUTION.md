# AI Engineering Constitution (v3.0)

This constitution governs all future AI-assisted development, refactoring, and code generation for this project. It is strictly derived from the existing offline-first Next.js architecture, utilizing Dexie.js and Mantine 9, addressing both its current strengths and identified scalability risks.

---

## 1. Architecture Principles (Offline & Feature-Sliced)

- **Offline-First & Local-First:** The app runs entirely in the client. All data operations MUST target the local IndexedDB via Dexie.js. Do not write backend API (`fetch`) calls unless explicitly requested for syncing.
- **Feature-Sliced Design (FSD):** Maintain domain-driven folder cohesion. All logic must reside within feature modules:
  - `src/features/<domain>/` (e.g., `inventory`, `invoices`)
  - Never place feature-specific UI or logic in `src/shared/`. Only truly global, multi-domain primitives belong in `src/shared/components/` (such as safe image viewers or global navigation bars).
- **Client-Side Dominance:** Because the app relies on browser-level storage (IndexedDB), nearly all UI components and hooks require the `'use client'` directive. Set client boundaries at the highest page/layout node to avoid redundant file-level declaration boilerplate.

---

## 2. Mobile-First Development Principles

- **Responsive Navigation:** Mobile usage is the primary context. Maintain fixed, bottom-anchored navigation and action bars.
- **Safe Area Insets:** Fixed bottom elements (such as bottom action bars, bottom navigation, and sticky submit panels) MUST respect hardware screen boundaries (e.g. iOS home indicators). Always utilize:
  ```css
  padding-bottom: calc(env(safe-area-inset-bottom, 0px) + {X}px);
  ```
- **Mobile Viewports:** Use dynamic viewport height (`100dvh`) for full-screen mobile overlays. Set native momentum scroll variables for mobile touch containers. Limit DOM rendering bloat through virtualization on listings exceeding standard viewports.

---

## 3. Spacing & Theming Single Source of Truth (SSOT)

- **Strict Zero-Inline-Styles:** You are FORBIDDEN from using inline `style={{ ... }}` objects for static styling. Dynamic style calculations (e.g., virtualization heights or dynamic translate vectors) are the ONLY exception.
- **No Hardcoded Values:** Every spacing, margin, padding, color, font-size, border-radius, shadow, and breakpoint must come exclusively from Mantine's theme tokens.
- **Theme-Prop Dominance:** Prioritize Mantine's built-in style props (`mt`, `px`, `bg`, `c`, `radius`, `lh`, `w`, `h`) over custom classes. Refer to brand colors via tokens (e.g., `c="brand.6"`, `bg="brand.0"`) rather than raw hex/rgb values.
- **Dark Mode Support:** Keep all component implementations dark-mode-ready by using semantic colors (e.g., `var(--mantine-color-body)`, `var(--mantine-color-text)`) instead of absolute values like `white` or `#ffffff`.

---

## 4. Spacing, Typography & Touch Targets

- **Touch Target Minimums:** All interactive elements, buttons, cards, and icons must maintain a minimum touch target size of **44x44px** on mobile to prevent usability issues.
- **Unified Spacing:** Use standard Mantine spacing scale tokens:
  - Mobile containers: `p="md"` (`16px`)
  - Sub-elements: `gap="xs"` (`8px`) or `gap="sm"` (`12px`)
  - Desktop gutters: `p="xl"` (`32px`)
- **Typography Hierarchy:** Standardize the headings hierarchy. Headings must use premium font variables and body text must use standard sans-serif variables. Never hardcode absolute pixel font sizes—use standard tokens (e.g., `size="xs"`, `size="sm"`, `size="md"`, `size="lg"`, `size="xl"`).

---

## 5. Performance and Data Rules

- **Mandatory Virtualization:** Any list that can exceed 50 items (e.g., inventory history, invoice lists) MUST use list virtualization to preserve 60FPS scroll rendering on budget devices.
- **No In-Memory Big Data Operations:** NEVER load an entire database table or filtered collection into a JS array using `.toArray()` or `.each()` for the purpose of grouping, mapping, or sorting. You MUST use IndexedDB compound indexes, cursor limits, and batched transactions.
- **Lazy Load Heavy Dependencies:** Massive libraries (such as PDF generators or heavy exporters) must be code-split using dynamic imports or lazy loading to prevent blocking the main thread during initial page load.
- **Memory Management:** When dealing with `Blob` objects for images, ensure Object URLs are systematically revoked when components unmount or when a new Blob replaces an old one in state to avoid critical memory leaks.

---

## 6. Component Development Standards

- **Semantic Components:** If an item is interactive, it MUST use appropriate semantic bindings or Polymorphic Mantine properties (e.g., `<Card component="button" onClick={...}>` or `<Paper component="button">`). Do not rely on click handlers on generic tags without keyboard support.
- **Zero Raw DOM Hover Handlers:** Do not use manual mouse-enter or mouse-leave event handlers to dynamically apply inline styles. Standardize interactive hovers using native CSS hover states or custom classes in global stylesheets.
- **Form Optimization:** Decouple complex monolithic forms. Extract inputs into memoized sub-components to prevent entire page renders on every simple keystroke.

---

## 7. State and Hook Patterns

- **Decoupled Business Logic:** Keep the infrastructure layer clean. Do not place complex domain rules (e.g., aggregate recalculations, balance updates) inside raw database hooks. Put this logic into explicit Service classes/functions and run within explicit transactions.
- **Zustand Selector Hygiene:** Never consume the entire Zustand store object in a component. You MUST export and use atomic selector hooks to prevent unnecessary re-renders (e.g., selecting only the active tab state element).
- **Deferred Inputs:** Decouple instant database query live lists from keystrokes using deferred value hooks for searches, ensuring UI input elements never lag.

---

## 8. Verification & PR Standards

- **Type Safety:** TypeScript `any` is strictly forbidden. All database schemas and entity mappings must be fully typed.
- **Progressive Enhancement:** When modifying any file, you MUST proactively refactor existing anti-patterns (such as inline styles or direct DOM hover operations) within that file as part of your work.
- **Lint & Format Validation:** All changes must compile without errors, pass strict ESLint audits, and match Prettier guidelines.
