package com.rootpilot.rootpilot_backend.dto;

import java.util.List;

public class OrchestratorDashboard {

    private List<AutonomousExecutionPlan> executionPlans;

    private OrchestratorSummary summary;

    private OrchestratorExecutiveSummary executiveSummary;

    public OrchestratorDashboard(
            List<AutonomousExecutionPlan> executionPlans,
            OrchestratorSummary summary,
            OrchestratorExecutiveSummary executiveSummary) {

        this.executionPlans = executionPlans;
        this.summary = summary;
        this.executiveSummary = executiveSummary;
    }

    public List<AutonomousExecutionPlan> getExecutionPlans() {
        return executionPlans;
    }

    public void setExecutionPlans(
            List<AutonomousExecutionPlan> executionPlans) {
        this.executionPlans = executionPlans;
    }

    public OrchestratorSummary getSummary() {
        return summary;
    }

    public void setSummary(OrchestratorSummary summary) {
        this.summary = summary;
    }

    public OrchestratorExecutiveSummary getExecutiveSummary() {
        return executiveSummary;
    }

    public void setExecutiveSummary(
            OrchestratorExecutiveSummary executiveSummary) {
        this.executiveSummary = executiveSummary;
    }
}