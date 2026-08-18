package com.rootpilot.rootpilot_backend.dto;

public class RootCauseRecommendation {

    private String serviceName;
    private String exceptionName;
    private long incidentCount;
    private String riskLevel;
    private String recommendation;
    private String priority;
    private String reason;

    public RootCauseRecommendation(
            String serviceName,
            String exceptionName,
            long incidentCount,
            String riskLevel,
            String recommendation,
            String priority,
            String reason) {

        this.serviceName = serviceName;
        this.exceptionName = exceptionName;
        this.incidentCount = incidentCount;
        this.riskLevel = riskLevel;
        this.recommendation = recommendation;
        this.priority = priority;
        this.reason = reason;
    }

    public String getServiceName() {
        return serviceName;
    }

    public String getExceptionName() {
        return exceptionName;
    }

    public long getIncidentCount() {
        return incidentCount;
    }

    public String getRiskLevel() {
        return riskLevel;
    }

    public String getRecommendation() {
        return recommendation;
    }

    public String getPriority() {
        return priority;
    }

    public String getReason() {
        return reason;
    }
}