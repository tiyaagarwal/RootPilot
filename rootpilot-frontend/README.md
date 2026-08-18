# 🖥️ RootPilot Frontend

[![Vite](https://img.shields.io/badge/Vite-6.x-blue?style=flat-square&logo=vite)](https://vite.dev/)
[![React 18](https://img.shields.io/badge/React-18-blue?style=flat-square&logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Material-UI](https://img.shields.io/badge/MUI-5-blue?style=flat-square&logo=mui)](https://mui.com/)

A premium, high-density Single Page Application (SPA) designed to act as an SRE CommandCenter, Incident Response interface, and RCA (Root Cause Analysis) workbench. It communicates with the Spring Boot backend to visualize real-time telemetry metrics.

---

## 🚀 Key Features

* **AI Ops Command Center**: High-density dashboards displaying platform health, alert statuses, latency charts, and priority services requiring SRE attention.
* **Root Cause Analysis (RCA) Workbench**: Tracks probable verdicts, statistical deviations, and draws interactive topology relationship maps.
* **Operations Copilot Drawer**: A side-drawer AI assistant featuring dynamic suggested questions, SRE risk assessment badges, confidence indicators, and retry recovery fallbacks.
* **Service Intelligence Registry**: Full catalog containing ownership, owner info, uptime SLA metrics, availability buckets, and change histories.
* **Interactive UI Transitions**: Premium feel with 3D lift translations on cards, active button shrinkage feedback, and custom styled scrollbars.
* **Synchronized Dark/Light Theme**: A unified CSS variables and Material-UI design system that switches dark/light layout values dynamically.

---

## 🛠️ Technology Stack

* **Build Tool & Bundler**: Vite
* **Framework**: React 18 & TypeScript
* **State Management**: Zustand
* **Query Caching**: TanStack Query (React Query)
* **Design System**: Material-UI (MUI 5) & Vanilla CSS Variables
* **Topology Visualization**: React Flow (for SRE relationship maps)

---

## 🔧 Installation & Running

### 1. Install Packages
From the `rootpilot-frontend` directory, run:
```bash
npm install
```

### 2. Configure Environment Variables
Create or edit `.env` in the root of the frontend folder:
```env
VITE_API_BASE_URL=http://localhost:3000
```
*Note: Vite dev server automatically proxies endpoints from `/api`, `/incidents`, and `/analysis` to http://localhost:8080 to prevent CORS issues.*

### 3. Launch Development Server
```bash
npm run dev
```
The application will launch on your local host: **http://localhost:3000**.

---

## 📂 Project Directory Structure

* `src/api` — Base HTTP client (Axios configuration, endpoints mapping)
* `src/components` — Shared controls (Loading/Error/Empty states, Status pills, Copilot drawer)
* `src/context` — Authentication providers (JWT localStorage session handlers)
* `src/layouts` — Application templates and sidebar navigation shells
* `src/pages` — Command Center, Incidents timeline, RCA graphs, Settings
* `src/theme` — Theme provider declarations (Light/Dark tokens)
* `src/types` — TypeScript mappings of Spring Boot entity models
