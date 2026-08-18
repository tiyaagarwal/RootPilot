package com.rootpilot.rootpilot_backend.dto;

public class AIOpsSummary {

    private int totalPriorities;

    private int criticalPriorities;

    private int highPriorities;

    private int servicesRequiringAction;

    private double averageOperationalScore;

    private double operationalReadinessScore;

    private String topPriorityService;

    public AIOpsSummary(
            int totalPriorities,
            int criticalPriorities,
            int highPriorities,
            int servicesRequiringAction,
            double averageOperationalScore,
            double operationalReadinessScore,
            String topPriorityService) {

        this.totalPriorities = totalPriorities;
        this.criticalPriorities = criticalPriorities;
        this.highPriorities = highPriorities;
        this.servicesRequiringAction = servicesRequiringAction;
        this.averageOperationalScore = averageOperationalScore;
        this.operationalReadinessScore = operationalReadinessScore;
        this.topPriorityService = topPriorityService;
    }

    public int getTotalPriorities() {
        return totalPriorities;
    }

    public int getCriticalPriorities() {
        return criticalPriorities;
    }

    public int getHighPriorities() {
        return highPriorities;
    }

    public int getServicesRequiringAction() {
        return servicesRequiringAction;
    }

    public double getAverageOperationalScore() {
        return averageOperationalScore;
    }

    public double getOperationalReadinessScore() {
        return operationalReadinessScore;
    }

    public String getTopPriorityService() {
        return topPriorityService;
    }
}