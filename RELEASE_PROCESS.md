# Release and Deployment Process

This document outlines the standard operating procedures for making changes and deploying the Stock Management App. Following these steps ensures high stability and reliable inventory management.

## 🟢 1. Local Development

Always create a new branch for your changes. Never work directly on `main`.

```bash
git checkout -b feat/your-feature-name
```

## 🔵 2. Commit Standards

We use **Conventional Commits**. This allows us to track changes clearly in the Git history and automate changelog generation.

- `feat:` A new feature for the user.
- `fix:` A bug fix.
- `docs:` Documentation only changes.
- `chore:` Changes that do not affect the source code (e.g., config changes).
- `perf:` Performance optimizations.

## 🟡 3. Pull Requests & Previews

1. Push your branch to GitHub.
2. Open a **Pull Request (PR)** on GitHub using the provided template.
3. **Manual Verification**: Since this is a local-first IndexedDB app, ensure you test the following:
   - Data persistence after page refresh.
   - Import/Export functionality.
   - Responsiveness on mobile viewports.

## 🔴 4. Merging to Production (Main)

Only merge the PR into `main` after:

1. The code builds successfully (`npm run build`).
2. Linting and type-checks pass (`npm run lint`, `npm run type-check`).
3. You have manually verified the changes.

## 🚀 5. Versioning & Changelog

When you are ready to "Release" a set of changes, use the automated release script. This will automatically update the version in `package.json`, generate a `CHANGELOG.md` entry, and create a git tag.

```bash
npm run release
```

Then push the changes and tags to GitHub:

```bash
git push --follow-tags origin main
```

---

_By following this process, we ensure that every user gets a stable, high-performance experience every time they manage their stock._
