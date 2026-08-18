package com.rootpilot.rootpilot_backend.dto;

public class AutomationReadiness {

    private String serviceName;
    private String recommendedAction;
    private String automationRisk;
    private double executionConfidence;
    private boolean rollbackReady;
    private boolean approvalRequired;
    private boolean autonomousExecutionReady;

    public AutomationReadiness(
            String serviceName,
            String recommendedAction,
            String automationRisk,
            double executionConfidence,
            boolean rollbackReady,
            boolean approvalRequired,
            boolean autonomousExecutionReady) {

        this.serviceName = serviceName;
        this.recommendedAction = recommendedAction;
        this.automationRisk = automationRisk;
        this.executionConfidence = executionConfidence;
        this.rollbackReady = rollbackReady;
        this.approvalRequired = approvalRequired;
        this.autonomousExecutionReady = autonomousExecutionReady;
    }

    public String getServiceName() {
        return serviceName;
    }

    public String getRecommendedAction() {
        return recommendedAction;
    }

    public String getAutomationRisk() {
        return automationRisk;
    }

    public double getExecutionConfidence() {
        return executionConfidence;
    }

    public boolean isRollbackReady() {
        return rollbackReady;
    }

    public boolean isApprovalRequired() {
        return approvalRequired;
    }

    public boolean isAutonomousExecutionReady() {
        return autonomousExecutionReady;
    }
}