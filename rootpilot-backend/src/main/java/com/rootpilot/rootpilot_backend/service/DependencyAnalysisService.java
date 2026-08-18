package com.rootpilot.rootpilot_backend.service;

import com.rootpilot.rootpilot_backend.dto.*;
import com.rootpilot.rootpilot_backend.config.SafeRedisTemplate;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Set;

@Service
public class DependencyAnalysisService {

    private final SafeRedisTemplate redisTemplate;

    public DependencyAnalysisService(
            SafeRedisTemplate redisTemplate) {

        this.redisTemplate = redisTemplate;
    }

    public List<DependencyImpact> getDependencyImpacts() {

        List<DependencyImpact> impacts = new ArrayList<>();

        Set<String> correlationKeys =
                redisTemplate.keys("correlation:*");

        if (correlationKeys == null) {
            return impacts;
        }

        for (String key : correlationKeys) {

            String[] parts = key.split(":");

            if (parts.length < 3) {
                continue;
            }

            String sourceService = parts[1];
            String dependentService = parts[2];

            Object value =
                    redisTemplate.opsForValue().get(key);

            int dependencyStrength = 0;

            if (value instanceof Number number) {
                dependencyStrength = number.intValue();
            }

            int blastRadius = dependencyStrength;

            String riskLevel;

            if (blastRadius >= 50) {
                riskLevel = "CRITICAL";
            } else if (blastRadius >= 20) {
                riskLevel = "HIGH";
            } else if (blastRadius >= 10) {
                riskLevel = "MEDIUM";
            } else {
                riskLevel = "LOW";
            }

            impacts.add(
                    new DependencyImpact(
                            sourceService,
                            dependentService,
                            riskLevel,
                            blastRadius
                    )
            );
        }

        return impacts;
    }
    public DependencyImpactSummary getDependencyImpactSummary() {

        List<DependencyImpact> impacts =
                getDependencyImpacts();

        int totalDependencies = impacts.size();

        int highImpactDependencies = 0;

        String mostCriticalService = "N/A";

        int highestImpactScore = 0;

        int totalImpactScore = 0;

        for (DependencyImpact impact : impacts) {

            totalImpactScore += impact.getImpactScore();

            if ("CRITICAL".equalsIgnoreCase(
                    impact.getImpactLevel())) {

                highImpactDependencies++;
            }

            if (impact.getImpactScore() >
                    highestImpactScore) {

                highestImpactScore =
                        impact.getImpactScore();

                mostCriticalService =
                        impact.getSourceService();
            }
        }

        double averageImpactScore = 0;

        if (!impacts.isEmpty()) {

            averageImpactScore =
                    (double) totalImpactScore
                            / impacts.size();
        }

        return new DependencyImpactSummary(
                totalDependencies,
                highImpactDependencies,
                mostCriticalService,
                averageImpactScore
        );
    }
    public DependencyImpactExecutiveSummary
    getDependencyImpactExecutiveSummary() {

        DependencyImpactSummary summary =
                getDependencyImpactSummary();

        String dependencyHealth;

        if (summary.getHighImpactDependencies() >= 20) {

            dependencyHealth = "POOR";

        } else if (summary.getHighImpactDependencies() >= 10) {

            dependencyHealth = "FAIR";

        } else {

            dependencyHealth = "HEALTHY";
        }

        String blastRadiusRisk;

        if (summary.getAverageImpactScore() >= 50) {

            blastRadiusRisk = "CRITICAL";

        } else if (summary.getAverageImpactScore() >= 25) {

            blastRadiusRisk = "HIGH";

        } else {

            blastRadiusRisk = "MODERATE";
        }

        String businessImpactLevel;

        if ("CRITICAL".equals(blastRadiusRisk)) {

            businessImpactLevel = "SEVERE";

        } else if ("HIGH".equals(blastRadiusRisk)) {

            businessImpactLevel = "SIGNIFICANT";

        } else {

            businessImpactLevel = "MANAGEABLE";
        }

        String executiveRecommendation;

        if ("POOR".equals(dependencyHealth)) {

            executiveRecommendation =
                    "Reduce dependency concentration and improve service resilience.";

        } else if ("FAIR".equals(dependencyHealth)) {

            executiveRecommendation =
                    "Review critical dependency chains and introduce redundancy.";

        } else {

            executiveRecommendation =
                    "Dependency ecosystem is healthy. Continue monitoring.";
        }

        return new DependencyImpactExecutiveSummary(
                dependencyHealth,
                summary.getMostCriticalService(),
                blastRadiusRisk,
                businessImpactLevel,
                executiveRecommendation
        );
    }
    public List<DependencyRiskScore> getDependencyRiskScores() {

        List<DependencyImpact> impacts =
                getDependencyImpacts();

        List<DependencyRiskScore> scores =
                new ArrayList<>();

        for (DependencyImpact impact : impacts) {

            String riskLevel;

            if (impact.getImpactScore() >= 50) {

                riskLevel = "CRITICAL";

            } else if (impact.getImpactScore() >= 25) {

                riskLevel = "HIGH";

            } else if (impact.getImpactScore() >= 10) {

                riskLevel = "MEDIUM";

            } else {

                riskLevel = "LOW";
            }

            scores.add(
                    new DependencyRiskScore(
                            impact.getSourceService(),
                            impact.getImpactScore(),
                            riskLevel
                    )
            );
        }

        scores.sort(
                (a, b) ->
                        Integer.compare(
                                b.getImpactScore(),
                                a.getImpactScore()
                        )
        );

        return scores;
    }
    public DependencyRiskDashboard getDependencyRiskDashboard() {

        DependencyImpactSummary summary =
                getDependencyImpactSummary();

        DependencyImpactExecutiveSummary executiveSummary =
                getDependencyImpactExecutiveSummary();

        String highestRiskLevel = "LOW";

        if (summary.getHighImpactDependencies() >= 20) {

            highestRiskLevel = "CRITICAL";

        } else if (summary.getHighImpactDependencies() >= 10) {

            highestRiskLevel = "HIGH";
        }

        return new DependencyRiskDashboard(
                summary.getTotalDependencies(),
                summary.getHighImpactDependencies(),
                summary.getMostCriticalService(),
                highestRiskLevel,
                executiveSummary.getDependencyHealth(),
                executiveSummary.getExecutiveRecommendation()
        );
    }
}