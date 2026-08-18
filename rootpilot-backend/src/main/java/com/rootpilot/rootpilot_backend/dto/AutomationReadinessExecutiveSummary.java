package com.rootpilot.rootpilot_backend.dto;

public class AutomationReadinessExecutiveSummary {

    private String automationMaturity;
    private double autonomousCoverage;
    private String topAutomationRisk;
    private String executiveRecommendation;
    private String platformAutomationGrade;

    public AutomationReadinessExecutiveSummary(
            String automationMaturity,
            double autonomousCoverage,
            String topAutomationRisk,
            String executiveRecommendation,
            String platformAutomationGrade) {

        this.automationMaturity = automationMaturity;
        this.autonomousCoverage = autonomousCoverage;
        this.topAutomationRisk = topAutomationRisk;
        this.executiveRecommendation = executiveRecommendation;
        this.platformAutomationGrade = platformAutomationGrade;
    }

    public String getAutomationMaturity() {
        return automationMaturity;
    }

    public double getAutonomousCoverage() {
        return autonomousCoverage;
    }

    public String getTopAutomationRisk() {
        return topAutomationRisk;
    }

    public String getExecutiveRecommendation() {
        return executiveRecommendation;
    }

    public String getPlatformAutomationGrade() {
        return platformAutomationGrade;
    }
}