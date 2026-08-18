package com.rootpilot.rootpilot_backend.dto;

public class SelfHealingExecutiveSummary {

    private double overallAutomationReadiness;
    private String selfHealingMaturity;
    private String highestPriorityAction;
    private double automationCoverage;
    private String executiveRecommendation;

    public SelfHealingExecutiveSummary(
            double overallAutomationReadiness,
            String selfHealingMaturity,
            String highestPriorityAction,
            double automationCoverage,
            String executiveRecommendation) {

        this.overallAutomationReadiness = overallAutomationReadiness;
        this.selfHealingMaturity = selfHealingMaturity;
        this.highestPriorityAction = highestPriorityAction;
        this.automationCoverage = automationCoverage;
        this.executiveRecommendation = executiveRecommendation;
    }

    public double getOverallAutomationReadiness() {
        return overallAutomationReadiness;
    }

    public void setOverallAutomationReadiness(double overallAutomationReadiness) {
        this.overallAutomationReadiness = overallAutomationReadiness;
    }

    public String getSelfHealingMaturity() {
        return selfHealingMaturity;
    }

    public void setSelfHealingMaturity(String selfHealingMaturity) {
        this.selfHealingMaturity = selfHealingMaturity;
    }

    public String getHighestPriorityAction() {
        return highestPriorityAction;
    }

    public void setHighestPriorityAction(String highestPriorityAction) {
        this.highestPriorityAction = highestPriorityAction;
    }

    public double getAutomationCoverage() {
        return automationCoverage;
    }

    public void setAutomationCoverage(double automationCoverage) {
        this.automationCoverage = automationCoverage;
    }

    public String getExecutiveRecommendation() {
        return executiveRecommendation;
    }

    public void setExecutiveRecommendation(String executiveRecommendation) {
        this.executiveRecommendation = executiveRecommendation;
    }
}