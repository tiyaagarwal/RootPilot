package com.rootpilot.rootpilot_backend.dto;

public class CascadeFailure {

    private String sourceService;
    private String middleService;
    private String targetService;

    public CascadeFailure() {
    }

    public CascadeFailure(
            String sourceService,
            String middleService,
            String targetService) {

        this.sourceService = sourceService;
        this.middleService = middleService;
        this.targetService = targetService;
    }

    public String getSourceService() {
        return sourceService;
    }

    public void setSourceService(String sourceService) {
        this.sourceService = sourceService;
    }

    public String getMiddleService() {
        return middleService;
    }

    public void setMiddleService(String middleService) {
        this.middleService = middleService;
    }

    public String getTargetService() {
        return targetService;
    }

    public void setTargetService(String targetService) {
        this.targetService = targetService;
    }
}