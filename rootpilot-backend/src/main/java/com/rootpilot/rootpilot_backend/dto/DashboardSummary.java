package com.rootpilot.rootpilot_backend.dto;

public class DashboardSummary {

    private long totalIncidents;
    private String topService;
    private String topException;
    private String severity;
    private int alertsCount;
    private int scoredAlertsCount;
    private String topCorrelation;
    private String topDependency;

    private String highestDependencyRisk;

    private long totalDependencies;

    public DashboardSummary(
            long totalIncidents,
            String topService,
            String topException,
            String severity,
            int alertsCount,
            int scoredAlertsCount,
            String topCorrelation,
            String topDependency,
            String highestDependencyRisk,
            long totalDependencies) {

        this.totalIncidents = totalIncidents;
        this.topService = topService;
        this.topException = topException;
        this.severity = severity;
        this.alertsCount = alertsCount;
        this.scoredAlertsCount = scoredAlertsCount;
        this.topCorrelation = topCorrelation;

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
    public String getTopDependency() {
        return topDependency;
    }

    public void setTopDependency(String topDependency) {
        this.topDependency = topDependency;
    }

    public String getHighestDependencyRisk() {
        return highestDependencyRisk;
    }

    public void setHighestDependencyRisk(String highestDependencyRisk) {
        this.highestDependencyRisk = highestDependencyRisk;
    }

    public long getTotalDependencies() {
        return totalDependencies;
    }

    public void setTotalDependencies(long totalDependencies) {
        this.totalDependencies = totalDependencies;
    }
}