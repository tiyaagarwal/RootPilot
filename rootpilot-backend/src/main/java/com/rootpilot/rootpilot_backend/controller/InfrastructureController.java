package com.rootpilot.rootpilot_backend.controller;

import com.rootpilot.rootpilot_backend.repository.IncidentRepository;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/infrastructure")
public class InfrastructureController {

    private final IncidentRepository incidentRepository;

    public InfrastructureController(IncidentRepository incidentRepository) {
        this.incidentRepository = incidentRepository;
    }

    @GetMapping("/services")
    public List<Map<String, Object>> getServices() {
        List<String> serviceNames = incidentRepository.findDistinctServiceNames();
        if (serviceNames == null) {
            return List.of();
        }

        LocalDateTime oneHourAgo = LocalDateTime.now().minusHours(1);
        List<Object[]> recentCounts = incidentRepository.countRecentIncidentsByService(oneHourAgo);
        Map<String, Long> incidentMap = new HashMap<>();
        if (recentCounts != null) {
            incidentMap = recentCounts.stream()
                    .collect(Collectors.toMap(
                            row -> (String) row[0],
                            row -> ((Number) row[1]).longValue()
                    ));
        }

        List<Map<String, Object>> inventory = new ArrayList<>();
        long idCounter = 1;
        
        for (String name : serviceNames) {
            long count = incidentMap.getOrDefault(name, 0L);
            String status = "HEALTHY";
            if (count > 20) {
                status = "DOWN";
            } else if (count > 5) {
                status = "DEGRADED";
            }

            Map<String, Object> service = new HashMap<>();
            service.put("id", idCounter++);
            service.put("serviceName", name);
            service.put("type", "SpringBoot");
            service.put("status", status);
            service.put("hostName", "prod-node-0" + (idCounter % 5 + 1));
            service.put("containerName", name + "-pod");
            service.put("lastUpdatedAt", LocalDateTime.now().toString());
            inventory.add(service);
        }
        return inventory;
    }
}
