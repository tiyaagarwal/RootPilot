package com.rootpilot.rootpilot_backend.controller;

import com.rootpilot.rootpilot_backend.dto.*;
import com.rootpilot.rootpilot_backend.service.DependencyAnalysisService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/analysis")
public class DependencyAnalysisController {

    private final DependencyAnalysisService dependencyAnalysisService;

    public DependencyAnalysisController(
            DependencyAnalysisService dependencyAnalysisService) {

        this.dependencyAnalysisService = dependencyAnalysisService;
    }

    @GetMapping("/dependency-impacts")
    public List<DependencyImpact> getDependencyImpacts() {

        return dependencyAnalysisService.getDependencyImpacts();
    }

    @GetMapping("/dependency-impact-summary")
    public DependencyImpactSummary getDependencyImpactSummary() {

        return dependencyAnalysisService.getDependencyImpactSummary();
    }

    @GetMapping("/dependency-impact-executive-summary")
    public DependencyImpactExecutiveSummary
    getDependencyImpactExecutiveSummary() {

        return dependencyAnalysisService
                .getDependencyImpactExecutiveSummary();
    }
    @GetMapping("/dependency-risk-scores")
    public List<DependencyRiskScore> getDependencyRiskScores() {

        return dependencyAnalysisService
                .getDependencyRiskScores();
    }
    @GetMapping("/dependency-risk-dashboard")
    public DependencyRiskDashboard getDependencyRiskDashboard() {

        return dependencyAnalysisService
                .getDependencyRiskDashboard();
    }
}