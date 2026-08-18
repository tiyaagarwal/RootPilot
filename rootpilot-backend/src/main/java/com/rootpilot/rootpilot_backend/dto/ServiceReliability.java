package com.rootpilot.rootpilot_backend.dto;

public class ServiceReliability {

    private String serviceName;
    private long incidentCount;
    private int reliabilityScore;
    private double availabilityPercentage;
    private double sloTarget;
    private String sloStatus;
    private String riskLevel;

    public ServiceReliability(
            String serviceName,
            long incidentCount,
            int reliabilityScore,
            double availabilityPercentage,
            double sloTarget,
            String sloStatus,
            String riskLevel) {

        this.serviceName = serviceName;
        this.incidentCount = incidentCount;
        this.reliabilityScore = reliabilityScore;
        this.availabilityPercentage = availabilityPercentage;
        this.sloTarget = sloTarget;
        this.sloStatus = sloStatus;
        this.riskLevel = riskLevel;
    }

    public String getServiceName() {
        return serviceName;
    }

    public long getIncidentCount() {
        return incidentCount;
    }

    public int getReliabilityScore() {
        return reliabilityScore;
    }

    public double getAvailabilityPercentage() {
        return availabilityPercentage;
    }

    public double getSloTarget() {
        return sloTarget;
    }

    public String getSloStatus() {
        return sloStatus;
    }

    public String getRiskLevel() {
        return riskLevel;
    }
}