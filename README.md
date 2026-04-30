# 📦 Stock Management App

A professional, mobile-first, offline-first stock management web application built with **Next.js 16**, **Mantine UI 9**, and **IndexedDB**. Designed for seamless inventory tracking even without an internet connection.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Next.js](https://img.shields.io/badge/Next.js-16.2-000000?style=flat&logo=next.js)](https://nextjs.org/)
[![Mantine](https://img.shields.io/badge/Mantine-9.1-339af0?style=flat&logo=mantine)](https://mantine.dev/)

## ✨ Key Features

- **📱 Mobile-First Design**: Optimized for a premium experience on mobile devices and tablets with native-like feel.
- **🌐 Offline-First**: Uses IndexedDB (via Dexie.js) to store all data locally, ensuring full functionality without internet.
- **🚀 High Performance**: Implements single-stream virtualization (`@tanstack/react-virtual`) to handle thousands of inventory items smoothly.
- **⚡ Static Export**: Built as a high-performance static site (Next.js `output: export`).
- **💾 Data Management**: Professional backup and restore system with binary-safe handling for image Blobs and large datasets.
- **🛠️ Professional Tooling**: Equipped with ESLint, Prettier, Husky, and Commitlint for a consistent developer experience.

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v20 or higher recommended)
- [npm](https://www.npmjs.com/)

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/ghanshyam18/stock-manager-pro.git
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Start the development server:

   ```bash
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🏗️ Architecture

- **Framework**: [Next.js 16](https://nextjs.org/) (App Router, Static Export)
- **UI Components**: [Mantine UI 9](https://mantine.dev/) (Native-feeling components)
- **Database**: [Dexie.js](https://dexie.org/) (IndexedDB wrapper for robust offline storage)
- **State Management**: [Zustand](https://zustand-demo.pmnd.rs/) (Lightweight, performant global state)
- **Virtualization**: [@tanstack/react-virtual](https://tanstack.com/virtual/v3) (For high-performance listings)
- **Styling**: Vanilla CSS with CSS Modules and Mantine's styling system.

## 🛠️ Development Scripts

- `npm run dev`: Start development server at `localhost:3000`.
- `npm run build`: Build the application for production (generates `out/` directory).
- `npm run preview`: Serve the static export locally for final verification.
- `npm run lint`: Run ESLint to find and fix code quality issues.
- `npm run format`: Format the entire codebase using Prettier.
- `npm run type-check`: Run TypeScript compiler to check for type errors.
- `npm run release`: Use `standard-version` to bump version and generate changelog.

## 🛡️ Security & Privacy

- **Local-Only**: Your data never leaves your device. All processing happens in the browser.
- **No Tracking**: 100% privacy-focused. No external analytics, no trackers, no cookies.
- **Open Source**: Fully transparent codebase.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

_Built with ❤️ for efficient, offline-first inventory management._
