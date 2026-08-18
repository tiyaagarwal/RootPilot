package com.rootpilot.rootpilot_backend.service;

import com.rootpilot.rootpilot_backend.dto.AIOpsDashboard;
import com.rootpilot.rootpilot_backend.dto.AIOpsExecutiveSummary;
import com.rootpilot.rootpilot_backend.dto.AIOpsSummary;
import com.rootpilot.rootpilot_backend.dto.OperationalPriority;
import com.rootpilot.rootpilot_backend.config.SafeRedisTemplate;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Set;

@Service
public class AIOpsCommandCenterService {

    private final SafeRedisTemplate redisTemplate;

    public AIOpsCommandCenterService(
            SafeRedisTemplate redisTemplate) {

        this.redisTemplate = redisTemplate;
    }

    public List<OperationalPriority> getOperationalPriorities() {

        List<OperationalPriority> priorities = new ArrayList<>();

        Set<String> serviceKeys =
                redisTemplate.keys("service:*");

        if (serviceKeys == null || serviceKeys.isEmpty()) {
            return priorities;
        }

        for (String key : serviceKeys) {

            String serviceName =
                    key.replace("service:", "");

            Object value =
                    redisTemplate.opsForValue().get(key);

            long incidentCount = 0;

            if (value instanceof Number number) {
                incidentCount = number.longValue();
            }

            String priorityLevel;
            String recommendedAction;
            String businessImpact;
            String executionUrgency;
            double operationalScore;

            if (incidentCount >= 50) {

                priorityLevel = "CRITICAL";
                recommendedAction = "Approve Automated Remediation";
                businessImpact = "Revenue Risk";
                executionUrgency = "Immediate";
                operationalScore = 95.0;

            } else if (incidentCount >= 20) {

                priorityLevel = "HIGH";
                recommendedAction = "Investigate Service Stability";
                businessImpact = "Customer Impact";
                executionUrgency = "Within 1 Hour";
                operationalScore = 80.0;

            } else if (incidentCount >= 5) {

                priorityLevel = "MEDIUM";
                recommendedAction = "Monitor Service";
                businessImpact = "Performance Degradation";
                executionUrgency = "Today";
                operationalScore = 60.0;

            } else {

                priorityLevel = "LOW";
                recommendedAction = "Continue Monitoring";
                businessImpact = "Minimal Impact";
                executionUrgency = "Monitor";
                operationalScore = 35.0;
            }

            priorities.add(
                    new OperationalPriority(
                            serviceName,
                            priorityLevel,
                            recommendedAction,
                            businessImpact,
                            executionUrgency,
                            operationalScore
                    )
            );
        }

        return priorities;
    }

    public AIOpsSummary getAIOpsSummary() {

        List<OperationalPriority> priorities =
                getOperationalPriorities();

        if (priorities.isEmpty()) {

            return new AIOpsSummary(
                    0,
                    0,
                    0,
                    0,
                    0.0,
                    100.0,
                    "None"
            );
        }

        int criticalPriorities = 0;
        int highPriorities = 0;
        int servicesRequiringAction = 0;

        double totalScore = 0;

        String topPriorityService = "None";
        double highestScore = -1;

        for (OperationalPriority priority : priorities) {

            totalScore += priority.getOperationalScore();

            if ("CRITICAL".equals(priority.getPriorityLevel())) {
                criticalPriorities++;
                servicesRequiringAction++;
            }

            if ("HIGH".equals(priority.getPriorityLevel())) {
                highPriorities++;
                servicesRequiringAction++;
            }

            if (priority.getOperationalScore() > highestScore) {

                highestScore =
                        priority.getOperationalScore();

                topPriorityService =
                        priority.getServiceName();
            }
        }

        double averageOperationalScore =
                totalScore / priorities.size();

        double operationalReadinessScore =
                Math.max(
                        0,
                        100 - ((criticalPriorities * 10)
                                + (highPriorities * 5))
                );

        return new AIOpsSummary(
                priorities.size(),
                criticalPriorities,
                highPriorities,
                servicesRequiringAction,
                averageOperationalScore,
                operationalReadinessScore,
                topPriorityService
        );
    }
    public AIOpsExecutiveSummary getAIOpsExecutiveSummary() {

        AIOpsSummary summary =
                getAIOpsSummary();

        String operationalStatus;

        if (summary.getCriticalPriorities() >= 3) {

            operationalStatus =
                    "Critical Attention Required";

        } else if (summary.getHighPriorities() >= 3) {

            operationalStatus =
                    "Elevated Risk";

        } else {

            operationalStatus =
                    "Operationally Healthy";
        }

        String keyRiskArea =
                summary.getTopPriorityService();

        String recommendedFocus;

        if (summary.getCriticalPriorities() > 0) {

            recommendedFocus =
                    "Prioritize Critical Services";

        } else if (summary.getHighPriorities() > 0) {

            recommendedFocus =
                    "Investigate High-Risk Services";

        } else {

            recommendedFocus =
                    "Continue Operational Monitoring";
        }

        String automationReadinessAssessment;

        if (summary.getOperationalReadinessScore() >= 90) {

            automationReadinessAssessment =
                    "Fully Ready";

        } else if (summary.getOperationalReadinessScore() >= 75) {

            automationReadinessAssessment =
                    "Ready With Monitoring";

        } else {

            automationReadinessAssessment =
                    "Manual Intervention Required";
        }

        String executiveRecommendation;

        if (summary.getCriticalPriorities() > 0) {

            executiveRecommendation =
                    "Approve remediation for critical operational risks.";

        } else if (summary.getHighPriorities() > 0) {

            executiveRecommendation =
                    "Focus on high-priority service stabilization.";

        } else {

            executiveRecommendation =
                    "Maintain current operational strategy.";
        }

        return new AIOpsExecutiveSummary(
                operationalStatus,
                keyRiskArea,
                recommendedFocus,
                automationReadinessAssessment,
                executiveRecommendation
        );
    }
    public AIOpsDashboard getAIOpsDashboard() {

        List<OperationalPriority> priorities =
                getOperationalPriorities();

        AIOpsSummary summary =
                getAIOpsSummary();

        AIOpsExecutiveSummary executiveSummary =
                getAIOpsExecutiveSummary();

        return new AIOpsDashboard(
                priorities,
                summary,
                executiveSummary
        );
    }
}