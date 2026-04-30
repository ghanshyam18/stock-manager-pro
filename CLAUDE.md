# Stock Management App - Agent Guidelines

## 🚀 Build & Development

- **Start Dev Server**: `npm run dev`
- **Build (Static Export)**: `npm run build`
- **Preview Build**: `npm run preview`
- **Linting**: `npm run lint` or `npm run lint:fix`
- **Formatting**: `npm run format`
- **Type-Check**: `npm run type-check`

## 📁 Project Structure

- `src/app/`: Next.js App Router pages and global styles.
- `src/features/`: Feature-sliced logic.
  - `inventory/`: Core inventory management feature.
    - `components/`: Feature-specific UI components.
    - `hooks/`: Custom hooks for data fetching and logic.
    - `services/`: API/Database services (Dexie/IndexedDB).
- `src/shared/`: Reusable components, hooks, and utilities across features.
- `src/types/`: Global TypeScript definitions.
- `scratch/`: Temporary scripts and dummy data.

## 🛠️ Coding Standards & Patterns

- **Framework**: Next.js 16 (App Router).
- **UI**: Mantine 9. Use Mantine components and hooks where possible.
- **State**: Zustand for global UI state; Dexie/IndexedDB for persistent data.
- **Styling**: Vanilla CSS Modules or Mantine's `style` props. Avoid inline styles unless necessary.
- **Performance**: Use `@tanstack/react-virtual` for all long lists.
- **Images**: Use `browser-image-compression` before saving to IndexedDB.
- **Types**: Use strict TypeScript. Avoid `any`.
- **Imports**: Follow `simple-import-sort` (Built-in, Shared, Features, Components, Styles).

## 🛡️ Best Practices

- **Offline-First**: Always assume the user might be offline. Use `db.ts` for all data operations.
- **Mobile-First**: Test UI changes on small screen sizes. Use Mantine's responsive props.
- **Accessibility**: Ensure all interactive elements are keyboard-accessible and have proper labels.

---

@AGENTS.md
