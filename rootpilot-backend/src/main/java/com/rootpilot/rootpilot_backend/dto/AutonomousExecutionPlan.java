package com.rootpilot.rootpilot_backend.dto;

public class AutonomousExecutionPlan {

    private String serviceName;

    private String recommendedAction;

    private String executionStatus;

    private String executionStrategy;

    private boolean approvalRequired;

    private double executionConfidence;

    private boolean autonomousExecutionReady;

    public AutonomousExecutionPlan(
            String serviceName,
            String recommendedAction,
            String executionStatus,
            String executionStrategy,
            boolean approvalRequired,
            double executionConfidence,
            boolean autonomousExecutionReady) {

        this.serviceName = serviceName;
        this.recommendedAction = recommendedAction;
        this.executionStatus = executionStatus;
        this.executionStrategy = executionStrategy;
        this.approvalRequired = approvalRequired;
        this.executionConfidence = executionConfidence;
        this.autonomousExecutionReady = autonomousExecutionReady;
    }

    public String getServiceName() {
        return serviceName;
    }

    public void setServiceName(String serviceName) {
        this.serviceName = serviceName;
    }

    public String getRecommendedAction() {
        return recommendedAction;
    }

    public void setRecommendedAction(String recommendedAction) {
        this.recommendedAction = recommendedAction;
    }

    public String getExecutionStatus() {
        return executionStatus;
    }

    public void setExecutionStatus(String executionStatus) {
        this.executionStatus = executionStatus;
    }

    public String getExecutionStrategy() {
        return executionStrategy;
    }

    public void setExecutionStrategy(String executionStrategy) {
        this.executionStrategy = executionStrategy;
    }

    public boolean isApprovalRequired() {
        return approvalRequired;
    }

    public void setApprovalRequired(boolean approvalRequired) {
        this.approvalRequired = approvalRequired;
    }

    public double getExecutionConfidence() {
        return executionConfidence;
    }

    public void setExecutionConfidence(double executionConfidence) {
        this.executionConfidence = executionConfidence;
    }

    public boolean isAutonomousExecutionReady() {
        return autonomousExecutionReady;
    }

    public void setAutonomousExecutionReady(boolean autonomousExecutionReady) {
        this.autonomousExecutionReady = autonomousExecutionReady;
    }
}