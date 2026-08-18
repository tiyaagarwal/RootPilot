package com.rootpilot.rootpilot_backend.dto;

public class ResilienceRecommendation {

    private String serviceName;
    private String recommendation;
    private String priority;
    private int expectedResilienceImprovement;
    private String justification;

    public ResilienceRecommendation(
            String serviceName,
            String recommendation,
            String priority,
            int expectedResilienceImprovement,
            String justification) {

        this.serviceName = serviceName;
        this.recommendation = recommendation;
        this.priority = priority;
        this.expectedResilienceImprovement = expectedResilienceImprovement;
        this.justification = justification;
    }

    public String getServiceName() {
        return serviceName;
    }

    public String getRecommendation() {
        return recommendation;
    }

    public String getPriority() {
        return priority;
    }

    public int getExpectedResilienceImprovement() {
        return expectedResilienceImprovement;
    }

    public String getJustification() {
        return justification;
    }

    public void setServiceName(String serviceName) {
        this.serviceName = serviceName;
    }

    public void setRecommendation(String recommendation) {
        this.recommendation = recommendation;
    }

    public void setPriority(String priority) {
        this.priority = priority;
    }

    public void setExpectedResilienceImprovement(int expectedResilienceImprovement) {
        this.expectedResilienceImprovement = expectedResilienceImprovement;
    }

    public void setJustification(String justification) {
        this.justification = justification;
    }
}