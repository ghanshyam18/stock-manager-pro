# Contributing to Stock Management App

Thank you for your interest in contributing to Stock Management App! We welcome contributions from everyone.

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

- **State Management**: We use **Zustand** for transient UI state (filters, search queries) and **IndexedDB** (via **Dexie.js**) for all persistent data.
- **Offline-First**: All data operations should be performed against the local IndexedDB. Never assume an internet connection is available.
- **UI Components**: We use **Mantine 9**. Please stick to Mantine's components to ensure visual consistency and a premium feel.
- **Virtualization**: Any list that can grow beyond 50 items MUST use `@tanstack/react-virtual`.

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
- `style`: Changes that do not affect the meaning of the code (white-space, formatting, missing semi-colons, etc)
- `perf`: A code change that improves performance

## Pull Request Process

1. Create a new branch from `main`: `git checkout -b feat/your-feature-name`
2. Make your changes and ensure they pass linting and type-checking.
3. Commit your changes following the conventional format.
4. Push your branch: `git push origin feat/your-feature-name`
5. Open a Pull Request on GitHub.
6. Provide a detailed description of your changes, including screenshots for UI updates.
7. Ensure all CI checks pass.
8. Once approved, your PR will be merged!

## Questions?

Feel free to open an issue or reach out to the maintainers.
