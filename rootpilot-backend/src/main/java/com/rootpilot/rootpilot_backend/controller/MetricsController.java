package com.rootpilot.rootpilot_backend.controller;

import com.rootpilot.rootpilot_backend.service.IncidentService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
public class MetricsController {

    private final IncidentService incidentService;

    public MetricsController(
            IncidentService incidentService) {

        this.incidentService = incidentService;
    }

    @GetMapping("/metrics")
    public Map<String, Long> getMetrics() {

        return Map.of(
                "totalIncidents",
                incidentService.getTotalIncidents()
        );
    }
    @GetMapping("/metrics/exceptions")
    public Map<String, Long> getExceptionMetrics() {

        return incidentService.getExceptionMetrics();
    }
    @GetMapping("/metrics/services")
    public Map<String, Long> getServiceMetrics() {

        return incidentService.getServiceMetrics();
    }
}