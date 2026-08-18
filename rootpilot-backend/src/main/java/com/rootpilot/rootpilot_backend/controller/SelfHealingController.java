package com.rootpilot.rootpilot_backend.controller;

import com.rootpilot.rootpilot_backend.dto.SelfHealingDashboard;
import com.rootpilot.rootpilot_backend.dto.SelfHealingExecutiveSummary;
import com.rootpilot.rootpilot_backend.dto.SelfHealingRecommendation;
import com.rootpilot.rootpilot_backend.dto.SelfHealingSummary;
import com.rootpilot.rootpilot_backend.service.SelfHealingService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
public class SelfHealingController {

    private final SelfHealingService selfHealingService;

    public SelfHealingController(
            SelfHealingService selfHealingService) {

        this.selfHealingService = selfHealingService;
    }

    @GetMapping("/analysis/self-healing-recommendations")
    public List<SelfHealingRecommendation>
    getSelfHealingRecommendations() {

        return selfHealingService
                .getSelfHealingRecommendations();
    }

    @GetMapping("/analysis/self-healing-summary")
    public SelfHealingSummary getSelfHealingSummary() {

        return selfHealingService
                .getSelfHealingSummary();
    }

    @GetMapping("/analysis/self-healing-executive-summary")
    public SelfHealingExecutiveSummary
    getSelfHealingExecutiveSummary() {

        return selfHealingService
                .getSelfHealingExecutiveSummary();
    }

    @GetMapping("/analysis/self-healing-dashboard")
    public SelfHealingDashboard getSelfHealingDashboard() {

        return selfHealingService
                .getSelfHealingDashboard();
    }
}