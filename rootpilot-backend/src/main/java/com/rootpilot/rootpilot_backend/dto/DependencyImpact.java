package com.rootpilot.rootpilot_backend.dto;

public class DependencyImpact {

    private String sourceService;
    private String impactedService;
    private String impactLevel;
    private int impactScore;

    public DependencyImpact(
            String sourceService,
            String impactedService,
            String impactLevel,
            int impactScore) {

        this.sourceService = sourceService;
        this.impactedService = impactedService;
        this.impactLevel = impactLevel;
        this.impactScore = impactScore;
    }

    public String getSourceService() {
        return sourceService;
    }

    public void setSourceService(String sourceService) {
        this.sourceService = sourceService;
    }

    public String getImpactedService() {
        return impactedService;
    }

    public void setImpactedService(String impactedService) {
        this.impactedService = impactedService;
    }

    public String getImpactLevel() {
        return impactLevel;
    }

    public void setImpactLevel(String impactLevel) {
        this.impactLevel = impactLevel;
    }

    public int getImpactScore() {
        return impactScore;
    }

    public void setImpactScore(int impactScore) {
        this.impactScore = impactScore;
    }
}