# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

## [0.2.0](https://github.com/ghanshyam18/stock-manager-pro/compare/v0.1.1...v0.2.0) (2026-05-20)

### Features

- **db:** implement v3 migration for binary image conversion and fix types ([f8eaac5](https://github.com/ghanshyam18/stock-manager-pro/commit/f8eaac5a4a13478a0dce114f296f2f91de9b6afc))
- **import:** reconstruct designs aggregate post legacy backup import ([d48155d](https://github.com/ghanshyam18/stock-manager-pro/commit/d48155d3a92578fd5c3050ed659f65e9b5be5703))
- **inventory:** implement rich design autocomplete with tiered resolution ([1ad1514](https://github.com/ghanshyam18/stock-manager-pro/commit/1ad15143a3e0b4e2b58dc63b3d9c7ca3aa0827f9))
- **inventory:** normalize database schema to group by design number and streamline listing ui ([1122216](https://github.com/ghanshyam18/stock-manager-pro/commit/1122216bd0ad4507c84e859a52c24e3029936f4e))
- **invoices:** implement dynamic business profile with accordion and localStorage ([ab3d3d4](https://github.com/ghanshyam18/stock-manager-pro/commit/ab3d3d4eae6d19f437bcfc387ddb87928b236220))
- **ui:** complete pixel-perfect design system transformation ([0557446](https://github.com/ghanshyam18/stock-manager-pro/commit/055744682bcc4c04f30eeec0e4d400535adb658c))
- **ui:** remove filter button and relocate data management to add stock tab ([f0de558](https://github.com/ghanshyam18/stock-manager-pro/commit/f0de558c51d632f3ec57adf6042aabaefd5f2512))
- update documentation features ([36f47f4](https://github.com/ghanshyam18/stock-manager-pro/commit/36f47f4d7f30f26663d30c27666b480491b98fd8))

### Bug Fixes

- **data:** resolve image corruption in export/import and fix build errors ([180c722](https://github.com/ghanshyam18/stock-manager-pro/commit/180c72262fd9d9e70249e32a0e7818190fa34dcb))
- **db:** resolve hook crashes using explicit transactions and fix linting ([3ad11b6](https://github.com/ghanshyam18/stock-manager-pro/commit/3ad11b6606e844d971815a1f3c638884dc484969))

### 0.1.1 (2026-04-30)

### Features

- **data:** implement professional binary-safe backup and restore using `dexie-export-import`
- **data:** fix image corruption issue in inventory export/import
- **data:** add true database restore with `clearTablesBeforeImport` strategy
- **build:** resolve 'self is not defined' SSR errors using dynamic imports
- comprehensive UI/UX overhaul and performance optimizations ([79232a2](https://github.com/ghanshyam18/stock-manager-pro/commit/79232a2f2a7e7de0e36fc041e91d6a9535d1e164))
- initial commit with professional project standards ([5c4900f](https://github.com/ghanshyam18/stock-manager-pro/commit/5c4900f24e362daae5ab130bdc9b3ea95bdb412f))
- **inventory:** implement high-performance db-level pagination and brand asset suite ([dea9b54](https://github.com/ghanshyam18/stock-manager-pro/commit/dea9b54c4f4f60cbc00918cdda55e97abbe93ad6))
- **inventory:** overhaul UX with unified view and optimized blob storage ([524a6f5](https://github.com/ghanshyam18/stock-manager-pro/commit/524a6f5e8514ebdec5e232f76ca43abbaf39b361))
