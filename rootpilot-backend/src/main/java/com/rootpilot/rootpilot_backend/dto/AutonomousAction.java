package com.rootpilot.rootpilot_backend.dto;

public class AutonomousAction {

    private String actionType;
    private String serviceName;
    private String triggerSource;
    private String severity;
    private String recommendedAction;
    private String status;
    private String reason;

    public AutonomousAction(
            String actionType,
            String serviceName,
            String triggerSource,
            String severity,
            String recommendedAction,
            String status,
            String reason) {

        this.actionType = actionType;
        this.serviceName = serviceName;
        this.triggerSource = triggerSource;
        this.severity = severity;
        this.recommendedAction = recommendedAction;
        this.status = status;
        this.reason = reason;
    }

    public String getActionType() {
        return actionType;
    }

    public String getServiceName() {
        return serviceName;
    }

    public void setActionType(String actionType) {
        this.actionType = actionType;
    }

    public String getTriggerSource() {
        return triggerSource;
    }

    public void setTriggerSource(String triggerSource) {
        this.triggerSource = triggerSource;
    }

    public String getSeverity() {
        return severity;
    }

    public void setSeverity(String severity) {
        this.severity = severity;
    }

    public String getRecommendedAction() {
        return recommendedAction;
    }

    public void setRecommendedAction(String recommendedAction) {
        this.recommendedAction = recommendedAction;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getReason() {
        return reason;
    }

    public void setReason(String reason) {
        this.reason = reason;
    }
    
    public void setServiceName(String serviceName) {
        this.serviceName = serviceName;
    }
}