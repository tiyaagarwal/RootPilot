package com.rootpilot.rootpilot_backend.dto;

public class OrchestratorSummary {

    private int totalExecutionPlans;

    private int readyPlans;

    private int pendingApprovalPlans;

    private int blockedPlans;

    private int simulatedExecutionPlans;

    private double averageExecutionConfidence;

    public OrchestratorSummary(
            int totalExecutionPlans,
            int readyPlans,
            int pendingApprovalPlans,
            int blockedPlans,
            int simulatedExecutionPlans,
            double averageExecutionConfidence) {

        this.totalExecutionPlans = totalExecutionPlans;
        this.readyPlans = readyPlans;
        this.pendingApprovalPlans = pendingApprovalPlans;
        this.blockedPlans = blockedPlans;
        this.simulatedExecutionPlans = simulatedExecutionPlans;
        this.averageExecutionConfidence = averageExecutionConfidence;
    }

    public int getTotalExecutionPlans() {
        return totalExecutionPlans;
    }

    public void setTotalExecutionPlans(int totalExecutionPlans) {
        this.totalExecutionPlans = totalExecutionPlans;
    }

    public int getReadyPlans() {
        return readyPlans;
    }

    public void setReadyPlans(int readyPlans) {
        this.readyPlans = readyPlans;
    }

    public int getPendingApprovalPlans() {
        return pendingApprovalPlans;
    }

    public void setPendingApprovalPlans(int pendingApprovalPlans) {
        this.pendingApprovalPlans = pendingApprovalPlans;
    }

    public int getBlockedPlans() {
        return blockedPlans;
    }

    public void setBlockedPlans(int blockedPlans) {
        this.blockedPlans = blockedPlans;
    }

    public int getSimulatedExecutionPlans() {
        return simulatedExecutionPlans;
    }

    public void setSimulatedExecutionPlans(int simulatedExecutionPlans) {
        this.simulatedExecutionPlans = simulatedExecutionPlans;
    }

    public double getAverageExecutionConfidence() {
        return averageExecutionConfidence;
    }

    public void setAverageExecutionConfidence(double averageExecutionConfidence) {
        this.averageExecutionConfidence = averageExecutionConfidence;
    }
}