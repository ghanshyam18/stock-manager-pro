# GitHub Copilot Instructions — Stock Management App

This repository is a **standards-driven engineering system**. Follow every rule below strictly.

## Project Identity

- **Stack**: Next.js 16 (App Router, static export) · Mantine 9 · Dexie.js (IndexedDB) · Zustand · TypeScript
- **Architecture**: Offline-first, local-first. No backend. All data persists in IndexedDB via Dexie.js.
- **Target**: Mobile-first, touch-optimized, premium native-like UX.
- **CRITICAL**: Do NOT add `fetch` calls to a non-existent API. Use domain service files under `src/features/<domain>/services/`.

## Architecture

- **Feature-Sliced Design**: `src/features/<domain>/` owns components, hooks, services for each domain.
- Features must never import internal components/hooks from other features.
- Only truly global primitives belong in `src/shared/`.
- Set `'use client'` at the highest page/layout node.
- Static export only — no API routes, no server-side features.

## React Standards

- Pure components where possible. Avoid unnecessary rerenders.
- Never use `useEffect` for derived calculations — compute directly during render.
- Never duplicate state — derive from existing state/props.
- `useMemo`/`useCallback` only for measurable performance gains.
- Composition over monolithic components.
- Zustand: atomic selector hooks only, never consume the entire store.

## Mantine Standards

- Mantine is the UI operating system. Use Mantine components and tokens first.
- All styling through theme tokens — zero hardcoded hex values or inline styles.
- Use `<Stack>`, `<Group>`, `<Grid>`, `<Flex>` for layout — not margin hacks.
- Dark-mode ready: semantic CSS variables only.
- Mobile-first: 44px touch targets, safe area insets, bottom-nav patterns.

## TypeScript Standards

- `any` is forbidden. Strict typing everywhere.
- Extend Mantine types for custom component props.
- No unsafe casting without documented justification.

## Performance Standards

- Virtualization mandatory for lists > 50 items.
- No `.toArray()` on full database tables — use indexed queries.
- Lazy-load heavy dependencies via dynamic `import()`.
- Revoke Blob Object URLs on cleanup.

## Quality Gates

All must pass: `npm run format`, `npm run lint`, `npm run type-check`, `npm run build`.

## Deep References

Detailed standards with code examples in `docs/ai/`:

- `architecture.md`, `coding-standards.md`, `mantine-standards.md`
- `component-patterns.md`, `performance.md`, `anti-patterns.md`
- `quality-gates.md`, `accessibility.md`
