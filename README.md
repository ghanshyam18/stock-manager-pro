# 📦 Stock Management App

A professional, mobile-first, offline-first stock management web application built with **Next.js**, **Mantine UI**, and **IndexedDB**. Designed for seamless inventory tracking even without an internet connection.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Next.js](https://img.shields.io/badge/Next.js-15+-000000?style=flat&logo=next.js)](https://nextjs.org/)
[![Mantine](https://img.shields.io/badge/Mantine-9+-339af0?style=flat&logo=mantine)](https://mantine.dev/)

## ✨ Key Features

- **📱 Mobile-First Design**: Optimized for a premium experience on mobile devices and tablets.
- **🌐 Offline-First**: Uses IndexedDB (via Dexie.js) to store all data locally, ensuring full functionality without internet.
- **🚀 Static Export**: Built as a high-performance static site (Next.js `output: export`).
- **⚡ Fast & Lightweight**: Minimal bundle size and lightning-fast interactions.
- **💾 Automatic Sync**: (Future) Capability to sync with a backend when online.
- **🛠️ Professional Tooling**: Equipped with ESLint, Prettier, Husky, and Commitlint.

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v20 or higher recommended)
- [npm](https://www.npmjs.com/)

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/yourusername/stock-management-app.git
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

- **Framework**: [Next.js](https://nextjs.org/) (App Router)
- **UI Components**: [Mantine UI](https://mantine.dev/)
- **Database**: [IndexedDB](https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API) with [Dexie.js](https://dexie.org/)
- **State Management**: [Zustand](https://zustand-demo.pmnd.rs/)
- **Styling**: Vanilla CSS & Tailwind CSS (for utilities)

## 🛠️ Development Scripts

- `npm run dev`: Start development server.
- `npm run build`: Build for production (static export).
- `npm run preview`: Preview the static build using `serve`.
- `npm run lint`: Run ESLint.
- `npm run format`: Format code with Prettier.
- `npm run release`: Generate changelog and bump version.

## 🛡️ Security & Privacy

- **Local-Only**: Data remains on your device unless you explicitly enable sync features.
- **No Tracking**: No external analytics or tracking scripts — 100% user privacy.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

_Built with ❤️ for efficient inventory management._
