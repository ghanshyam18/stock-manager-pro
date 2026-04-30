<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.

<!-- END:nextjs-agent-rules -->

## 🏠 Project Architecture & Context

- **Offline-First & Local-First**: This app is designed to work without a backend. All data persists in **IndexedDB** via **Dexie.js**.
  - **CRITICAL**: Do NOT attempt to add `fetch` calls to a non-existent API. Use `src/features/inventory/services/inventoryService.ts` for data operations.
- **Mantine 9**: This project uses Mantine v9. Some API signatures (especially for `Modal` and `Notification`) have changed from v7/v8. Always verify with the latest Mantine documentation.
- **Mobile Experience**: The app targets mobile users. Prioritize touch-friendly targets and bottom-navigation patterns.
- **Virtualization**: Large data sets are expected. Always use virtualization for inventory listings to prevent DOM bloat.
