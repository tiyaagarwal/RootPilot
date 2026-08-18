package com.rootpilot.rootpilot_backend.dto;

public class RecommendationSummary {

    private int totalRecommendations;
    private String topRecommendationService;
    private int criticalRecommendations;
    private String highestPriority;

    public RecommendationSummary(
            int totalRecommendations,
            String topRecommendationService,
            int criticalRecommendations,
            String highestPriority) {

        this.totalRecommendations = totalRecommendations;
        this.topRecommendationService = topRecommendationService;
        this.criticalRecommendations = criticalRecommendations;
        this.highestPriority = highestPriority;
    }

    public int getTotalRecommendations() {
        return totalRecommendations;
    }

    public String getTopRecommendationService() {
        return topRecommendationService;
    }

    public int getCriticalRecommendations() {
        return criticalRecommendations;
    }

    public String getHighestPriority() {
        return highestPriority;
    }
}