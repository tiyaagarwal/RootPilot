package com.rootpilot.rootpilot_backend.dto;

public class AutomationReadinessSummary {

    private int totalRecommendations;
    private int autonomousReadyCount;
    private int approvalRequiredCount;
    private int rollbackReadyCount;
    private double averageExecutionConfidence;
    private String highestRiskService;
    private double overallAutomationReadinessScore;

    public AutomationReadinessSummary(
            int totalRecommendations,
            int autonomousReadyCount,
            int approvalRequiredCount,
            int rollbackReadyCount,
            double averageExecutionConfidence,
            String highestRiskService,
            double overallAutomationReadinessScore) {

        this.totalRecommendations = totalRecommendations;
        this.autonomousReadyCount = autonomousReadyCount;
        this.approvalRequiredCount = approvalRequiredCount;
        this.rollbackReadyCount = rollbackReadyCount;
        this.averageExecutionConfidence = averageExecutionConfidence;
        this.highestRiskService = highestRiskService;
        this.overallAutomationReadinessScore = overallAutomationReadinessScore;
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

    public int getRollbackReadyCount() {
        return rollbackReadyCount;
    }

    public double getAverageExecutionConfidence() {
        return averageExecutionConfidence;
    }

    public String getHighestRiskService() {
        return highestRiskService;
    }

    public double getOverallAutomationReadinessScore() {
        return overallAutomationReadinessScore;
    }
}