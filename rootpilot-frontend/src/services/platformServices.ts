import { endpoints } from '../api/endpoints';
import { getBackend, postBackend } from './base';
import type {
  AIOpsDashboard,
  AIOpsSummary,
  AIOpsExecutiveSummary,
  ActionSummary,
  ActionExecutiveSummary,
  Alert,
  AnomalyDetection,
  AnomalySummary,
  AnomalyExecutiveSummary,
  AutomationReadiness,
  AutomationReadinessDashboard,
  AutomationReadinessSummary,
  AutomationReadinessExecutiveSummary,
  AutonomousAction,
  AutonomousExecutionPlan,
  CascadeFailure,
  DashboardSnapshot,
  DashboardSummary,
  DependencyExecutiveSummary,
  DependencyImpact,
  DependencyImpactExecutiveSummary,
  DependencyImpactSummary,
  DependencyRisk,
  DependencyRiskDashboard,
  DependencyRiskScore,
  DependencySummary,
  ExecutiveSummary,
  FailurePrediction,
  Incident,
  KnowledgeGraphExecutiveSummary,
  KnowledgeGraphSummary,
  OrchestratorDashboard,
  OrchestratorSummary,
  OrchestratorExecutiveSummary,
  PredictionSummary,
  PredictionExecutiveSummary,
  RecommendationSummary,
  ReliabilityExecutiveSummary,
  ReliabilitySummary,
  ResilienceDashboard,
  ResilienceRecommendation,
  RootCauseRecommendation,
  SelfHealingDashboard,
  SelfHealingSummary,
  SelfHealingExecutiveSummary,
  ServiceDependency,
  ServiceReliability,
  ServiceResilience,
  ServiceResilienceExecutiveSummary,
  ServiceResilienceSummary,
  SpikeDetection,
  StringNumberMap,
  StringObjectMap,
  HostInventory,
  ServiceInventory,
  InfrastructureDependency,
  InfrastructureSummary,
  ChangeEvent,
  BusinessService,
  BusinessServiceImpact,
  DailyBriefing,
  NarrativeResult,
  IncidentReplayTimeline,
  SimilarIncident,
  TimelineBucket,
  ServiceProfile,
  CopilotRequest,
  CopilotResponse,
} from '../types/backend';

// ─── Dashboard ────────────────────────────────────────────────────────────────

export const dashboardService = {
  summary: () => getBackend<DashboardSummary>(endpoints.analysis.dashboard),
  snapshot: () => getBackend<DashboardSnapshot>(endpoints.analysis.dashboardSnapshot),
  hourlyTrend: () => getBackend<StringObjectMap[]>(endpoints.analysis.hourlyTrend),
  trendSummary: () => getBackend<StringObjectMap>(endpoints.analysis.trendSummary),
  scoredAlerts: () => getBackend<Alert[]>(endpoints.analysis.scoredAlerts),
  severity: () => getBackend<{ severity: string; recentIncidents: number; spikeDetected: boolean }>(endpoints.analysis.severity),
  spikeDetection: () => getBackend<SpikeDetection>(endpoints.analysis.spikeDetection),
  serviceMetrics: () => getBackend<StringNumberMap>(endpoints.serviceMetrics),
  exceptionMetrics: () => getBackend<StringNumberMap>(endpoints.exceptionMetrics),
  executiveSummary: () => getBackend<ExecutiveSummary>(endpoints.analysis.executiveSummary),
};

// ─── Incidents ────────────────────────────────────────────────────────────────

export const incidentService = {
  list: () => getBackend<Incident[]>(endpoints.incidents),
  services: () => getBackend<string[]>(endpoints.services),
  replay: (id: number) => getBackend<IncidentReplayTimeline>(endpoints.incidentReplay(id)),
  similar: (id: number) => getBackend<SimilarIncident[]>(endpoints.incidentSimilar(id)),
};

// ─── Correlations ─────────────────────────────────────────────────────────────

export const correlationService = {
  correlations: () => getBackend<StringObjectMap[]>(endpoints.analysis.correlations),
  recentCorrelations: () => getBackend<StringObjectMap[]>(endpoints.analysis.recentCorrelations),
};

// ─── Root Cause Analysis ──────────────────────────────────────────────────────

export const rootCauseService = {
  rcaSummary: () => getBackend<StringObjectMap>(endpoints.analysis.rcaSummary),
  recentRcaSummary: () => getBackend<StringObjectMap>(endpoints.analysis.recentRcaSummary),
  recommendations: () => getBackend<RootCauseRecommendation[]>(endpoints.analysis.recommendations),
  recommendationSummary: () => getBackend<RecommendationSummary>(endpoints.analysis.recommendationSummary),
};

// ─── Predictive Analytics ─────────────────────────────────────────────────────

export const predictionService = {
  predictions: () => getBackend<FailurePrediction[]>(endpoints.analysis.failurePredictions),
  predictionSummary: () => getBackend<PredictionSummary>(endpoints.analysis.predictionSummary),
  predictionExecutiveSummary: () => getBackend<PredictionExecutiveSummary>(endpoints.analysis.predictionExecutiveSummary),
  anomalies: () => getBackend<AnomalyDetection[]>(endpoints.analysis.anomalies),
  anomalySummary: () => getBackend<AnomalySummary>(endpoints.analysis.anomalySummary),
  anomalyExecutiveSummary: () => getBackend<AnomalyExecutiveSummary>(endpoints.analysis.anomalyExecutiveSummary),
};

// ─── Knowledge Graph ──────────────────────────────────────────────────────────

export const knowledgeGraphService = {
  graph: () => getBackend<StringObjectMap>(endpoints.analysis.knowledgeGraph),
  summary: () => getBackend<KnowledgeGraphSummary>(endpoints.analysis.knowledgeGraphSummary),
  executiveSummary: () => getBackend<KnowledgeGraphExecutiveSummary>(endpoints.analysis.knowledgeGraphExecutiveSummary),
};

// ─── Dependencies ─────────────────────────────────────────────────────────────

export const dependencyService = {
  dependencies: () => getBackend<ServiceDependency[]>(endpoints.analysis.topDependencies),
  summary: () => getBackend<DependencySummary>(endpoints.analysis.dependencySummary),
  executiveSummary: () => getBackend<DependencyExecutiveSummary>(endpoints.analysis.dependencyExecutiveSummary),
  risks: () => getBackend<DependencyRisk[]>(endpoints.analysis.dependencyRisks),
  cascades: () => getBackend<CascadeFailure[]>(endpoints.analysis.cascadeFailures),
  impacts: () => getBackend<DependencyImpact[]>(endpoints.analysis.dependencyImpacts),
  impactSummary: () => getBackend<DependencyImpactSummary>(endpoints.analysis.dependencyImpactSummary),
  impactExecutiveSummary: () => getBackend<DependencyImpactExecutiveSummary>(endpoints.analysis.dependencyImpactExecutiveSummary),
  riskScores: () => getBackend<DependencyRiskScore[]>(endpoints.analysis.dependencyRiskScores),
  riskDashboard: () => getBackend<DependencyRiskDashboard>(endpoints.analysis.dependencyRiskDashboard),
};

// ─── Service Health ───────────────────────────────────────────────────────────

export const healthService = {
  reliability: () => getBackend<ServiceReliability[]>(endpoints.analysis.serviceReliability),
  reliabilitySummary: () => getBackend<ReliabilitySummary>(endpoints.analysis.reliabilitySummary),
  reliabilityExecutiveSummary: () => getBackend<ReliabilityExecutiveSummary>(endpoints.analysis.reliabilityExecutiveSummary),
  resilience: () => getBackend<ServiceResilience[]>(endpoints.analysis.serviceResilience),
  resilienceSummary: () => getBackend<ServiceResilienceSummary>(endpoints.analysis.serviceResilienceSummary),
  resilienceExecutiveSummary: () => getBackend<ServiceResilienceExecutiveSummary>(endpoints.analysis.serviceResilienceExecutiveSummary),
  resilienceRecommendations: () => getBackend<ResilienceRecommendation[]>(endpoints.analysis.resilienceRecommendations),
  resilienceDashboard: () => getBackend<ResilienceDashboard>(endpoints.analysis.resilienceDashboard),
};

// ─── Autonomous Operations ────────────────────────────────────────────────────

export const autonomousService = {
  actions: () => getBackend<AutonomousAction[]>(endpoints.analysis.autonomousActions),
  actionSummary: () => getBackend<ActionSummary>(endpoints.analysis.actionSummary),
  actionExecutiveSummary: () => getBackend<ActionExecutiveSummary>(endpoints.analysis.actionExecutiveSummary),
  executionPlans: () => getBackend<AutonomousExecutionPlan[]>(endpoints.analysis.autonomousExecutionPlans),
  orchestratorSummary: () => getBackend<OrchestratorSummary>(endpoints.analysis.orchestratorSummary),
  orchestratorExecutiveSummary: () => getBackend<OrchestratorExecutiveSummary>(endpoints.analysis.orchestratorExecutiveSummary),
  orchestratorDashboard: () => getBackend<OrchestratorDashboard>(endpoints.analysis.orchestratorDashboard),
  readiness: () => getBackend<AutomationReadiness[]>(endpoints.analysis.automationReadiness),
  readinessSummary: () => getBackend<AutomationReadinessSummary>(endpoints.analysis.automationReadinessSummary),
  readinessExecutiveSummary: () => getBackend<AutomationReadinessExecutiveSummary>(endpoints.analysis.automationReadinessExecutiveSummary),
  readinessDashboard: () => getBackend<AutomationReadinessDashboard>(endpoints.analysis.automationReadinessDashboard),
  selfHealing: () => getBackend<SelfHealingDashboard>(endpoints.analysis.selfHealingDashboard),
  selfHealingSummary: () => getBackend<SelfHealingSummary>(endpoints.analysis.selfHealingSummary),
  selfHealingExecutiveSummary: () => getBackend<SelfHealingExecutiveSummary>(endpoints.analysis.selfHealingExecutiveSummary),
};

// ─── AI Ops Command Center ────────────────────────────────────────────────────

export const commandCenterService = {
  dashboard: () => getBackend<AIOpsDashboard>(endpoints.analysis.aiopsDashboard),
  summary: () => getBackend<AIOpsSummary>(endpoints.analysis.aiopsSummary),
  executiveSummary: () => getBackend<AIOpsExecutiveSummary>(endpoints.analysis.aiopsExecutiveSummary),
  priorities: () => getBackend<AIOpsDashboard['operationalPriorities']>(endpoints.analysis.operationalPriorities),
};

// ─── Infrastructure ───────────────────────────────────────────────────────────

export const infrastructureService = {
  summary: () => getBackend<InfrastructureSummary>(endpoints.infrastructure.summary),
  hosts: () => getBackend<HostInventory[]>(endpoints.infrastructure.hosts),
  services: () => getBackend<ServiceInventory[]>(endpoints.infrastructure.services),
  dependencies: () => getBackend<InfrastructureDependency[]>(endpoints.infrastructure.dependencies),
  serviceProfiles: () => getBackend<ServiceProfile[]>(endpoints.infrastructure.serviceProfiles),
  serviceProfile: (name: string) => getBackend<ServiceProfile>(endpoints.infrastructure.serviceProfile(name)),
};

// ─── Change Intelligence ──────────────────────────────────────────────────────

export const changeService = {
  recent: (hours?: number) => getBackend<ChangeEvent[]>(`${endpoints.changes.recent}?hours=${hours ?? 24}`),
  correlations: (incidentId: number) => getBackend<ChangeEvent[]>(endpoints.changes.correlations(incidentId)),
  narrative: (incidentId: number) => getBackend<NarrativeResult>(endpoints.changes.narrative(incidentId)),
  serviceNarrative: (serviceName: string) => getBackend<NarrativeResult>(endpoints.changes.serviceNarrative(serviceName)),
};

// ─── Reliability Timeline ─────────────────────────────────────────────────────

export const timelineService = {
  get: (period: string, serviceName?: string) =>
    getBackend<TimelineBucket[]>(endpoints.analysis.reliabilityTimeline(serviceName, period)),
};

// ─── Business Service Model ───────────────────────────────────────────────────

export const businessServiceService = {
  list: () => getBackend<BusinessService[]>(endpoints.businessServices.list),
  impact: () => getBackend<BusinessServiceImpact>(endpoints.businessServices.impact),
};

// ─── Daily Operational Briefing ───────────────────────────────────────────────

export const briefingService = {
  today: () => getBackend<DailyBriefing>(endpoints.operationalBriefing.today),
  metrics: () => getBackend<Record<string, unknown>>(endpoints.operationalBriefing.metrics),
};

// ─── Operations Copilot ───────────────────────────────────────────────────────

export const copilotService = {
  ask: (request: CopilotRequest) => postBackend<CopilotResponse>(endpoints.copilot.ask, request),
};
