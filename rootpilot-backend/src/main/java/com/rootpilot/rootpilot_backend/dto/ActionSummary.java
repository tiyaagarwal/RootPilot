package com.rootpilot.rootpilot_backend.dto;

public class ActionSummary {

    private int totalActions;
    private int criticalActions;
    private int pendingActions;
    private String topActionType;

    public ActionSummary(
            int totalActions,
            int criticalActions,
            int pendingActions,
            String topActionType) {

        this.totalActions = totalActions;
        this.criticalActions = criticalActions;
        this.pendingActions = pendingActions;
        this.topActionType = topActionType;
    }

    public int getTotalActions() {
        return totalActions;
    }

    public void setTotalActions(int totalActions) {
        this.totalActions = totalActions;
    }

    public int getCriticalActions() {
        return criticalActions;
    }

    public void setCriticalActions(int criticalActions) {
        this.criticalActions = criticalActions;
    }

    public int getPendingActions() {
        return pendingActions;
    }

    public void setPendingActions(int pendingActions) {
        this.pendingActions = pendingActions;
    }

    public String getTopActionType() {
        return topActionType;
    }

    public void setTopActionType(String topActionType) {
        this.topActionType = topActionType;
    }
}