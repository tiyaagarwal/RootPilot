package com.rootpilot.rootpilot_backend.dto;

public class LiveDashboard {

    private long totalIncidents;
    private String topService;
    private String topException;
    private String severity;
    private int alertsCount;
    private int scoredAlertsCount;
    private String topCorrelation;
    private String executiveSummary;
    private int healthScore;
    private String systemStatus;
    private String topDependency;

    private String highestDependencyRisk;

    public LiveDashboard(
            long totalIncidents,
            String topService,
            String topException,
            String severity,
            int alertsCount,
            int scoredAlertsCount,
            String topCorrelation,
            String executiveSummary,
            int healthScore,
            String systemStatus) {

        this.totalIncidents = totalIncidents;
        this.topService = topService;
        this.topException = topException;
        this.severity = severity;
        this.alertsCount = alertsCount;
        this.scoredAlertsCount = scoredAlertsCount;
        this.topCorrelation = topCorrelation;
        this.executiveSummary = executiveSummary;
        this.healthScore = healthScore;
        this.systemStatus = systemStatus;
    }

    public long getTotalIncidents() {
        return totalIncidents;
    }

    public String getTopService() {
        return topService;
    }

    public String getTopException() {
        return topException;
    }

    public String getSeverity() {
        return severity;
    }

    public int getAlertsCount() {
        return alertsCount;
    }

    public int getScoredAlertsCount() {
        return scoredAlertsCount;
    }

    public String getTopCorrelation() {
        return topCorrelation;
    }

    public String getExecutiveSummary() {
        return executiveSummary;
    }

    public int getHealthScore() {
        return healthScore;
    }
    public String getSystemStatus() {
        return systemStatus;
    }
}