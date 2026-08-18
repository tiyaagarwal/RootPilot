# RootPilot Frontend

Production-grade React/Vite frontend for the RootPilot Spring Boot AIOps backend.

## Backend contract discovery

The frontend models are generated from the backend DTO and entity fields under `rootpilot-backend/src/main/java/com/rootpilot/rootpilot_backend`. Endpoints are mapped in `src/api/endpoints.ts` and intentionally mirror the controller mappings without inventing backend routes.

Key contracts:

- `GET /incidents` → `Incident[]`
- `GET /incidents/{id}` → `Incident`
- `GET /analysis/dashboard` → `DashboardSummary`
- `GET /analysis/live-dashboard` → `LiveDashboard`
- `GET /analysis/dashboard-snapshot` → `DashboardSnapshot`
- `GET /analysis/hourly-trend` → list of `{ hour, count }` maps
- `GET /analysis/correlations` → list of `{ service, exception, incidentCount }` maps
- `GET /analysis/recommendations` → `RootCauseRecommendation[]`
- `GET /analysis/failure-predictions` → `FailurePrediction[]`
- `GET /analysis/knowledge-graph-summary` → `KnowledgeGraphSummary`
- `GET /analysis/top-dependencies` → `ServiceDependency[]`
- `GET /analysis/dependency-risk-dashboard` → `DependencyRiskDashboard`
- `GET /analysis/service-reliability` → `ServiceReliability[]`
- `GET /analysis/automation-readiness-dashboard` → `AutomationReadinessDashboard`
- `GET /analysis/aiops-dashboard` → `AIOpsDashboard`

Note: the backend resilience mappings are currently double-prefixed in `AnalysisController` (`/analysis/analysis/service-resilience`) because method-level mappings include `/analysis/...` inside a class already mapped to `/analysis`.

## Setup

```bash
cd rootpilot-frontend
cp .env.example .env
npm install
npm run dev
```

## Environment

```env
VITE_API_BASE_URL=http://localhost:8080
VITE_USE_MOCKS=true
```

Set `VITE_USE_MOCKS=false` to call the live backend. API calls still fall back to typed mock data if a backend request fails, preserving demo readiness.

## Architecture

- `src/api` — Axios client and endpoint contract map
- `src/services` — feature service layer
- `src/types` — TypeScript DTO/entity mirrors
- `src/layouts` — enterprise shell
- `src/components` — KPI cards, charts, status pills, loading/error states
- `src/pages` — routed platform pages
- `src/store` — Zustand UI state
- `src/theme` — MUI dark glassmorphism theme

## Scripts

- `npm run dev` — Vite development server
- `npm run build` — TypeScript build plus Vite production bundle
- `npm run lint` — ESLint

## Visual system upgrades

The UI uses a premium dark observability aesthetic inspired by Datadog, Dynatrace, Grafana, Splunk Observability, and New Relic:

- glassmorphism panels with gradient borders and ambient glow
- animated metric counters and Framer Motion page/card transitions
- executive KPI grid, real-time system health strip, and AI copilot recommendation panels
- interactive Recharts visualizations and React Flow dependency/knowledge graphs
- modern incident detail drawer with an animated incident timeline
- responsive enterprise shell with collapsible navigation and command-center styling
