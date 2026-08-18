package com.rootpilot.rootpilot_backend.dto;

public class ResilienceDashboard {

    private double platformResilienceScore;
    private String resilienceStatus;
    private String mostVulnerableService;
    private String strongestService;
    private int criticalServicesCount;
    private int totalRecommendations;
    private String topRecommendation;

    public ResilienceDashboard(
            double platformResilienceScore,
            String resilienceStatus,
            String mostVulnerableService,
            String strongestService,
            int criticalServicesCount,
            int totalRecommendations,
            String topRecommendation) {

        this.platformResilienceScore = platformResilienceScore;
        this.resilienceStatus = resilienceStatus;
        this.mostVulnerableService = mostVulnerableService;
        this.strongestService = strongestService;
        this.criticalServicesCount = criticalServicesCount;
        this.totalRecommendations = totalRecommendations;
        this.topRecommendation = topRecommendation;
    }

    public double getPlatformResilienceScore() {
        return platformResilienceScore;
    }

    public String getResilienceStatus() {
        return resilienceStatus;
    }

    public String getMostVulnerableService() {
        return mostVulnerableService;
    }

    public String getStrongestService() {
        return strongestService;
    }

    public int getCriticalServicesCount() {
        return criticalServicesCount;
    }

    public int getTotalRecommendations() {
        return totalRecommendations;
    }

    public String getTopRecommendation() {
        return topRecommendation;
    }

    public void setPlatformResilienceScore(double platformResilienceScore) {
        this.platformResilienceScore = platformResilienceScore;
    }

    public void setResilienceStatus(String resilienceStatus) {
        this.resilienceStatus = resilienceStatus;
    }

    public void setMostVulnerableService(String mostVulnerableService) {
        this.mostVulnerableService = mostVulnerableService;
    }

    public void setStrongestService(String strongestService) {
        this.strongestService = strongestService;
    }

    public void setCriticalServicesCount(int criticalServicesCount) {
        this.criticalServicesCount = criticalServicesCount;
    }

    public void setTotalRecommendations(int totalRecommendations) {
        this.totalRecommendations = totalRecommendations;
    }

    public void setTopRecommendation(String topRecommendation) {
        this.topRecommendation = topRecommendation;
    }
}