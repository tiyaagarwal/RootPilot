package com.rootpilot.rootpilot_backend.dto;

public class OrchestratorExecutiveSummary {

    private String orchestratorHealth;

    private String executionReadiness;

    private String approvalRiskLevel;

    private String confidenceAssessment;

    private String executiveRecommendation;

    public OrchestratorExecutiveSummary(
            String orchestratorHealth,
            String executionReadiness,
            String approvalRiskLevel,
            String confidenceAssessment,
            String executiveRecommendation) {

        this.orchestratorHealth = orchestratorHealth;
        this.executionReadiness = executionReadiness;
        this.approvalRiskLevel = approvalRiskLevel;
        this.confidenceAssessment = confidenceAssessment;
        this.executiveRecommendation = executiveRecommendation;
    }

    public String getOrchestratorHealth() {
        return orchestratorHealth;
    }

    public void setOrchestratorHealth(String orchestratorHealth) {
        this.orchestratorHealth = orchestratorHealth;
    }

    public String getExecutionReadiness() {
        return executionReadiness;
    }

    public void setExecutionReadiness(String executionReadiness) {
        this.executionReadiness = executionReadiness;
    }

    public String getApprovalRiskLevel() {
        return approvalRiskLevel;
    }

    public void setApprovalRiskLevel(String approvalRiskLevel) {
        this.approvalRiskLevel = approvalRiskLevel;
    }

    public String getConfidenceAssessment() {
        return confidenceAssessment;
    }

    public void setConfidenceAssessment(String confidenceAssessment) {
        this.confidenceAssessment = confidenceAssessment;
    }

    public String getExecutiveRecommendation() {
        return executiveRecommendation;
    }

    public void setExecutiveRecommendation(String executiveRecommendation) {
        this.executiveRecommendation = executiveRecommendation;
    }
}