package com.rootpilot.rootpilot_backend.service;

import com.rootpilot.rootpilot_backend.dto.*;
import com.rootpilot.rootpilot_backend.config.SafeRedisTemplate;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Set;

@Service
public class ResilienceIntelligenceService {

    private final SafeRedisTemplate redisTemplate;

    public ResilienceIntelligenceService(
            SafeRedisTemplate redisTemplate) {

        this.redisTemplate = redisTemplate;
    }

    public List<ServiceResilience> getServiceResilience() {

        List<ServiceResilience> resiliences =
                new ArrayList<>();

        Set<String> serviceKeys =
                redisTemplate.keys("service:*");

        if (serviceKeys == null) {
            return resiliences;
        }

        for (String serviceKey : serviceKeys) {

            String serviceName =
                    serviceKey.replace("service:", "");

            int resilienceScore =
                    calculateResilienceScore(serviceName);

            String riskLevel =
                    determineRiskLevel(resilienceScore);

            String recommendedAction =
                    determineRecommendedAction(riskLevel);

            resiliences.add(
                    new ServiceResilience(
                            serviceName,
                            resilienceScore,
                            riskLevel,
                            recommendedAction
                    )
            );
        }

        return resiliences;
    }

    private int calculateResilienceScore(
            String serviceName) {

        int score = 100;

        Object incidentCount =
                redisTemplate.opsForValue()
                        .get("serviceIncidentCount:" + serviceName);

        if (incidentCount instanceof Number number) {
            score -= (number.intValue() * 2);
        }

        Object anomalyScore =
                redisTemplate.opsForValue()
                        .get("anomalyScore:" + serviceName);

        if (anomalyScore instanceof Number number) {
            score -= number.intValue();
        }

        Object predictionScore =
                redisTemplate.opsForValue()
                        .get("failurePredictionScore:" + serviceName);

        if (predictionScore instanceof Number number) {
            score -= number.intValue();
        }

        Object dependencyRisk =
                redisTemplate.opsForValue()
                        .get("dependencyRisk:" + serviceName);

        if (dependencyRisk instanceof Number number) {
            score -= number.intValue();
        }

        Object criticality =
                redisTemplate.opsForValue()
                        .get("serviceCriticality:" + serviceName);

        if (criticality instanceof Number number) {
            score -= number.intValue();
        }

        if (score < 0) {
            score = 0;
        }

        if (score > 100) {
            score = 100;
        }

        return score;
    }

    private String determineRiskLevel(
            int resilienceScore) {

        if (resilienceScore >= 80) {
            return "LOW";
        }

        if (resilienceScore >= 60) {
            return "MEDIUM";
        }

        if (resilienceScore >= 40) {
            return "HIGH";
        }

        return "CRITICAL";
    }

    private String determineRecommendedAction(
            String riskLevel) {

        return switch (riskLevel) {

            case "CRITICAL" ->
                    "Immediate scaling and failover implementation";

            case "HIGH" ->
                    "Add redundancy and increase monitoring";

            case "MEDIUM" ->
                    "Review dependencies and optimize capacity";

            default ->
                    "No immediate action required";
        };
    }
    public ServiceResilienceSummary getServiceResilienceSummary() {

        List<ServiceResilience> resiliences =
                getServiceResilience();

        if (resiliences.isEmpty()) {

            return new ServiceResilienceSummary(
                    0,
                    0,
                    0,
                    0,
                    0,
                    "N/A",
                    "N/A",
                    0.0
            );
        }

        int lowRisk = 0;
        int mediumRisk = 0;
        int highRisk = 0;
        int criticalRisk = 0;

        int totalScore = 0;

        ServiceResilience strongest =
                resiliences.get(0);

        ServiceResilience weakest =
                resiliences.get(0);

        for (ServiceResilience resilience : resiliences) {

            totalScore += resilience.getResilienceScore();

            switch (resilience.getRiskLevel()) {

                case "LOW" -> lowRisk++;

                case "MEDIUM" -> mediumRisk++;

                case "HIGH" -> highRisk++;

                case "CRITICAL" -> criticalRisk++;
            }

            if (resilience.getResilienceScore()
                    > strongest.getResilienceScore()) {

                strongest = resilience;
            }

            if (resilience.getResilienceScore()
                    < weakest.getResilienceScore()) {

                weakest = resilience;
            }
        }

        double averageScore =
                (double) totalScore / resiliences.size();

        return new ServiceResilienceSummary(
                resiliences.size(),
                lowRisk,
                mediumRisk,
                highRisk,
                criticalRisk,
                strongest.getServiceName(),
                weakest.getServiceName(),
                averageScore
        );
    }
    public ServiceResilienceExecutiveSummary
    getServiceResilienceExecutiveSummary() {

        ServiceResilienceSummary summary =
                getServiceResilienceSummary();

        double platformResilienceScore =
                summary.getAverageResilienceScore();

        String resilienceStatus;

        if (platformResilienceScore >= 80) {
            resilienceStatus = "LOW";
        }
        else if (platformResilienceScore >= 60) {
            resilienceStatus = "MEDIUM";
        }
        else if (platformResilienceScore >= 40) {
            resilienceStatus = "HIGH";
        }
        else {
            resilienceStatus = "CRITICAL";
        }

        String topRecommendation;

        switch (resilienceStatus) {

            case "CRITICAL" ->
                    topRecommendation =
                            "Immediate resilience remediation required";

            case "HIGH" ->
                    topRecommendation =
                            "Prioritize redundancy and scaling";

            case "MEDIUM" ->
                    topRecommendation =
                            "Optimize dependencies and monitoring";

            default ->
                    topRecommendation =
                            "Maintain current resilience posture";
        }

        String executiveAssessment =
                buildExecutiveAssessment(
                        resilienceStatus,
                        summary.getCriticalRiskServices()
                );

        return new ServiceResilienceExecutiveSummary(
                platformResilienceScore,
                resilienceStatus,
                summary.getLeastResilientService(),
                summary.getMostResilientService(),
                topRecommendation,
                summary.getCriticalRiskServices(),
                executiveAssessment
        );
    }
    private String buildExecutiveAssessment(
            String resilienceStatus,
            int criticalServices) {

        return switch (resilienceStatus) {

            case "CRITICAL" ->
                    "Platform resilience is critically degraded. Immediate intervention is required.";

            case "HIGH" ->
                    "Platform resilience is under pressure. High-risk services should be addressed.";

            case "MEDIUM" ->
                    "Platform resilience is acceptable but improvement opportunities exist.";

            default ->
                    "Platform resilience is strong and operating within acceptable thresholds.";
        };
    }
    public List<ResilienceRecommendation>
    getResilienceRecommendations() {

        List<ServiceResilience> resiliences =
                getServiceResilience();

        List<ResilienceRecommendation> recommendations =
                new ArrayList<>();

        for (ServiceResilience resilience : resiliences) {

            String recommendation =
                    determineRecommendation(
                            resilience.getRiskLevel());

            String priority =
                    determinePriority(
                            resilience.getRiskLevel());

            int expectedImprovement =
                    calculateExpectedImprovement(
                            resilience.getRiskLevel());

            String justification =
                    buildRecommendationJustification(
                            resilience);

            recommendations.add(
                    new ResilienceRecommendation(
                            resilience.getServiceName(),
                            recommendation,
                            priority,
                            expectedImprovement,
                            justification
                    )
            );
        }

        return recommendations;
    }
    private String determineRecommendation(
            String riskLevel) {

        return switch (riskLevel) {

            case "CRITICAL" ->
                    "Implement failover and immediate scaling";

            case "HIGH" ->
                    "Add redundancy and reduce dependency concentration";

            case "MEDIUM" ->
                    "Increase monitoring and optimize capacity";

            default ->
                    "Continue current operational strategy";
        };
    }
    private String determinePriority(
            String riskLevel) {

        return switch (riskLevel) {

            case "CRITICAL" -> "P1";

            case "HIGH" -> "P2";

            case "MEDIUM" -> "P3";

            default -> "P4";
        };
    }
    private int calculateExpectedImprovement(
            String riskLevel) {

        return switch (riskLevel) {

            case "CRITICAL" -> 30;

            case "HIGH" -> 20;

            case "MEDIUM" -> 10;

            default -> 5;
        };
    }
    private String buildRecommendationJustification(
            ServiceResilience resilience) {

        return "Service "
                + resilience.getServiceName()
                + " has resilience score "
                + resilience.getResilienceScore()
                + " and risk level "
                + resilience.getRiskLevel()
                + ".";
    }
    public ResilienceDashboard getResilienceDashboard() {

        ServiceResilienceExecutiveSummary executiveSummary =
                getServiceResilienceExecutiveSummary();

        List<ResilienceRecommendation> recommendations =
                getResilienceRecommendations();

        return new ResilienceDashboard(
                executiveSummary.getPlatformResilienceScore(),
                executiveSummary.getResilienceStatus(),
                executiveSummary.getMostVulnerableService(),
                executiveSummary.getStrongestService(),
                executiveSummary.getCriticalServicesCount(),
                recommendations.size(),
                recommendations.isEmpty()
                        ? "No recommendations available"
                        : recommendations.get(0).getRecommendation()
        );
    }

}