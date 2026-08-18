package com.rootpilot.rootpilot_backend.dto;

public class DependencyRiskDashboard {

    private int totalDependencies;
    private int highImpactDependencies;
    private String mostCriticalService;
    private String highestRiskLevel;
    private String dependencyHealth;
    private String executiveRecommendation;

    public DependencyRiskDashboard(
            int totalDependencies,
            int highImpactDependencies,
            String mostCriticalService,
            String highestRiskLevel,
            String dependencyHealth,
            String executiveRecommendation) {

        this.totalDependencies = totalDependencies;
        this.highImpactDependencies = highImpactDependencies;
        this.mostCriticalService = mostCriticalService;
        this.highestRiskLevel = highestRiskLevel;
        this.dependencyHealth = dependencyHealth;
        this.executiveRecommendation = executiveRecommendation;
    }

    public int getTotalDependencies() {
        return totalDependencies;
    }

    public void setTotalDependencies(int totalDependencies) {
        this.totalDependencies = totalDependencies;
    }

    public int getHighImpactDependencies() {
        return highImpactDependencies;
    }

    public void setHighImpactDependencies(int highImpactDependencies) {
        this.highImpactDependencies = highImpactDependencies;
    }

    public String getMostCriticalService() {
        return mostCriticalService;
    }

    public void setMostCriticalService(String mostCriticalService) {
        this.mostCriticalService = mostCriticalService;
    }

    public String getHighestRiskLevel() {
        return highestRiskLevel;
    }

    public void setHighestRiskLevel(String highestRiskLevel) {
        this.highestRiskLevel = highestRiskLevel;
    }

    public String getDependencyHealth() {
        return dependencyHealth;
    }

    public void setDependencyHealth(String dependencyHealth) {
        this.dependencyHealth = dependencyHealth;
    }

    public String getExecutiveRecommendation() {
        return executiveRecommendation;
    }

    public void setExecutiveRecommendation(String executiveRecommendation) {
        this.executiveRecommendation = executiveRecommendation;
    }
}