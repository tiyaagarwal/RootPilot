package com.rootpilot.rootpilot_backend.controller;
import org.springframework.web.bind.annotation.PathVariable;
import java.util.Optional;
import org.springframework.http.ResponseEntity;
import com.rootpilot.rootpilot_backend.entity.Incident;
import com.rootpilot.rootpilot_backend.service.IncidentService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/incidents")
public class IncidentController {

    private final IncidentService incidentService;

    public IncidentController(
            IncidentService incidentService) {

        this.incidentService = incidentService;
    }

    @GetMapping
    public List<Incident> getAllIncidents() {

        return incidentService.getAllIncidents();
    }
    @GetMapping("/{id}")
    public ResponseEntity<Incident> getIncidentById(
            @PathVariable Long id) {

        return incidentService
                .getIncidentById(id)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }
    @GetMapping("/services")
    public List<String> getServices() {

        return incidentService.getAllServices();
    }
}