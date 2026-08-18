package com.rootpilot.rootpilot_backend.dto;

public class ServiceResilience {

    private String serviceName;
    private int resilienceScore;
    private String riskLevel;
    private String recommendedAction;

    public ServiceResilience(
            String serviceName,
            int resilienceScore,
            String riskLevel,
            String recommendedAction) {

        this.serviceName = serviceName;
        this.resilienceScore = resilienceScore;
        this.riskLevel = riskLevel;
        this.recommendedAction = recommendedAction;
    }

    public String getServiceName() {
        return serviceName;
    }

    public int getResilienceScore() {
        return resilienceScore;
    }

    public String getRiskLevel() {
        return riskLevel;
    }

    public String getRecommendedAction() {
        return recommendedAction;
    }

    public void setServiceName(String serviceName) {
        this.serviceName = serviceName;
    }

    public void setResilienceScore(int resilienceScore) {
        this.resilienceScore = resilienceScore;
    }

    public void setRiskLevel(String riskLevel) {
        this.riskLevel = riskLevel;
    }

    public void setRecommendedAction(String recommendedAction) {
        this.recommendedAction = recommendedAction;
    }
}