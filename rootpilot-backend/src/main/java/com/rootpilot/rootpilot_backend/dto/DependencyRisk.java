package com.rootpilot.rootpilot_backend.dto;

public class DependencyRisk {

    private String sourceService;
    private String targetService;
    private long dependencyCount;
    private String riskLevel;

    public DependencyRisk() {
    }

    public DependencyRisk(
            String sourceService,
            String targetService,
            long dependencyCount,
            String riskLevel) {

        this.sourceService = sourceService;
        this.targetService = targetService;
        this.dependencyCount = dependencyCount;
        this.riskLevel = riskLevel;
    }

    public String getSourceService() {
        return sourceService;
    }

    public void setSourceService(String sourceService) {
        this.sourceService = sourceService;
    }

    public String getTargetService() {
        return targetService;
    }

    public void setTargetService(String targetService) {
        this.targetService = targetService;
    }

    public long getDependencyCount() {
        return dependencyCount;
    }

    public void setDependencyCount(long dependencyCount) {
        this.dependencyCount = dependencyCount;
    }

    public String getRiskLevel() {
        return riskLevel;
    }

    public void setRiskLevel(String riskLevel) {
        this.riskLevel = riskLevel;
    }
}