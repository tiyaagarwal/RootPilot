package com.rootpilot.rootpilot_backend.service;

import com.rootpilot.rootpilot_backend.dto.AutomationReadiness;
import com.rootpilot.rootpilot_backend.dto.AutomationReadinessDashboard;
import com.rootpilot.rootpilot_backend.dto.AutomationReadinessExecutiveSummary;
import com.rootpilot.rootpilot_backend.dto.AutomationReadinessSummary;
import com.rootpilot.rootpilot_backend.config.SafeRedisTemplate;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Set;

@Service
public class AutomationReadinessService {

    private final SafeRedisTemplate redisTemplate;

    public AutomationReadinessService(
            SafeRedisTemplate redisTemplate) {

        this.redisTemplate = redisTemplate;
    }

    public List<AutomationReadiness> getAutomationReadiness() {

        List<AutomationReadiness> readinessList =
                new ArrayList<>();

        Set<String> serviceKeys =
                redisTemplate.keys("service:*");

        if (serviceKeys == null || serviceKeys.isEmpty()) {
            return readinessList;
        }

        for (String serviceKey : serviceKeys) {

            String serviceName =
                    serviceKey.replace("service:", "");

            Object countObject =
                    redisTemplate.opsForValue()
                            .get(serviceKey);

            long incidentCount = 0;

            if (countObject instanceof Number number) {
                incidentCount = number.longValue();
            }

            String recommendedAction;
            String automationRisk;
            double executionConfidence;
            boolean rollbackReady;
            boolean approvalRequired;
            boolean autonomousExecutionReady;

            if (incidentCount >= 100) {

                recommendedAction = "Manual Investigation";

                automationRisk = "HIGH";

                executionConfidence = 35.0;

                rollbackReady = false;

                approvalRequired = true;

                autonomousExecutionReady = false;

            } else if (incidentCount >= 50) {

                recommendedAction = "Scale Service";

                automationRisk = "MEDIUM";

                executionConfidence = 70.0;

                rollbackReady = true;

                approvalRequired = true;

                autonomousExecutionReady = false;

            } else {

                recommendedAction = "Restart Service";

                automationRisk = "LOW";

                executionConfidence = 90.0;

                rollbackReady = true;

                approvalRequired = false;

                autonomousExecutionReady = true;
            }

            readinessList.add(
                    new AutomationReadiness(
                            serviceName,
                            recommendedAction,
                            automationRisk,
                            executionConfidence,
                            rollbackReady,
                            approvalRequired,
                            autonomousExecutionReady
                    )
            );
        }

        return readinessList;
    }
    public AutomationReadinessSummary getAutomationReadinessSummary() {

        List<AutomationReadiness> readinessList =
                getAutomationReadiness();

        int totalRecommendations =
                readinessList.size();

        int autonomousReadyCount = 0;

        int approvalRequiredCount = 0;

        int rollbackReadyCount = 0;

        double confidenceTotal = 0;

        String highestRiskService = "N/A";

        int highestRiskScore = 0;

        for (AutomationReadiness readiness : readinessList) {

            if (readiness.isAutonomousExecutionReady()) {
                autonomousReadyCount++;
            }

            if (readiness.isApprovalRequired()) {
                approvalRequiredCount++;
            }

            if (readiness.isRollbackReady()) {
                rollbackReadyCount++;
            }

            confidenceTotal +=
                    readiness.getExecutionConfidence();

            int riskScore = 1;

            if ("MEDIUM".equalsIgnoreCase(
                    readiness.getAutomationRisk())) {

                riskScore = 2;

            } else if ("HIGH".equalsIgnoreCase(
                    readiness.getAutomationRisk())) {

                riskScore = 3;
            }

            if (riskScore > highestRiskScore) {

                highestRiskScore = riskScore;

                highestRiskService =
                        readiness.getServiceName();
            }
        }

        double averageExecutionConfidence = 0;

        if (!readinessList.isEmpty()) {

            averageExecutionConfidence =
                    confidenceTotal / readinessList.size();
        }

        double overallAutomationReadinessScore = 0;

        if (totalRecommendations > 0) {

            overallAutomationReadinessScore =
                    ((double) autonomousReadyCount
                            / totalRecommendations) * 100.0;
        }

        return new AutomationReadinessSummary(
                totalRecommendations,
                autonomousReadyCount,
                approvalRequiredCount,
                rollbackReadyCount,
                averageExecutionConfidence,
                highestRiskService,
                overallAutomationReadinessScore
        );
    }
    public AutomationReadinessExecutiveSummary
    getAutomationReadinessExecutiveSummary() {

        AutomationReadinessSummary summary =
                getAutomationReadinessSummary();

        double readinessScore =
                summary.getOverallAutomationReadinessScore();

        String automationMaturity;

        if (readinessScore >= 90) {

            automationMaturity = "AUTONOMOUS";

        } else if (readinessScore >= 75) {

            automationMaturity = "ADVANCED";

        } else if (readinessScore >= 50) {

            automationMaturity = "DEVELOPING";

        } else {

            automationMaturity = "EARLY_STAGE";
        }

        double autonomousCoverage =
                readinessScore;

        String topAutomationRisk =
                summary.getHighestRiskService();

        String executiveRecommendation;

        if (readinessScore >= 80) {

            executiveRecommendation =
                    "Expand autonomous remediation across low-risk services";

        } else if (readinessScore >= 60) {

            executiveRecommendation =
                    "Increase automation coverage with approval workflows";

        } else {

            executiveRecommendation =
                    "Focus on reducing automation risk before expansion";
        }

        String platformAutomationGrade;

        if (readinessScore >= 90) {

            platformAutomationGrade = "A";

        } else if (readinessScore >= 80) {

            platformAutomationGrade = "B";

        } else if (readinessScore >= 70) {

            platformAutomationGrade = "C";

        } else if (readinessScore >= 60) {

            platformAutomationGrade = "D";

        } else {

            platformAutomationGrade = "F";
        }

        return new AutomationReadinessExecutiveSummary(
                automationMaturity,
                autonomousCoverage,
                topAutomationRisk,
                executiveRecommendation,
                platformAutomationGrade
        );
    }
    public AutomationReadinessDashboard
    getAutomationReadinessDashboard() {

        AutomationReadinessSummary summary =
                getAutomationReadinessSummary();

        AutomationReadinessExecutiveSummary executiveSummary =
                getAutomationReadinessExecutiveSummary();

        return new AutomationReadinessDashboard(
                summary.getTotalRecommendations(),
                summary.getAutonomousReadyCount(),
                summary.getApprovalRequiredCount(),
                summary.getAverageExecutionConfidence(),
                summary.getOverallAutomationReadinessScore(),
                executiveSummary.getAutomationMaturity(),
                executiveSummary.getPlatformAutomationGrade(),
                executiveSummary.getTopAutomationRisk()
        );
    }
}