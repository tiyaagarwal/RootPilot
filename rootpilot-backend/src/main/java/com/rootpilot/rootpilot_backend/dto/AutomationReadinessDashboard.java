package com.rootpilot.rootpilot_backend.dto;

public class AutomationReadinessDashboard {

    private int totalRecommendations;
    private int autonomousReadyCount;
    private int approvalRequiredCount;
    private double averageExecutionConfidence;
    private double overallAutomationReadinessScore;

    private String automationMaturity;
    private String platformAutomationGrade;
    private String topAutomationRisk;

    public AutomationReadinessDashboard(
            int totalRecommendations,
            int autonomousReadyCount,
            int approvalRequiredCount,
            double averageExecutionConfidence,
            double overallAutomationReadinessScore,
            String automationMaturity,
            String platformAutomationGrade,
            String topAutomationRisk) {

        this.totalRecommendations = totalRecommendations;
        this.autonomousReadyCount = autonomousReadyCount;
        this.approvalRequiredCount = approvalRequiredCount;
        this.averageExecutionConfidence = averageExecutionConfidence;
        this.overallAutomationReadinessScore = overallAutomationReadinessScore;
        this.automationMaturity = automationMaturity;
        this.platformAutomationGrade = platformAutomationGrade;
        this.topAutomationRisk = topAutomationRisk;
    }

    public int getTotalRecommendations() {
        return totalRecommendations;
    }

    public int getAutonomousReadyCount() {
        return autonomousReadyCount;
    }

    public int getApprovalRequiredCount() {
        return approvalRequiredCount;
    }

    public double getAverageExecutionConfidence() {
        return averageExecutionConfidence;
    }

    public double getOverallAutomationReadinessScore() {
        return overallAutomationReadinessScore;
    }

    public String getAutomationMaturity() {
        return automationMaturity;
    }

    public String getPlatformAutomationGrade() {
        return platformAutomationGrade;
    }

    public String getTopAutomationRisk() {
        return topAutomationRisk;
    }
}