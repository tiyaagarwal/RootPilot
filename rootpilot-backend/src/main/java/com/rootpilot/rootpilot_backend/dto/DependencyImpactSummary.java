package com.rootpilot.rootpilot_backend.dto;

public class DependencyImpactSummary {

    private int totalDependencies;
    private int highImpactDependencies;
    private String mostCriticalService;
    private double averageImpactScore;

    public DependencyImpactSummary(
            int totalDependencies,
            int highImpactDependencies,
            String mostCriticalService,
            double averageImpactScore) {

        this.totalDependencies = totalDependencies;
        this.highImpactDependencies = highImpactDependencies;
        this.mostCriticalService = mostCriticalService;
        this.averageImpactScore = averageImpactScore;
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

    public double getAverageImpactScore() {
        return averageImpactScore;
    }

    public void setAverageImpactScore(double averageImpactScore) {
        this.averageImpactScore = averageImpactScore;
    }
}