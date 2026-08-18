package com.rootpilot.rootpilot_backend.dto;

public class DependencyImpactExecutiveSummary {

    private String dependencyHealth;
    private String highestRiskService;
    private String blastRadiusRisk;
    private String businessImpactLevel;
    private String executiveRecommendation;

    public DependencyImpactExecutiveSummary(
            String dependencyHealth,
            String highestRiskService,
            String blastRadiusRisk,
            String businessImpactLevel,
            String executiveRecommendation) {

        this.dependencyHealth = dependencyHealth;
        this.highestRiskService = highestRiskService;
        this.blastRadiusRisk = blastRadiusRisk;
        this.businessImpactLevel = businessImpactLevel;
        this.executiveRecommendation = executiveRecommendation;
    }

    public String getDependencyHealth() {
        return dependencyHealth;
    }

    public void setDependencyHealth(String dependencyHealth) {
        this.dependencyHealth = dependencyHealth;
    }

    public String getHighestRiskService() {
        return highestRiskService;
    }

    public void setHighestRiskService(String highestRiskService) {
        this.highestRiskService = highestRiskService;
    }

    public String getBlastRadiusRisk() {
        return blastRadiusRisk;
    }

    public void setBlastRadiusRisk(String blastRadiusRisk) {
        this.blastRadiusRisk = blastRadiusRisk;
    }

    public String getBusinessImpactLevel() {
        return businessImpactLevel;
    }

    public void setBusinessImpactLevel(String businessImpactLevel) {
        this.businessImpactLevel = businessImpactLevel;
    }

    public String getExecutiveRecommendation() {
        return executiveRecommendation;
    }

    public void setExecutiveRecommendation(String executiveRecommendation) {
        this.executiveRecommendation = executiveRecommendation;
    }
}