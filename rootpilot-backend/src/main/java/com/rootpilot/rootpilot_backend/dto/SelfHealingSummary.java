package com.rootpilot.rootpilot_backend.dto;

public class SelfHealingSummary {

    private int totalRecommendations;
    private int automationEligibleCount;
    private int criticalActions;
    private String topRecommendedAction;
    private double averageAutomationReadiness;

    public SelfHealingSummary(
            int totalRecommendations,
            int automationEligibleCount,
            int criticalActions,
            String topRecommendedAction,
            double averageAutomationReadiness) {

        this.totalRecommendations = totalRecommendations;
        this.automationEligibleCount = automationEligibleCount;
        this.criticalActions = criticalActions;
        this.topRecommendedAction = topRecommendedAction;
        this.averageAutomationReadiness = averageAutomationReadiness;
    }

    public int getTotalRecommendations() {
        return totalRecommendations;
    }

    public void setTotalRecommendations(int totalRecommendations) {
        this.totalRecommendations = totalRecommendations;
    }

    public int getAutomationEligibleCount() {
        return automationEligibleCount;
    }

    public void setAutomationEligibleCount(int automationEligibleCount) {
        this.automationEligibleCount = automationEligibleCount;
    }

    public int getCriticalActions() {
        return criticalActions;
    }

    public void setCriticalActions(int criticalActions) {
        this.criticalActions = criticalActions;
    }

    public String getTopRecommendedAction() {
        return topRecommendedAction;
    }

    public void setTopRecommendedAction(String topRecommendedAction) {
        this.topRecommendedAction = topRecommendedAction;
    }

    public double getAverageAutomationReadiness() {
        return averageAutomationReadiness;
    }

    public void setAverageAutomationReadiness(double averageAutomationReadiness) {
        this.averageAutomationReadiness = averageAutomationReadiness;
    }
}