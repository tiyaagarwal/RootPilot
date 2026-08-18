package com.rootpilot.rootpilot_backend.service;

import com.rootpilot.rootpilot_backend.dto.AutonomousExecutionPlan;
import com.rootpilot.rootpilot_backend.dto.OrchestratorDashboard;
import com.rootpilot.rootpilot_backend.dto.OrchestratorExecutiveSummary;
import com.rootpilot.rootpilot_backend.dto.OrchestratorSummary;
import com.rootpilot.rootpilot_backend.config.SafeRedisTemplate;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Set;

@Service
public class OrchestratorService {

    private final SafeRedisTemplate redisTemplate;

    public OrchestratorService(
            SafeRedisTemplate redisTemplate) {
        this.redisTemplate = redisTemplate;
    }

    public List<AutonomousExecutionPlan>
    getAutonomousExecutionPlans() {

        List<AutonomousExecutionPlan> plans =
                new ArrayList<>();

        Set<String> serviceKeys =
                redisTemplate.keys("service:*");

        if (serviceKeys == null || serviceKeys.isEmpty()) {
            return plans;
        }

        int index = 0;

        for (String key : serviceKeys) {

            String serviceName =
                    key.replace("service:", "");

            String recommendedAction;
            String executionStatus;
            String executionStrategy;

            boolean approvalRequired;

            double executionConfidence;

            boolean autonomousExecutionReady;

            switch (index % 4) {

                case 0 -> {

                    recommendedAction =
                            "Restart Service Instance";

                    executionStatus =
                            "READY";

                    executionStrategy =
                            "AUTONOMOUS";

                    approvalRequired = false;

                    executionConfidence = 92.0;

                    autonomousExecutionReady = true;
                }

                case 1 -> {

                    recommendedAction =
                            "Scale Service Resources";

                    executionStatus =
                            "PENDING_APPROVAL";

                    executionStrategy =
                            "HUMAN_APPROVAL";

                    approvalRequired = true;

                    executionConfidence = 84.0;

                    autonomousExecutionReady = false;
                }

                case 2 -> {

                    recommendedAction =
                            "Investigate Dependency Chain";

                    executionStatus =
                            "BLOCKED";

                    executionStrategy =
                            "MANUAL_INTERVENTION";

                    approvalRequired = true;

                    executionConfidence = 65.0;

                    autonomousExecutionReady = false;
                }

                default -> {

                    recommendedAction =
                            "Execute Recovery Workflow";

                    executionStatus =
                            "SIMULATED_EXECUTION";

                    executionStrategy =
                            "SIMULATION";

                    approvalRequired = false;

                    executionConfidence = 88.0;

                    autonomousExecutionReady = true;
                }
            }

            plans.add(
                    new AutonomousExecutionPlan(
                            serviceName,
                            recommendedAction,
                            executionStatus,
                            executionStrategy,
                            approvalRequired,
                            executionConfidence,
                            autonomousExecutionReady
                    )
            );

            index++;
        }

        return plans;
    }

    public OrchestratorSummary
    getOrchestratorSummary() {

        List<AutonomousExecutionPlan> plans =
                getAutonomousExecutionPlans();

        int totalExecutionPlans = plans.size();

        int readyPlans = 0;
        int pendingApprovalPlans = 0;
        int blockedPlans = 0;
        int simulatedExecutionPlans = 0;

        double confidenceTotal = 0;

        for (AutonomousExecutionPlan plan : plans) {

            confidenceTotal +=
                    plan.getExecutionConfidence();

            switch (plan.getExecutionStatus()) {

                case "READY" ->
                        readyPlans++;

                case "PENDING_APPROVAL" ->
                        pendingApprovalPlans++;

                case "BLOCKED" ->
                        blockedPlans++;

                case "SIMULATED_EXECUTION" ->
                        simulatedExecutionPlans++;
            }
        }

        double averageExecutionConfidence = 0;

        if (!plans.isEmpty()) {

            averageExecutionConfidence =
                    confidenceTotal / plans.size();
        }

        return new OrchestratorSummary(
                totalExecutionPlans,
                readyPlans,
                pendingApprovalPlans,
                blockedPlans,
                simulatedExecutionPlans,
                averageExecutionConfidence
        );
    }

    public OrchestratorExecutiveSummary
    getOrchestratorExecutiveSummary() {

        OrchestratorSummary summary =
                getOrchestratorSummary();

        String orchestratorHealth;

        if (summary.getReadyPlans()
                >= summary.getTotalExecutionPlans() * 0.70) {

            orchestratorHealth = "EXCELLENT";

        } else if (summary.getReadyPlans()
                >= summary.getTotalExecutionPlans() * 0.50) {

            orchestratorHealth = "GOOD";

        } else if (summary.getReadyPlans()
                >= summary.getTotalExecutionPlans() * 0.30) {

            orchestratorHealth = "MODERATE";

        } else {

            orchestratorHealth = "POOR";
        }

        String executionReadiness;

        if (summary.getReadyPlans()
                >= summary.getPendingApprovalPlans()) {

            executionReadiness =
                    "High autonomous execution readiness detected.";

        } else {

            executionReadiness =
                    "Limited autonomous execution readiness detected.";
        }

        String approvalRiskLevel;

        if (summary.getPendingApprovalPlans() <= 1) {

            approvalRiskLevel = "LOW";

        } else if (summary.getPendingApprovalPlans() <= 3) {

            approvalRiskLevel = "MEDIUM";

        } else {

            approvalRiskLevel = "HIGH";
        }

        String confidenceAssessment;

        if (summary.getAverageExecutionConfidence() >= 85) {

            confidenceAssessment =
                    "Execution confidence remains consistently high.";

        } else if (summary.getAverageExecutionConfidence() >= 70) {

            confidenceAssessment =
                    "Execution confidence remains acceptable.";

        } else {

            confidenceAssessment =
                    "Execution confidence requires improvement.";
        }

        String executiveRecommendation;

        if ("EXCELLENT".equals(orchestratorHealth)
                && "LOW".equals(approvalRiskLevel)) {

            executiveRecommendation =
                    "Proceed with phased autonomous execution rollout.";

        } else if ("GOOD".equals(orchestratorHealth)) {

            executiveRecommendation =
                    "Expand automation coverage gradually.";

        } else {

            executiveRecommendation =
                    "Improve automation maturity before rollout.";
        }

        return new OrchestratorExecutiveSummary(
                orchestratorHealth,
                executionReadiness,
                approvalRiskLevel,
                confidenceAssessment,
                executiveRecommendation
        );
    }

    public OrchestratorDashboard
    getOrchestratorDashboard() {

        List<AutonomousExecutionPlan> executionPlans =
                getAutonomousExecutionPlans();

        OrchestratorSummary summary =
                getOrchestratorSummary();

        OrchestratorExecutiveSummary executiveSummary =
                getOrchestratorExecutiveSummary();

        return new OrchestratorDashboard(
                executionPlans,
                summary,
                executiveSummary
        );
    }
}