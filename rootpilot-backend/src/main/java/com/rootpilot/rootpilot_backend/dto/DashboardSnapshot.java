package com.rootpilot.rootpilot_backend.dto;

public class DashboardSnapshot {

    private LiveDashboard dashboard;
    private int healthScore;
    private String systemStatus;
    private String liveSummary;
    private String topDependency;

    private String highestDependencyRisk;

    public DashboardSnapshot(
            LiveDashboard dashboard,
            int healthScore,
            String systemStatus,
            String liveSummary) {

        this.dashboard = dashboard;
        this.healthScore = healthScore;
        this.systemStatus = systemStatus;
        this.liveSummary = liveSummary;
    }

    public LiveDashboard getDashboard() {
        return dashboard;
    }

    public int getHealthScore() {
        return healthScore;
    }

    public String getSystemStatus() {
        return systemStatus;
    }

    public String getLiveSummary() {
        return liveSummary;
    }
}