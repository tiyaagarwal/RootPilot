package com.rootpilot.rootpilot_backend.dto;

public class ServiceResilienceExecutiveSummary {

    private double platformResilienceScore;
    private String resilienceStatus;
    private String mostVulnerableService;
    private String strongestService;
    private String topRecommendation;
    private int criticalServicesCount;
    private String executiveAssessment;

    public ServiceResilienceExecutiveSummary(
            double platformResilienceScore,
            String resilienceStatus,
            String mostVulnerableService,
            String strongestService,
            String topRecommendation,
            int criticalServicesCount,
            String executiveAssessment) {

        this.platformResilienceScore = platformResilienceScore;
        this.resilienceStatus = resilienceStatus;
        this.mostVulnerableService = mostVulnerableService;
        this.strongestService = strongestService;
        this.topRecommendation = topRecommendation;
        this.criticalServicesCount = criticalServicesCount;
        this.executiveAssessment = executiveAssessment;
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

    public String getTopRecommendation() {
        return topRecommendation;
    }

    public int getCriticalServicesCount() {
        return criticalServicesCount;
    }

    public String getExecutiveAssessment() {
        return executiveAssessment;
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

    public void setTopRecommendation(String topRecommendation) {
        this.topRecommendation = topRecommendation;
    }

    public void setCriticalServicesCount(int criticalServicesCount) {
        this.criticalServicesCount = criticalServicesCount;
    }

    public void setExecutiveAssessment(String executiveAssessment) {
        this.executiveAssessment = executiveAssessment;
    }
}