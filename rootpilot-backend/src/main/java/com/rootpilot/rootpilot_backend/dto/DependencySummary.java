package com.rootpilot.rootpilot_backend.dto;

public class DependencySummary {

    private long totalDependencies;
    private long uniqueDependencies;

    private String topSourceService;
    private String topTargetService;

    private long topDependencyCount;

    public DependencySummary() {
    }

    public DependencySummary(
            long totalDependencies,
            long uniqueDependencies,
            String topSourceService,
            String topTargetService,
            long topDependencyCount) {

        this.totalDependencies = totalDependencies;
        this.uniqueDependencies = uniqueDependencies;
        this.topSourceService = topSourceService;
        this.topTargetService = topTargetService;
        this.topDependencyCount = topDependencyCount;
    }

    public long getTotalDependencies() {
        return totalDependencies;
    }

    public void setTotalDependencies(long totalDependencies) {
        this.totalDependencies = totalDependencies;
    }

    public long getUniqueDependencies() {
        return uniqueDependencies;
    }

    public void setUniqueDependencies(long uniqueDependencies) {
        this.uniqueDependencies = uniqueDependencies;
    }

    public String getTopSourceService() {
        return topSourceService;
    }

    public void setTopSourceService(String topSourceService) {
        this.topSourceService = topSourceService;
    }

    public String getTopTargetService() {
        return topTargetService;
    }

    public void setTopTargetService(String topTargetService) {
        this.topTargetService = topTargetService;
    }

    public long getTopDependencyCount() {
        return topDependencyCount;
    }

    public void setTopDependencyCount(long topDependencyCount) {
        this.topDependencyCount = topDependencyCount;
    }
}