package com.rootpilot.rootpilot_backend.dto;

import java.util.List;
import java.util.Map;

public class CopilotContext {
    private int activeIncidentCount;
    private int criticalIncidentCount;
    private int openAnomalyCount;
    private int healthScore;
    private String systemStatus;
    private String highestRiskService;
    private int sloViolationCount;
    private List<String> criticalServices;
    private List<Map<String, Object>> activeIncidentsList;

    public CopilotContext() {}

    public CopilotContext(int activeIncidentCount, int criticalIncidentCount, int openAnomalyCount, int healthScore,
                          String systemStatus, String highestRiskService, int sloViolationCount,
                          List<String> criticalServices, List<Map<String, Object>> activeIncidentsList) {
        this.activeIncidentCount = activeIncidentCount;
        this.criticalIncidentCount = criticalIncidentCount;
        this.openAnomalyCount = openAnomalyCount;
        this.healthScore = healthScore;
        this.systemStatus = systemStatus;
        this.highestRiskService = highestRiskService;
        this.sloViolationCount = sloViolationCount;
        this.criticalServices = criticalServices;
        this.activeIncidentsList = activeIncidentsList;
    }

    public int getActiveIncidentCount() { return activeIncidentCount; }
    public int getCriticalIncidentCount() { return criticalIncidentCount; }
    public int getOpenAnomalyCount() { return openAnomalyCount; }
    public int getHealthScore() { return healthScore; }
    public String getSystemStatus() { return systemStatus; }
    public String getHighestRiskService() { return highestRiskService; }
    public int getSloViolationCount() { return sloViolationCount; }
    public List<String> getCriticalServices() { return criticalServices; }
    public List<Map<String, Object>> getActiveIncidentsList() { return activeIncidentsList; }
}
