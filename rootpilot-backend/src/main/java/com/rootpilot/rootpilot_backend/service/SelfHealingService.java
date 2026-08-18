package com.rootpilot.rootpilot_backend.service;

import com.rootpilot.rootpilot_backend.dto.SelfHealingDashboard;
import com.rootpilot.rootpilot_backend.dto.SelfHealingExecutiveSummary;
import com.rootpilot.rootpilot_backend.dto.SelfHealingRecommendation;
import com.rootpilot.rootpilot_backend.dto.SelfHealingSummary;
import com.rootpilot.rootpilot_backend.config.SafeRedisTemplate;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class SelfHealingService {

    private final SafeRedisTemplate redisTemplate;

    public SelfHealingService(
            SafeRedisTemplate redisTemplate) {

        this.redisTemplate = redisTemplate;
    }

    public List<SelfHealingRecommendation>
    getSelfHealingRecommendations() {

        List<SelfHealingRecommendation> recommendations =
                new ArrayList<>();

        Set<String> serviceKeys =
                redisTemplate.keys("service:*");

        if (serviceKeys == null) {
            return recommendations;
        }

        for (String key : serviceKeys) {

            Object value =
                    redisTemplate.opsForValue()
                            .get(key);

            long incidentCount = 0;

            if (value instanceof Number number) {
                incidentCount = number.longValue();
            }

            String serviceName =
                    key.replace("service:", "");

            String action;
            String priority;
            String triggerReason;
            boolean automationEligible;

            if (incidentCount >= 50) {

                action = "Restart Service";
                priority = "HIGH";
                triggerReason =
                        "Critical incident volume detected";
                automationEligible = true;

            } else if (incidentCount >= 20) {

                action = "Scale Service";
                priority = "HIGH";
                triggerReason =
                        "High incident volume detected";
                automationEligible = true;

            } else if (incidentCount >= 5) {

                action = "Recycle Resources";
                priority = "MEDIUM";
                triggerReason =
                        "Moderate incident volume detected";
                automationEligible = true;

            } else {

                action = "Monitor Service";
                priority = "LOW";
                triggerReason =
                        "Low incident volume";
                automationEligible = false;
            }

            recommendations.add(
                    new SelfHealingRecommendation(
                            serviceName,
                            action,
                            priority,
                            triggerReason,
                            automationEligible
                    )
            );
        }

        return recommendations;
    }
    public SelfHealingSummary getSelfHealingSummary() {

        List<SelfHealingRecommendation> recommendations =
                getSelfHealingRecommendations();

        int totalRecommendations =
                recommendations.size();

        int automationEligibleCount = 0;

        int criticalActions = 0;

        Map<String, Integer> actionCounts =
                new HashMap<>();

        for (SelfHealingRecommendation recommendation
                : recommendations) {

            if (recommendation.isAutomationEligible()) {
                automationEligibleCount++;
            }

            if ("HIGH".equalsIgnoreCase(
                    recommendation.getPriority())) {

                criticalActions++;
            }

            actionCounts.merge(
                    recommendation.getAction(),
                    1,
                    Integer::sum
            );
        }

        String topRecommendedAction = "N/A";

        int maxCount = 0;

        for (Map.Entry<String, Integer> entry
                : actionCounts.entrySet()) {

            if (entry.getValue() > maxCount) {

                maxCount = entry.getValue();

                topRecommendedAction =
                        entry.getKey();
            }
        }

        double averageAutomationReadiness = 0.0;

        if (totalRecommendations > 0) {

            averageAutomationReadiness =
                    ((double) automationEligibleCount
                            / totalRecommendations) * 100.0;
        }

        return new SelfHealingSummary(
                totalRecommendations,
                automationEligibleCount,
                criticalActions,
                topRecommendedAction,
                averageAutomationReadiness
        );
    }
    public SelfHealingExecutiveSummary
    getSelfHealingExecutiveSummary() {

        SelfHealingSummary summary =
                getSelfHealingSummary();

        double overallAutomationReadiness =
                summary.getAverageAutomationReadiness();

        double automationCoverage =
                summary.getAverageAutomationReadiness();

        String selfHealingMaturity;

        if (overallAutomationReadiness >= 80) {

            selfHealingMaturity = "ADVANCED";

        } else if (overallAutomationReadiness >= 50) {

            selfHealingMaturity = "GROWING";

        } else {

            selfHealingMaturity = "EARLY";
        }

        String highestPriorityAction =
                summary.getTopRecommendedAction();

        String executiveRecommendation;

        if (overallAutomationReadiness >= 80) {

            executiveRecommendation =
                    "Expand autonomous remediation across all critical services.";

        } else if (overallAutomationReadiness >= 50) {

            executiveRecommendation =
                    "Increase automation coverage for recurring incidents.";

        } else {

            executiveRecommendation =
                    "Focus on automating high-frequency remediation workflows.";
        }

        return new SelfHealingExecutiveSummary(
                overallAutomationReadiness,
                selfHealingMaturity,
                highestPriorityAction,
                automationCoverage,
                executiveRecommendation
        );
    }
    public SelfHealingDashboard getSelfHealingDashboard() {

        return new SelfHealingDashboard(
                getSelfHealingRecommendations(),
                getSelfHealingSummary(),
                getSelfHealingExecutiveSummary()
        );
    }
}