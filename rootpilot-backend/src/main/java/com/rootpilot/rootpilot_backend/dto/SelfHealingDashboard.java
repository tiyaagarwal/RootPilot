package com.rootpilot.rootpilot_backend.dto;

import java.util.List;

public class SelfHealingDashboard {

    private List<SelfHealingRecommendation> recommendations;
    private SelfHealingSummary summary;
    private SelfHealingExecutiveSummary executiveSummary;

    public SelfHealingDashboard(
            List<SelfHealingRecommendation> recommendations,
            SelfHealingSummary summary,
            SelfHealingExecutiveSummary executiveSummary) {

        this.recommendations = recommendations;
        this.summary = summary;
        this.executiveSummary = executiveSummary;
    }

    public List<SelfHealingRecommendation> getRecommendations() {
        return recommendations;
    }

    public void setRecommendations(
            List<SelfHealingRecommendation> recommendations) {
        this.recommendations = recommendations;
    }

    public SelfHealingSummary getSummary() {
        return summary;
    }

    public void setSummary(SelfHealingSummary summary) {
        this.summary = summary;
    }

    public SelfHealingExecutiveSummary getExecutiveSummary() {
        return executiveSummary;
    }

    public void setExecutiveSummary(
            SelfHealingExecutiveSummary executiveSummary) {
        this.executiveSummary = executiveSummary;
    }
}