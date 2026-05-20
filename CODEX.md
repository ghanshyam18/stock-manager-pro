# Engineering Standards — OpenAI Codex Entry Point

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

After implementation, **always** run:

```bash
npm run format && npm run lint && npm run type-check && npm run build
```

If anything fails — fix immediately and rerun.

---

## Architecture Rules

- **Feature-Sliced Design**: `src/features/<domain>/` owns all logic for its domain.
- **Cross-import ban**: Features must never import internal components/hooks from other features.
- **Shared = truly global**: Only multi-domain primitives belong in `src/shared/`.
- **Client boundaries**: Set `'use client'` at the highest page/layout node.
- **Static export**: `output: 'export'` — no server-side features, no API routes.

See: `docs/ai/architecture.md`

---

## React Engineering Standards

- **Pure components** where possible. Avoid unnecessary rerenders.
- **No `useEffect` for derived calculations.** Compute derived values directly during render.
- **No duplicated state.** Derive from existing state/props instead.
- **Memoization only when beneficial.** `useMemo`/`useCallback` for measurable gains only.
- **Composition over monoliths.** Focused sub-components, not deeply nested conditionals.
- **Zustand selectors.** Never consume the entire store. Use atomic selector hooks.

See: `docs/ai/coding-standards.md`

---

## Mantine Standards

Mantine is the **UI operating system**. Use it exhaustively before creating anything custom.

- **Theme-driven**: All tokens from Mantine theme. Zero hardcoded hex values.
- **Zero inline styles** for static styling.
- **Use Mantine primitives**: `<Box>`, `<Stack>`, `<Group>`, `<Text>`, `<Title>`, `<Paper>` — not raw HTML.
- **Dark-mode ready**: Semantic CSS variables, not absolute colors.
- **Mobile-first**: Safe area insets. 44px minimum touch targets.

See: `docs/ai/mantine-standards.md`

---

## TypeScript Standards

- `any` is forbidden. Strict typing everywhere.
- Type-safe props extending Mantine types.
- No unsafe casting without documented justification.

---

## Performance Standards

- Virtualization mandatory for lists > 50 items.
- No `.toArray()` on full database tables.
- Lazy-load heavy dependencies via dynamic `import()`.
- Always revoke Blob Object URLs on cleanup.

See: `docs/ai/performance.md`

---

## Quality Gates (all must pass)

| Gate       | Command              |
| ---------- | -------------------- |
| Format     | `npm run format`     |
| Lint       | `npm run lint`       |
| Type-check | `npm run type-check` |
| Build      | `npm run build`      |

See: `docs/ai/quality-gates.md`

---

## Deep References

- `docs/ai/architecture.md` — FSD, persistence, state flow, Next.js patterns
- `docs/ai/coding-standards.md` — React, hooks, state, TypeScript
- `docs/ai/mantine-standards.md` — UI framework, tokens, forms, overlays
- `docs/ai/component-patterns.md` — Composition, API design, micro-interactions
- `docs/ai/performance.md` — Virtualization, DB queries, memory, code-splitting
- `docs/ai/anti-patterns.md` — Forbidden patterns with correct alternatives
- `docs/ai/quality-gates.md` — Validation commands, playbooks, failure recovery
- `docs/ai/accessibility.md` — ARIA, focus, contrast, touch targets
