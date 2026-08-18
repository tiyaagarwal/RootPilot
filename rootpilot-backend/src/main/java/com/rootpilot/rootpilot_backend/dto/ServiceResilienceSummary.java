package com.rootpilot.rootpilot_backend.dto;

public class ServiceResilienceSummary {

    private int totalServices;
    private int lowRiskServices;
    private int mediumRiskServices;
    private int highRiskServices;
    private int criticalRiskServices;
    private String mostResilientService;
    private String leastResilientService;
    private double averageResilienceScore;

    public ServiceResilienceSummary(
            int totalServices,
            int lowRiskServices,
            int mediumRiskServices,
            int highRiskServices,
            int criticalRiskServices,
            String mostResilientService,
            String leastResilientService,
            double averageResilienceScore) {

        this.totalServices = totalServices;
        this.lowRiskServices = lowRiskServices;
        this.mediumRiskServices = mediumRiskServices;
        this.highRiskServices = highRiskServices;
        this.criticalRiskServices = criticalRiskServices;
        this.mostResilientService = mostResilientService;
        this.leastResilientService = leastResilientService;
        this.averageResilienceScore = averageResilienceScore;
    }

    public int getTotalServices() {
        return totalServices;
    }

    public int getLowRiskServices() {
        return lowRiskServices;
    }

    public int getMediumRiskServices() {
        return mediumRiskServices;
    }

    public int getHighRiskServices() {
        return highRiskServices;
    }

    public int getCriticalRiskServices() {
        return criticalRiskServices;
    }

    public String getMostResilientService() {
        return mostResilientService;
    }

    public String getLeastResilientService() {
        return leastResilientService;
    }

    public double getAverageResilienceScore() {
        return averageResilienceScore;
    }

    public void setTotalServices(int totalServices) {
        this.totalServices = totalServices;
    }

    public void setLowRiskServices(int lowRiskServices) {
        this.lowRiskServices = lowRiskServices;
    }

    public void setMediumRiskServices(int mediumRiskServices) {
        this.mediumRiskServices = mediumRiskServices;
    }

    public void setHighRiskServices(int highRiskServices) {
        this.highRiskServices = highRiskServices;
    }

    public void setCriticalRiskServices(int criticalRiskServices) {
        this.criticalRiskServices = criticalRiskServices;
    }

    public void setMostResilientService(String mostResilientService) {
        this.mostResilientService = mostResilientService;
    }

    public void setLeastResilientService(String leastResilientService) {
        this.leastResilientService = leastResilientService;
    }

    public void setAverageResilienceScore(double averageResilienceScore) {
        this.averageResilienceScore = averageResilienceScore;
    }
}