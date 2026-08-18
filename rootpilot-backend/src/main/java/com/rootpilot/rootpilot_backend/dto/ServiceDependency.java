package com.rootpilot.rootpilot_backend.dto;

public class ServiceDependency {

    private String sourceService;
    private String targetService;
    private long dependencyCount;

    public ServiceDependency() {
    }

    public ServiceDependency(
            String sourceService,
            String targetService,
            long dependencyCount) {

        this.sourceService = sourceService;
        this.targetService = targetService;
        this.dependencyCount = dependencyCount;
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
}