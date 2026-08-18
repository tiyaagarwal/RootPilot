# RootPilot Backend Contract Map

This frontend was derived from the Spring Boot controllers, DTOs, entity, and service return types in `rootpilot-backend/src/main/java/com/rootpilot/rootpilot_backend`.

## Controllers

### HealthController
- `GET /health` → `{ status: string }`

### MetricsController
- `GET /metrics` → `{ totalIncidents: number }`
- `GET /metrics/exceptions` → `Record<string, number>`
- `GET /metrics/services` → `Record<string, number>`

### IncidentController
- `GET /incidents` → `Incident[]`
- `GET /incidents/{id}` → `Incident`
- `GET /incidents/services` → `string[]`

### AnalysisController
- `GET /analysis/dashboard` → `DashboardSummary`
- `GET /analysis/executive-summary` → `ExecutiveSummary`
- `GET /analysis/live-dashboard` → `LiveDashboard`
- `GET /analysis/dashboard-snapshot` → `DashboardSnapshot`
- `GET /analysis/hourly-trend` → `{ hour: string; count: number }[]`
- `GET /analysis/severity` → `{ severity: string; recentIncidents: number; spikeDetected: boolean }`
- `GET /analysis/correlations` → `{ service: string; exception: string; incidentCount: number }[]`
- `GET /analysis/rca-summary` → map containing `totalIncidents`, `topService`, `topException`, `topCorrelation`, `probableRootCause`
- `GET /analysis/recommendations` → `RootCauseRecommendation[]`
- `GET /analysis/failure-predictions` → `FailurePrediction[]`
- `GET /analysis/anomalies` → `AnomalyDetection[]`
- `GET /analysis/service-reliability` → `ServiceReliability[]`
- `GET /analysis/autonomous-actions` → `AutonomousAction[]`
- `GET /analysis/knowledge-graph` → map containing backend graph payload
- `GET /analysis/knowledge-graph-summary` → `KnowledgeGraphSummary`
- `GET /analysis/automation-readiness-dashboard` → `AutomationReadinessDashboard`
- `GET /analysis/orchestrator-dashboard` → `OrchestratorDashboard`
- `GET /analysis/aiops-dashboard` → `AIOpsDashboard`

### DependencyAnalysisController
- `GET /analysis/dependency-impacts` → `DependencyImpact[]`
- `GET /analysis/dependency-impact-summary` → `DependencyImpactSummary`
- `GET /analysis/dependency-impact-executive-summary` → `DependencyImpactExecutiveSummary`
- `GET /analysis/dependency-risk-scores` → `DependencyRiskScore[]`
- `GET /analysis/dependency-risk-dashboard` → `DependencyRiskDashboard`

### SelfHealingController
- `GET /analysis/self-healing-recommendations` → `SelfHealingRecommendation[]`
- `GET /analysis/self-healing-summary` → `SelfHealingSummary`
- `GET /analysis/self-healing-executive-summary` → `SelfHealingExecutiveSummary`
- `GET /analysis/self-healing-dashboard` → `SelfHealingDashboard`

## DTO mirroring

All generated frontend DTO interfaces live in `src/types/backend.ts`. Field names intentionally match Spring/Jackson camelCase getter output. Generic map endpoints are represented by `StringNumberMap` and `StringObjectMap`, while strongly typed DTO endpoints use exact interfaces.

## Adapter notes

The frontend does not invent backend endpoints. Where the product UI needs an executive metric that is not directly available, it is explicitly shown as a frontend adapter derived from existing backend contracts or mock fallback data.

The resilience endpoints are mapped as `/analysis/analysis/...` because `AnalysisController` has class-level `@RequestMapping("/analysis")` and method-level mappings that also begin with `/analysis`.
