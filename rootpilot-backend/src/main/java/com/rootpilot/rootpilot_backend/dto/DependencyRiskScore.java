package com.rootpilot.rootpilot_backend.dto;

public class DependencyRiskScore {

    private String service;
    private int impactScore;
    private String riskLevel;

    public DependencyRiskScore(
            String service,
            int impactScore,
            String riskLevel) {

        this.service = service;
        this.impactScore = impactScore;
        this.riskLevel = riskLevel;
    }

    public String getService() {
        return service;
    }

    public void setService(String service) {
        this.service = service;
    }

    public int getImpactScore() {
        return impactScore;
    }

    public void setImpactScore(int impactScore) {
        this.impactScore = impactScore;
    }

    public String getRiskLevel() {
        return riskLevel;
    }

    public void setRiskLevel(String riskLevel) {
        this.riskLevel = riskLevel;
    }
}