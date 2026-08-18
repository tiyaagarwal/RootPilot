package com.rootpilot.rootpilot_backend.dto;

public class AnomalyDetection {

    private String serviceName;
    private long incidentCount;
    private double averageCount;
    private double deviation;
    private double anomalyScore;
    private String anomalyLevel;
    private String reason;

    public AnomalyDetection(
            String serviceName,
            long incidentCount,
            double averageCount,
            double deviation,
            double anomalyScore,
            String anomalyLevel,
            String reason) {

        this.serviceName = serviceName;
        this.incidentCount = incidentCount;
        this.averageCount = averageCount;
        this.deviation = deviation;
        this.anomalyScore = anomalyScore;
        this.anomalyLevel = anomalyLevel;
        this.reason = reason;
    }

    public String getServiceName() {
        return serviceName;
    }

    public long getIncidentCount() {
        return incidentCount;
    }

    public double getAverageCount() {
        return averageCount;
    }

    public double getDeviation() {
        return deviation;
    }

    public double getAnomalyScore() {
        return anomalyScore;
    }

    public String getAnomalyLevel() {
        return anomalyLevel;
    }

    public String getReason() {
        return reason;
    }
}