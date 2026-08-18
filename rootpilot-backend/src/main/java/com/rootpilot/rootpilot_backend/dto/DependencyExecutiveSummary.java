package com.rootpilot.rootpilot_backend.dto;

public class DependencyExecutiveSummary {

    private String summary;

    public DependencyExecutiveSummary() {
    }

    public DependencyExecutiveSummary(String summary) {
        this.summary = summary;
    }

    public String getSummary() {
        return summary;
    }

    public void setSummary(String summary) {
        this.summary = summary;
    }
}