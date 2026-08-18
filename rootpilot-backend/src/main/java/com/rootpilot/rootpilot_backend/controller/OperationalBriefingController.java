package com.rootpilot.rootpilot_backend.controller;

import com.rootpilot.rootpilot_backend.dto.DailyBriefing;
import com.rootpilot.rootpilot_backend.service.OperationalBriefingService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/operational-briefing")
public class OperationalBriefingController {

    private final OperationalBriefingService operationalBriefingService;

    public OperationalBriefingController(OperationalBriefingService operationalBriefingService) {
        this.operationalBriefingService = operationalBriefingService;
    }

    @GetMapping("/today")
    public DailyBriefing getTodayBriefing() {
        return operationalBriefingService.getTodayBriefing();
    }
}
