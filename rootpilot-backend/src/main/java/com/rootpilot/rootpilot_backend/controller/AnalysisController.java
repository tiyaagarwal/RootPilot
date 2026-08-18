package com.rootpilot.rootpilot_backend.controller;
import com.rootpilot.rootpilot_backend.dto.*;
import com.rootpilot.rootpilot_backend.service.*;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import com.rootpilot.rootpilot_backend.dto.ServiceResilience;
import com.rootpilot.rootpilot_backend.dto.ServiceResilienceSummary;
import com.rootpilot.rootpilot_backend.dto.ServiceResilienceExecutiveSummary;
import com.rootpilot.rootpilot_backend.dto.ResilienceRecommendation;
import com.rootpilot.rootpilot_backend.dto.ResilienceDashboard;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/analysis")
public class AnalysisController {

    private final IncidentService incidentService;
    private final ResilienceIntelligenceService resilienceIntelligenceService;
    private final AutomationReadinessService automationReadinessService;
    private final OrchestratorService orchestratorService;
    private final AIOpsCommandCenterService aiOpsCommandCenterService;
    private final AnomalyDetectionService anomalyDetectionService;

    public AnalysisController(
            IncidentService incidentService,
            ResilienceIntelligenceService resilienceIntelligenceService,
            AutomationReadinessService automationReadinessService,
            OrchestratorService orchestratorService,
            AIOpsCommandCenterService aiOpsCommandCenterService,
            AnomalyDetectionService anomalyDetectionService) {

        this.incidentService = incidentService;
        this.resilienceIntelligenceService =
                resilienceIntelligenceService;
        this.automationReadinessService =
                automationReadinessService;
        this.orchestratorService = orchestratorService;
        this.aiOpsCommandCenterService = aiOpsCommandCenterService;
        this.anomalyDetectionService = anomalyDetectionService;
    }

    @GetMapping("/exceptions")
    public Map<String, Long> getExceptionAnalysis() {

        return incidentService.getExceptionMetrics();
    }

    @GetMapping("/top-service")
    public Map<String, Object> getTopService() {

        return incidentService.getTopFailingService();
    }
    @GetMapping("/top-exception")
    public Map<String, Object> getTopException() {

        return incidentService.getTopException();
    }
    @GetMapping("/summary")
    public Map<String, Object> getSummary() {

        return incidentService.getAnalysisSummary();
    }
    @GetMapping("/service-ranking")
    public List<Map<String, Object>> getServiceRanking() {

        return incidentService.getServiceRanking();
    }
    @GetMapping("/exception-ranking")
    public List<Map<String, Object>> getExceptionRanking() {

        return incidentService.getExceptionRanking();
    }
    @GetMapping("/root-cause-candidates")
    public Map<String, Object> getRootCauseCandidates() {

        return incidentService.getRootCauseCandidates();
    }
    @GetMapping("/correlations")
    public List<Map<String, Object>> getCorrelations() {

        return incidentService.getCorrelations();
    }

    @GetMapping("/top-correlation")
    public Map<String, Object> getTopCorrelation() {

        return incidentService.getTopCorrelation();
    }
    @GetMapping("/rca-summary")
    public Map<String, Object> getRcaSummary() {

        return incidentService.getRcaSummary();
    }
    @GetMapping("/recent-incidents")
    public Map<String, Long> getRecentIncidents() {

        return incidentService.getRecentIncidentCount();
    }
    @GetMapping("/hourly-trend")
    public List<Map<String, Object>> getHourlyTrend() {

        return incidentService.getHourlyTrend();
    }
    @GetMapping("/spike-detection")
    public Map<String, Object> detectSpike() {

        return incidentService.detectSpike();
    }
    @GetMapping("/recent-top-service")
    public Map<String, Object> getRecentTopService() {

        return incidentService.getRecentTopService();
    }
    @GetMapping("/recent-top-exception")
    public Map<String, Object> getRecentTopException() {

        return incidentService.getRecentTopException();
    }
    @GetMapping("/trend-summary")
    public Map<String, Object> getTrendSummary() {

        return incidentService.getTrendSummary();
    }
    @GetMapping("/recent-correlations")
    public List<Map<String, Object>> getRecentCorrelations() {

        return incidentService.getRecentCorrelations();
    }
    @GetMapping("/recent-top-correlation")
    public Map<String, Object> getRecentTopCorrelation() {

        return incidentService.getRecentTopCorrelation();
    }
    @GetMapping("/recent-rca-summary")
    public Map<String, Object> getRecentRcaSummary() {

        return incidentService.getRecentRcaSummary();
    }
    @GetMapping("/severity")
    public Map<String, Object> getSeverityAnalysis() {

        return incidentService.getSeverityAnalysis();
    }
    @GetMapping("/live-count")
    public Map<String, Long> getLiveIncidentCount() {

        return incidentService.getLiveIncidentCount();
    }

    @GetMapping("/live-services")
    public Map<String, Long> getLiveServiceCounts() {

        return incidentService.getLiveServiceCounts();
    }


    @GetMapping("/live-exceptions")
    public Map<String, Long> getLiveExceptionCounts() {

        return incidentService.getLiveExceptionCounts();
    }
    @GetMapping("/alerts")
    public Map<String, List<String>> getAlerts() {

        return Map.of(
                "alerts",
                incidentService.generateAlerts()
        );
    }
    @GetMapping("/scored-alerts")
    public List<Alert> getScoredAlerts() {

        return incidentService.generateScoredAlerts();
    }
    @GetMapping("/dashboard")
    public DashboardSummary getDashboard() {

        return incidentService.getDashboardSummary();
    }
    @GetMapping("/executive-summary")
    public ExecutiveSummary getExecutiveSummary() {

        return incidentService.getExecutiveSummary();
    }
    @GetMapping("/live-dashboard")
    public LiveDashboard getLiveDashboard() {

        return incidentService.getLiveDashboard();
    }
    @GetMapping("/health-score")
    public int getHealthScore() {

        return incidentService.getHealthScore();
    }
    @GetMapping("/system-status")
    public String getSystemStatus() {

        return incidentService.getSystemStatus();
    }
    @GetMapping("/live-summary")
    public String getLiveSummary() {

        return incidentService.getLiveSummary();
    }
    @GetMapping("/dashboard-snapshot")
    public DashboardSnapshot getDashboardSnapshot() {

        return incidentService.getDashboardSnapshot();
    }
    @GetMapping("/service-dependencies")
    public List<ServiceDependency> getServiceDependencies() {

        return incidentService.getServiceDependencies();
    }
    @GetMapping("/top-dependencies")
    public List<ServiceDependency> getTopDependencies() {

        return incidentService.getTopDependencies();
    }
    @GetMapping("/dependency-summary")
    public DependencySummary getDependencySummary() {

        return incidentService.getDependencySummary();
    }
    @GetMapping("/cascade-failures")
    public List<CascadeFailure> getCascadeFailures() {

        return incidentService.getCascadeFailures();
    }
    @GetMapping("/dependency-risks")
    public List<DependencyRisk> getDependencyRisks() {

        return incidentService.getDependencyRisks();
    }
    @GetMapping("/dependency-executive-summary")
    public DependencyExecutiveSummary getDependencyExecutiveSummary() {

        return incidentService.getDependencyExecutiveSummary();
    }
    @GetMapping("/failure-predictions")
    public List<FailurePrediction> getFailurePredictions() {

        return incidentService.getFailurePredictions();
    }
    @GetMapping("/top-risk-services")
    public String getTopRiskService() {

        return incidentService.getTopRiskService();
    }
    @GetMapping("/prediction-summary")
    public PredictionSummary getPredictionSummary() {

        return incidentService.getPredictionSummary();
    }
    @GetMapping("/prediction-executive-summary")
    public PredictionExecutiveSummary getPredictionExecutiveSummary() {

        return incidentService.getPredictionExecutiveSummary();
    }
    @GetMapping("/anomalies")
    public List<com.rootpilot.rootpilot_backend.entity.AnomalyEvent> getAnomalies() {

        return anomalyDetectionService.getAllAnomalies();
    }
    @GetMapping("/top-anomaly")
    public String getTopAnomalyService() {

        return incidentService.getTopAnomalyService();
    }
    @GetMapping("/anomaly-summary")
    public AnomalySummary getAnomalySummary() {

        return incidentService.getAnomalySummary();
    }
    @GetMapping("/anomaly-executive-summary")
    public AnomalyExecutiveSummary getAnomalyExecutiveSummary() {

        return incidentService.getAnomalyExecutiveSummary();
    }
    @GetMapping("/recommendations")
    public List<RootCauseRecommendation> getRecommendations() {

        return incidentService.getRecommendations();
    }

    @GetMapping("/top-recommendation")
    public String getTopRecommendationService() {

        return incidentService.getTopRecommendationService();
    }

    @GetMapping("/recommendation-summary")
    public RecommendationSummary getRecommendationSummary() {

        return incidentService.getRecommendationSummary();
    }
    @GetMapping("/recommendation-executive-summary")
    public RecommendationExecutiveSummary getRecommendationExecutiveSummary() {

        return incidentService.getRecommendationExecutiveSummary();
    }
    @GetMapping("/service-reliability")
    public List<ServiceReliability> getServiceReliability() {

        return incidentService.getServiceReliability();
    }

    @GetMapping("/top-risk-reliability")
    public String getMostUnreliableService() {

        return incidentService.getMostUnreliableService();
    }

    @GetMapping("/reliability-summary")
    public ReliabilitySummary getReliabilitySummary() {

        return incidentService.getReliabilitySummary();
    }
    @GetMapping("/reliability-executive-summary")
    public ReliabilityExecutiveSummary getReliabilityExecutiveSummary() {

        return incidentService.getReliabilityExecutiveSummary();
    }
    @GetMapping("/autonomous-actions")
    public List<AutonomousAction> getAutonomousActions() {

        return incidentService.getAutonomousActions();
    }
    @GetMapping("/top-action")
    public String getTopAction() {

        return incidentService.getTopAction();
    }
    @GetMapping("/action-summary")
    public ActionSummary getActionSummary() {

        return incidentService.getActionSummary();
    }
    @GetMapping("/action-executive-summary")
    public ActionExecutiveSummary getActionExecutiveSummary() {

        return incidentService.getActionExecutiveSummary();

    }
    @GetMapping("/knowledge-graph")
    public Map<String, Object> getKnowledgeGraph() {

        return incidentService.getKnowledgeGraph();
    }
    @GetMapping("/knowledge-graph-summary")
    public KnowledgeGraphSummary getKnowledgeGraphSummary() {

        return incidentService.getKnowledgeGraphSummary();
    }
    @GetMapping("/knowledge-graph-executive-summary")
    public KnowledgeGraphExecutiveSummary
    getKnowledgeGraphExecutiveSummary() {

        return incidentService
                .getKnowledgeGraphExecutiveSummary();
    }
    @GetMapping("/service-resilience")
    public List<ServiceResilience> getServiceResilience() {

        return resilienceIntelligenceService
                .getServiceResilience();
    }

    @GetMapping("/service-resilience-summary")
    public ServiceResilienceSummary
    getServiceResilienceSummary() {

        return resilienceIntelligenceService
                .getServiceResilienceSummary();
    }

    @GetMapping("/service-resilience-executive-summary")
    public ServiceResilienceExecutiveSummary
    getServiceResilienceExecutiveSummary() {

        return resilienceIntelligenceService
                .getServiceResilienceExecutiveSummary();
    }

    @GetMapping("/resilience-recommendations")
    public List<ResilienceRecommendation>
    getResilienceRecommendations() {

        return resilienceIntelligenceService
                .getResilienceRecommendations();
    }

    @GetMapping("/resilience-dashboard")
    public ResilienceDashboard
    getResilienceDashboard() {

        return resilienceIntelligenceService
                .getResilienceDashboard();
    }
    @GetMapping("/automation-readiness")
    public List<AutomationReadiness> getAutomationReadiness() {

        return automationReadinessService
                .getAutomationReadiness();
    }

    @GetMapping("/automation-readiness-summary")
    public AutomationReadinessSummary
    getAutomationReadinessSummary() {

        return automationReadinessService
                .getAutomationReadinessSummary();
    }

    @GetMapping("/automation-readiness-executive-summary")
    public AutomationReadinessExecutiveSummary
    getAutomationReadinessExecutiveSummary() {

        return automationReadinessService
                .getAutomationReadinessExecutiveSummary();
    }

    @GetMapping("/automation-readiness-dashboard")
    public AutomationReadinessDashboard
    getAutomationReadinessDashboard() {

        return automationReadinessService
                .getAutomationReadinessDashboard();
    }
    @GetMapping("/autonomous-execution-plans")
    public List<AutonomousExecutionPlan>
    getAutonomousExecutionPlans() {

        return orchestratorService
                .getAutonomousExecutionPlans();
    }

    @GetMapping("/orchestrator-summary")
    public OrchestratorSummary
    getOrchestratorSummary() {

        return orchestratorService
                .getOrchestratorSummary();
    }

    @GetMapping("/orchestrator-executive-summary")
    public OrchestratorExecutiveSummary
    getOrchestratorExecutiveSummary() {

        return orchestratorService
                .getOrchestratorExecutiveSummary();
    }

    @GetMapping("/orchestrator-dashboard")
    public OrchestratorDashboard
    getOrchestratorDashboard() {

        return orchestratorService
                .getOrchestratorDashboard();
    }
    @GetMapping("/operational-priorities")
    public List<OperationalPriority> getOperationalPriorities() {

        return aiOpsCommandCenterService
                .getOperationalPriorities();
    }
    @GetMapping("/aiops-summary")
    public AIOpsSummary getAIOpsSummary() {

        return aiOpsCommandCenterService
                .getAIOpsSummary();
    }
    @GetMapping("/aiops-executive-summary")
    public AIOpsExecutiveSummary getAIOpsExecutiveSummary() {

        return aiOpsCommandCenterService
                .getAIOpsExecutiveSummary();
    }
    @GetMapping("/aiops-dashboard")
    public AIOpsDashboard getAIOpsDashboard() {

        return aiOpsCommandCenterService
                .getAIOpsDashboard();
    }
}