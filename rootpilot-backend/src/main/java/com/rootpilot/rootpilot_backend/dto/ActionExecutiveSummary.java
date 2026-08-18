package com.rootpilot.rootpilot_backend.dto;

public class ActionExecutiveSummary {

    private String summary;

    public ActionExecutiveSummary(String summary) {
        this.summary = summary;
    }

    public String getSummary() {
        return summary;
    }

    public void setSummary(String summary) {
        this.summary = summary;
    }
}