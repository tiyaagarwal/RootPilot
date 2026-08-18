package com.rootpilot.rootpilot_backend.dto;

import java.util.List;

public class AIOpsDashboard {

    private List<OperationalPriority> operationalPriorities;

    private AIOpsSummary aiOpsSummary;

    private AIOpsExecutiveSummary executiveSummary;

    public AIOpsDashboard(
            List<OperationalPriority> operationalPriorities,
            AIOpsSummary aiOpsSummary,
            AIOpsExecutiveSummary executiveSummary) {

        this.operationalPriorities = operationalPriorities;
        this.aiOpsSummary = aiOpsSummary;
        this.executiveSummary = executiveSummary;
    }

    public List<OperationalPriority> getOperationalPriorities() {
        return operationalPriorities;
    }

    public AIOpsSummary getAiOpsSummary() {
        return aiOpsSummary;
    }

    public AIOpsExecutiveSummary getExecutiveSummary() {
        return executiveSummary;
    }
}