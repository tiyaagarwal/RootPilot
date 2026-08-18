package com.rootpilot.rootpilot_backend.dto;

public class AnomalySummary {

    private int totalAnomalies;
    private String topAnomalyService;
    private double highestAnomalyScore;
    private int criticalAnomalies;

    public AnomalySummary(
            int totalAnomalies,
            String topAnomalyService,
            double highestAnomalyScore,
            int criticalAnomalies) {

        this.totalAnomalies = totalAnomalies;
        this.topAnomalyService = topAnomalyService;
        this.highestAnomalyScore = highestAnomalyScore;
        this.criticalAnomalies = criticalAnomalies;
    }

    public int getTotalAnomalies() {
        return totalAnomalies;
    }

    public String getTopAnomalyService() {
        return topAnomalyService;
    }

    public double getHighestAnomalyScore() {
        return highestAnomalyScore;
    }

    public int getCriticalAnomalies() {
        return criticalAnomalies;
    }
}