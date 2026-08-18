package com.rootpilot.rootpilot_backend.dto;

public class OperationalPriority {

    private String serviceName;

    private String priorityLevel;

    private String recommendedAction;

    private String businessImpact;

    private String executionUrgency;

    private double operationalScore;

    public OperationalPriority(
            String serviceName,
            String priorityLevel,
            String recommendedAction,
            String businessImpact,
            String executionUrgency,
            double operationalScore) {

        this.serviceName = serviceName;
        this.priorityLevel = priorityLevel;
        this.recommendedAction = recommendedAction;
        this.businessImpact = businessImpact;
        this.executionUrgency = executionUrgency;
        this.operationalScore = operationalScore;
    }

    public String getServiceName() {
        return serviceName;
    }

    public String getPriorityLevel() {
        return priorityLevel;
    }

    public String getRecommendedAction() {
        return recommendedAction;
    }

    public String getBusinessImpact() {
        return businessImpact;
    }

    public String getExecutionUrgency() {
        return executionUrgency;
    }

    public double getOperationalScore() {
        return operationalScore;
    }
}