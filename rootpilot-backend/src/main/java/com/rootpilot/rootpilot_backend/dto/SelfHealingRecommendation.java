package com.rootpilot.rootpilot_backend.dto;

public class SelfHealingRecommendation {

    private String serviceName;
    private String action;
    private String priority;
    private String triggerReason;
    private boolean automationEligible;

    public SelfHealingRecommendation(
            String serviceName,
            String action,
            String priority,
            String triggerReason,
            boolean automationEligible) {

        this.serviceName = serviceName;
        this.action = action;
        this.priority = priority;
        this.triggerReason = triggerReason;
        this.automationEligible = automationEligible;
    }

    public String getServiceName() {
        return serviceName;
    }

    public String getAction() {
        return action;
    }

    public String getPriority() {
        return priority;
    }

    public String getTriggerReason() {
        return triggerReason;
    }

    public boolean isAutomationEligible() {
        return automationEligible;
    }

    public void setServiceName(String serviceName) {
        this.serviceName = serviceName;
    }

    public void setAction(String action) {
        this.action = action;
    }

    public void setPriority(String priority) {
        this.priority = priority;
    }

    public void setTriggerReason(String triggerReason) {
        this.triggerReason = triggerReason;
    }

    public void setAutomationEligible(boolean automationEligible) {
        this.automationEligible = automationEligible;
    }
}