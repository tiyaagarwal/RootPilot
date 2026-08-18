package com.rootpilot.rootpilot_backend.dto;

public class PredictionSummary {

    private int totalPredictions;
    private String topRiskService;
    private double highestRiskScore;
    private int criticalServices;

    public PredictionSummary(
            int totalPredictions,
            String topRiskService,
            double highestRiskScore,
            int criticalServices) {

        this.totalPredictions = totalPredictions;
        this.topRiskService = topRiskService;
        this.highestRiskScore = highestRiskScore;
        this.criticalServices = criticalServices;
    }

    public int getTotalPredictions() {
        return totalPredictions;
    }

    public String getTopRiskService() {
        return topRiskService;
    }

    public double getHighestRiskScore() {
        return highestRiskScore;
    }

    public int getCriticalServices() {
        return criticalServices;
    }
}