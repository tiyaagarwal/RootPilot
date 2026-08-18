package com.rootpilot.rootpilot_backend.dto;

public class AIOpsExecutiveSummary {

    private String operationalStatus;

    private String keyRiskArea;

    private String recommendedFocus;

    private String automationReadinessAssessment;

    private String executiveRecommendation;

    public AIOpsExecutiveSummary(
            String operationalStatus,
            String keyRiskArea,
            String recommendedFocus,
            String automationReadinessAssessment,
            String executiveRecommendation) {

        this.operationalStatus = operationalStatus;
        this.keyRiskArea = keyRiskArea;
        this.recommendedFocus = recommendedFocus;
        this.automationReadinessAssessment = automationReadinessAssessment;
        this.executiveRecommendation = executiveRecommendation;
    }

    public String getOperationalStatus() {
        return operationalStatus;
    }

    public String getKeyRiskArea() {
        return keyRiskArea;
    }

    public String getRecommendedFocus() {
        return recommendedFocus;
    }

    public String getAutomationReadinessAssessment() {
        return automationReadinessAssessment;
    }

    public String getExecutiveRecommendation() {
        return executiveRecommendation;
    }
}