# AI Engineering Quality Gates

This document establishes the mandatory quality gate validation system. No AI implementation, bug fix, or refactoring task can be considered complete until all validation pipelines pass successfully.

---

## 1. Audited Project Quality Commands

Based on our thorough audit of the project configuration manifest (`package.json`), workspace settings, pre-commit hooks, and configurations, the exact commands for all target quality gates are:

### format

- **Exact Command:** `npm run format`
- **Audited Execution:** Runs code formatter to format all TS, TSX, CSS, JSON, and MD files across the workspace.

### lint

- **Exact Command:** `npm run lint`
- **Audited Execution:** Runs linter checks to validate code quality, React standards, hooks usage, and accessibility constraints (`jsx-a11y`).
- _Auto-Fix Command:_ `npm run lint:fix` (runs linter formatting adjustments for minor issues).

### typecheck

- **Exact Command:** `npm run type-check`
- **Audited Execution:** Runs the TypeScript compiler check (`tsc --noEmit`) to verify type safety and compilation soundness without outputting build files.

### build

- **Exact Command:** `npm run build`
- **Audited Execution:** Runs Next.js compiler build to compile the application, package all styles, optimize static content, and verify bundler success.

---

## 2. Playbooks by Change Type

Depending on the area of code changed, you must run specific validation plays:

### UI Changes

_Applies to changes in layouts, UI components, responsiveness, themes, or modals._

1. **`npm run format`**: Re-align all JSX indentation and standard tokens.
2. **`npm run lint`**: Catch accessibility failures or missing interactive keyboard event bindings.
3. **`npm run build`**: **CRITICAL FOR UI.** Many CSS post-processors, PostCSS Mantine variables, and component nesting bugs only trigger errors during production builds.
4. **Manual Verification**: Launch the development server preview to inspect visual shifts and verify theme consistency.

### Business Logic Changes

_Applies to changes in database schemas, transactions, local services, or custom hooks._

1. **`npm run type-check`**: **CRITICAL FOR LOGIC.** Guarantees that database table entities, service parameters, and state managers match signatures exactly.
2. **`npm run lint`**: Inspect code for any implicit standard violations, such as raw implicit typing or unhandled promise warnings.
3. **`npm run build`**: Ensure that static optimization passes compile database-dependent hooks and page queries cleanly.

### Shared Component Changes

_Applies to changes in global primitives (e.g., dynamic image viewers, global navigation panels, theme providers)._

1. **`npm run type-check`**: Check all calling instances across different features to verify that props match and there are no regressions.
2. **`npm run lint`**: Verify accessibility and linter conformity.
3. **`npm run build`**: Ensure compiler builds the entire dependency graph successfully.

---

## 3. git Pre-Commit Hooks

The repository automatically executes the following scripts inside Git pre-commit hooks before committing any changes:

1. Type-checks the TypeScript code.
2. Formats and performs linter auto-fixes on staged files.

Commit messages are validated using commitlint rules inside commit-message validation hooks.

---

## 4. Failure Recovery Workflow

If any validation step fails, the agent is **prohibited** from marking the task as complete. The agent must immediately trigger the following diagnostic recovery loop:

```mermaid
graph TD
    A[Run Validation Gates] --> B{Do all gates pass?}
    B -- Yes --> C[Mark Task Complete]
    B -- No --> D[Initiate Diagnostic Loop]
    D --> E[1. Analyze Stack Trace & Lint Output]
    E --> F[2. Locate Root Cause Component]
    F --> G[3. Implement Safe Targeted Corrections]
    G --> H[4. Re-run All Quality Gates]
    H --> B
```

### Protocol for Corrective Action

1. **Analyze Errors:** Carefully inspect stack traces, line-number coordinates, and warning descriptions.
2. **Isolate Root Cause:** Map the failure directly to the specific import, mismatched property, or custom style override.
3. **Targeted Fixes:** Correct the code without introducing collateral changes or breaking existing backward compatibility.
4. **Iterative Verification:** Re-execute all quality gates (Formatting, Linting, Type-checking, and Building) to ensure that the fix resolves the original issue and introduces no regressions.
5. **Repeat** until all verification checks compile and build clean.

---

## 5. Strict Compliance

> [!IMPORTANT]
> **No Exemptions:** Under no circumstances should compilation warnings, formatting inconsistencies, or linter errors be bypassed. The quality gate checks represent the absolute gatekeeper of codebase reliability.
