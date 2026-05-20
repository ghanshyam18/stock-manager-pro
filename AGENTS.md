<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.

<!-- END:nextjs-agent-rules -->

# Engineering Standards — Agent Entry Point

This repository is a **standards-driven engineering system**. Before writing any code, you must understand and follow the rules below. Detailed references live in `docs/ai/`.

---

## Project Identity

- **Stack**: Next.js 16 (App Router, static export) · Mantine 9 · Dexie.js (IndexedDB) · Zustand · TypeScript
- **Architecture**: Offline-first, local-first. No backend. All data persists in IndexedDB via Dexie.js.
- **Target**: Mobile-first, touch-optimized, premium native-like UX.

> **CRITICAL**: Do NOT add `fetch` calls to a non-existent API. Use domain service files under `src/features/<domain>/services/` for all data operations.

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

## Architecture Rules

| Rule                      | Detail                                                                    |
| ------------------------- | ------------------------------------------------------------------------- |
| **Feature-Sliced Design** | `src/features/<domain>/` owns components, hooks, services for that domain |
| **Cross-import ban**      | Features must never import internal components/hooks from other features  |
| **Shared = truly global** | Only multi-domain primitives belong in `src/shared/`                      |
| **Client boundaries**     | Set `'use client'` at the highest page/layout node, not per-file          |
| **Static export**         | `output: 'export'` — no server-side features, no API routes               |

→ Deep reference: [docs/ai/architecture.md](docs/ai/architecture.md)

---

## React Engineering Standards

- **Pure components** where possible. Avoid unnecessary rerenders.
- **No `useEffect` for derived calculations.** Compute derived values directly during render.
- **No duplicated state.** If a value can be computed from existing state/props, derive it — do not store it in separate state.
- **Memoization only when beneficial.** Use `useMemo`/`useCallback` only when you can demonstrate a measurable performance gain (expensive computations, referential equality for memoized children).
- **Composition over monoliths.** Break large components into focused sub-components. Prefer children/render props over deeply nested conditionals.
- **Zustand selectors.** Never consume the entire store. Export and use atomic selector hooks.
- **Deferred inputs.** Decouple search/filter keystrokes from database queries using deferred value hooks.

→ Deep reference: [docs/ai/coding-standards.md](docs/ai/coding-standards.md)

---

## Mantine Standards

Mantine is the **UI operating system**. Use it exhaustively before creating anything custom.

- **Theme-driven**: All spacing, colors, typography, radii, shadows come from Mantine theme tokens.
- **Zero inline styles** for static styling. Dynamic calculations (e.g., virtualization offsets) are the only exception.
- **Use Mantine primitives**: `<Box>`, `<Stack>`, `<Group>`, `<Grid>`, `<Flex>`, `<Text>`, `<Title>`, `<Paper>`, `<Button>` — not raw HTML.
- **Layout via `gap`**: Use `<Stack gap="md">` and `<Group gap="sm">` instead of margin hacks.
- **Dark-mode ready**: Use `var(--mantine-color-body)`, `var(--mantine-color-text)` — never hardcoded hex.
- **Mobile-first**: Safe area insets on fixed footers. 44px minimum touch targets. Bottom-nav patterns.

→ Deep reference: [docs/ai/mantine-standards.md](docs/ai/mantine-standards.md)

---

## TypeScript Standards

- **Strict typing everywhere.** `any` is forbidden (`eslint: @typescript-eslint/no-explicit-any`).
- **Type-safe props.** Extend Mantine's `BoxProps` or equivalent for custom components.
- **Reusable types.** Domain types in `src/features/<domain>/` or `src/types/`.
- **No unsafe casting.** No `as any`, no `as unknown as T` without documented justification.

---

## Performance Standards

- **Mandatory virtualization** for lists exceeding 50 items (`@tanstack/react-virtual`).
- **No `.toArray()` for full tables.** Use B-Tree indexes, compound queries, `.limit()`.
- **Lazy-load heavy deps.** PDF generators, exporters via dynamic `import()`.
- **Blob URL lifecycle.** Always revoke Object URLs on unmount or replacement.

→ Deep reference: [docs/ai/performance.md](docs/ai/performance.md)

---

## Quality Gates

| Gate       | Command              | Required |
| ---------- | -------------------- | -------- |
| Format     | `npm run format`     | ✅       |
| Lint       | `npm run lint`       | ✅       |
| Type-check | `npm run type-check` | ✅       |
| Build      | `npm run build`      | ✅       |

→ Deep reference: [docs/ai/quality-gates.md](docs/ai/quality-gates.md)

---

## Key References

| Document                                               | Scope                                              |
| ------------------------------------------------------ | -------------------------------------------------- |
| [architecture.md](docs/ai/architecture.md)             | FSD, persistence, state flow, Next.js patterns     |
| [coding-standards.md](docs/ai/coding-standards.md)     | React, hooks, state, TypeScript                    |
| [mantine-standards.md](docs/ai/mantine-standards.md)   | UI framework, tokens, forms, overlays              |
| [component-patterns.md](docs/ai/component-patterns.md) | Composition, API design, micro-interactions        |
| [performance.md](docs/ai/performance.md)               | Virtualization, DB queries, memory, code-splitting |
| [anti-patterns.md](docs/ai/anti-patterns.md)           | Forbidden patterns with correct alternatives       |
| [quality-gates.md](docs/ai/quality-gates.md)           | Validation commands, playbooks, failure recovery   |
| [accessibility.md](docs/ai/accessibility.md)           | ARIA, focus, contrast, touch targets               |
