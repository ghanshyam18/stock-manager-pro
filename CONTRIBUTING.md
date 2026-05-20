# Contributing to Stock Management App

Thank you for your interest in contributing to Stock Management App! We welcome contributions from everyone — including AI coding agents.

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v20 or higher recommended)
- [npm](https://www.npmjs.com/)

### Setup

1. Fork the repository.
2. Clone your fork: `git clone https://github.com/ghanshyam18/stock-manager-pro.git`
3. Install dependencies: `npm install`
4. Start the development server: `npm run dev`

## 🏗️ Core Architecture

Understanding the project structure is key to contributing effectively:

- **Feature-Sliced Design**: Domain logic lives in `src/features/<domain>/` with co-located components, hooks, and services.
- **Offline-First**: All data operations target local IndexedDB via Dexie.js. Never assume internet.
- **UI Framework**: Mantine 9 is the UI operating system. Use Mantine components, tokens, and hooks before creating anything custom.
- **State Management**: Zustand for transient UI state (with atomic selectors). Dexie reactive live queries for persistent data.
- **Virtualization**: Any list > 50 items MUST use `@tanstack/react-virtual`.

## 📐 Engineering Standards

This repository enforces strict engineering standards documented in `docs/ai/`:

| Document                                               | What it Covers                                           |
| ------------------------------------------------------ | -------------------------------------------------------- |
| [architecture.md](docs/ai/architecture.md)             | FSD structure, Next.js patterns, persistence, state flow |
| [coding-standards.md](docs/ai/coding-standards.md)     | React engineering, TypeScript, hooks discipline          |
| [mantine-standards.md](docs/ai/mantine-standards.md)   | UI tokens, layout, forms, overlays, theme integration    |
| [component-patterns.md](docs/ai/component-patterns.md) | Composition, API design, micro-interactions              |
| [performance.md](docs/ai/performance.md)               | Virtualization, DB queries, memory management            |
| [anti-patterns.md](docs/ai/anti-patterns.md)           | Forbidden patterns with correct alternatives             |
| [quality-gates.md](docs/ai/quality-gates.md)           | Validation commands and failure recovery                 |
| [accessibility.md](docs/ai/accessibility.md)           | ARIA, focus, contrast, touch targets                     |

**AI agents**: Your agent config file (`AGENTS.md`, `CLAUDE.md`, `CODEX.md`, `.cursorrules`, or `.github/copilot-instructions.md`) provides a summary. The `docs/ai/` directory contains the full standards.

## Coding Standards

### Linting & Formatting

We follow strict coding standards using ESLint and Prettier. Your code will be automatically checked on commit using `husky` and `lint-staged`.

- Run manual linting: `npm run lint`
- Run auto-fix: `npm run lint:fix`
- Run formatting: `npm run format`
- Run type-check: `npm run type-check`

### Commit Messages

We follow the [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/) specification:

- `feat`: A new feature
- `fix`: A bug fix
- `docs`: Documentation changes
- `chore`: Maintenance tasks (build, deps, etc.)
- `refactor`: Code changes that neither fix a bug nor add a feature
- `style`: Changes that do not affect the meaning of the code (formatting, etc.)
- `perf`: A code change that improves performance

## Pull Request Process

1. Create a new branch from `main`: `git checkout -b feat/your-feature-name`
2. Make your changes and ensure they pass all quality gates:
   ```bash
   npm run format && npm run lint && npm run type-check && npm run build
   ```
3. Commit your changes following the conventional format.
4. Push your branch: `git push origin feat/your-feature-name`
5. Open a Pull Request on GitHub and complete the engineering standards checklist.
6. Provide a detailed description, including screenshots for UI updates.
7. Ensure all CI checks pass.
8. Once approved, your PR will be merged!

## Questions?

Feel free to open an issue or reach out to the maintainers.
