# Engineering Standards — Claude Code Entry Point

This repository is a **standards-driven engineering system**. Before writing any code, you must understand and follow the rules below. Detailed references live in `docs/ai/`.

---

## Project Identity

- **Stack**: Next.js 16 (App Router, static export) · Mantine 9 · Dexie.js (IndexedDB) · Zustand · TypeScript
- **Architecture**: Offline-first, local-first. No backend. All data persists in IndexedDB via Dexie.js.
- **Target**: Mobile-first, touch-optimized, premium native-like UX.

> **CRITICAL**: Do NOT add `fetch` calls to a non-existent API. Use domain service files under `src/features/<domain>/services/` for all data operations.

---

## Build & Development Commands

```bash
npm run dev          # Start dev server
npm run build        # Production build (static export)
npm run preview      # Serve built output locally
npm run lint         # ESLint validation
npm run lint:fix     # ESLint auto-fix
npm run format       # Prettier formatting
npm run type-check   # TypeScript compiler check
```

---

## Agent Workflow Protocol

Before ANY implementation:

1. Load these standards and scan `docs/ai/` for the relevant deep reference
2. Understand existing architecture and patterns in `src/`
3. Reuse before creating new — check `src/shared/` and feature modules first
4. Analyze the request against the rules below

After implementation, **always** run the quality gates:

```bash
npm run format && npm run lint && npm run type-check && npm run build
```

If anything fails — fix immediately and rerun. No task is complete until all gates pass.

---

## Project Structure

```
src/
├── app/                  # Next.js App Router pages, global providers, styles
├── features/             # Business modules (domain-cohesive)
│   ├── inventory/        # Core inventory management
│   │   ├── components/   # Feature-specific UI components
│   │   ├── hooks/        # Domain hooks and live queries
│   │   └── services/     # Dexie/IndexedDB data access
│   └── invoices/         # Billing and invoicing
│       ├── components/
│       ├── hooks/
│       ├── services/
│       └── utils/
├── shared/               # Truly global, multi-domain primitives
│   ├── components/       # SafeImage, BottomNavigation, etc.
│   ├── hooks/            # useNativeBack, usePreventExit, etc.
│   ├── store/            # Zustand global UI state
│   └── utils/            # Currency, date, image helpers
└── types/                # Global TypeScript definitions
```

---

## Architecture Rules

- **Feature-Sliced Design**: `src/features/<domain>/` owns all logic for its domain.
- **Cross-import ban**: Features must never import internal components/hooks from other features.
- **Shared = truly global**: Only multi-domain primitives belong in `src/shared/`.
- **Client boundaries**: Set `'use client'` at the highest page/layout node.
- **Static export**: `output: 'export'` — no server-side features, no API routes.

→ Deep reference: @docs/ai/architecture.md

---

## React Engineering Standards

- **Pure components** where possible. Avoid unnecessary rerenders.
- **No `useEffect` for derived calculations.** Compute derived values directly during render.
- **No duplicated state.** If a value can be computed from existing state/props, derive it.
- **Memoization only when beneficial.** Use `useMemo`/`useCallback` only for measurable performance gains.
- **Composition over monoliths.** Break large components into focused sub-components.
- **Zustand selectors.** Never consume the entire store. Use atomic selector hooks.
- **Deferred inputs.** Decouple search/filter keystrokes from database queries.

→ Deep reference: @docs/ai/coding-standards.md

---

## Mantine Standards

Mantine is the **UI operating system**. Use it exhaustively before creating anything custom.

- **Theme-driven**: All spacing, colors, typography, radii, shadows from Mantine theme tokens.
- **Zero inline styles** for static styling. Only dynamic calculations are excepted.
- **Use Mantine primitives**: `<Box>`, `<Stack>`, `<Group>`, `<Text>`, `<Title>`, `<Paper>`, `<Button>` — not raw HTML.
- **Layout via `gap`**: `<Stack gap="md">`, `<Group gap="sm">` — not margin hacks.
- **Dark-mode ready**: Use `var(--mantine-color-body)`, `var(--mantine-color-text)`.
- **Mobile-first**: Safe area insets. 44px minimum touch targets. Bottom-nav patterns.

→ Deep reference: @docs/ai/mantine-standards.md

---

## TypeScript Standards

- **Strict typing everywhere.** `any` is forbidden.
- **Type-safe props.** Extend Mantine's `BoxProps` or equivalent.
- **Reusable types.** Domain types in `src/features/<domain>/` or `src/types/`.
- **No unsafe casting.** No `as any`, no `as unknown as T` without documented justification.

---

## Performance Standards

- **Mandatory virtualization** for lists exceeding 50 items.
- **No `.toArray()` for full tables.** Use indexes, compound queries, `.limit()`.
- **Lazy-load heavy deps.** Dynamic `import()` for PDF generators, exporters.
- **Blob URL lifecycle.** Always revoke Object URLs on unmount or replacement.

→ Deep reference: @docs/ai/performance.md

---

## Quality Gates

All four gates must pass before any task is considered complete:

| Gate       | Command              |
| ---------- | -------------------- |
| Format     | `npm run format`     |
| Lint       | `npm run lint`       |
| Type-check | `npm run type-check` |
| Build      | `npm run build`      |

→ Deep reference: @docs/ai/quality-gates.md

---

## Key References

| Document                       | Scope                                              |
| ------------------------------ | -------------------------------------------------- |
| @docs/ai/architecture.md       | FSD, persistence, state flow, Next.js patterns     |
| @docs/ai/coding-standards.md   | React, hooks, state, TypeScript                    |
| @docs/ai/mantine-standards.md  | UI framework, tokens, forms, overlays              |
| @docs/ai/component-patterns.md | Composition, API design, micro-interactions        |
| @docs/ai/performance.md        | Virtualization, DB queries, memory, code-splitting |
| @docs/ai/anti-patterns.md      | Forbidden patterns with correct alternatives       |
| @docs/ai/quality-gates.md      | Validation commands, playbooks, failure recovery   |
| @docs/ai/accessibility.md      | ARIA, focus, contrast, touch targets               |
