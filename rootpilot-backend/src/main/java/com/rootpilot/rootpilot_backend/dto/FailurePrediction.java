package com.rootpilot.rootpilot_backend.dto;

public class FailurePrediction {

    private String serviceName;
    private long incidentCount;
    private long alertCount;
    private long dependencyRisk;
    private double riskScore;
    private String predictedRisk;
    private String predictionReason;

    public FailurePrediction(
            String serviceName,
            long incidentCount,
            long alertCount,
            long dependencyRisk,
            double riskScore,
            String predictedRisk,
            String predictionReason) {

        this.serviceName = serviceName;
        this.incidentCount = incidentCount;
        this.alertCount = alertCount;
        this.dependencyRisk = dependencyRisk;
        this.riskScore = riskScore;
        this.predictedRisk = predictedRisk;
        this.predictionReason = predictionReason;
    }

    public String getServiceName() {
        return serviceName;
    }

    public long getIncidentCount() {
        return incidentCount;
    }

    public long getAlertCount() {
        return alertCount;
    }

    public long getDependencyRisk() {
        return dependencyRisk;
    }

    public double getRiskScore() {
        return riskScore;
    }

    public String getPredictedRisk() {
        return predictedRisk;
    }

    public String getPredictionReason() {
        return predictionReason;
    }
}