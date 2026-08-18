package com.rootpilot.rootpilot_backend.service;

import com.rootpilot.rootpilot_backend.dto.BusinessService;
import com.rootpilot.rootpilot_backend.dto.BusinessServiceImpact;
import com.rootpilot.rootpilot_backend.dto.BusinessServiceImpactDetail;
import com.rootpilot.rootpilot_backend.repository.IncidentRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class BusinessServiceService {

    private final IncidentRepository incidentRepository;

    public BusinessServiceService(IncidentRepository incidentRepository) {
        this.incidentRepository = incidentRepository;
    }

    public List<BusinessService> getBusinessServices() {
        List<String> serviceNames = incidentRepository.findDistinctServiceNames();
        if (serviceNames == null || serviceNames.isEmpty()) {
            return List.of();
        }

        LocalDateTime oneHourAgo = LocalDateTime.now().minusHours(1);
        List<Object[]> recentCounts = incidentRepository.countRecentIncidentsByService(oneHourAgo);
        Map<String, Long> incidentMap = recentCounts.stream()
                .collect(Collectors.toMap(
                        row -> (String) row[0],
                        row -> ((Number) row[1]).longValue()
                ));

        List<BusinessService> result = new ArrayList<>();
        long idCounter = 1;
        for (String name : serviceNames) {
            long count = incidentMap.getOrDefault(name, 0L);
            String healthStatus = "HEALTHY";
            if (count > 20) {
                healthStatus = "DOWN";
            } else if (count > 5) {
                healthStatus = "DEGRADED";
            }

            // Calculate deterministic business service details based on the name
            double revenueRisk = name.hashCode() % 100000;
            if (revenueRisk < 0) revenueRisk *= -1;
            if (revenueRisk < 5000) revenueRisk += 5000;

            result.add(new BusinessService(
                    idCounter++,
                    name,
                    "Monitored service for " + name,
                    "Platform Team",
                    revenueRisk,
                    healthStatus
            ));
        }

        return result;
    }

    public BusinessServiceImpact getBusinessServiceImpact() {
        List<BusinessService> services = getBusinessServices();
        
        double totalLoss = 0;
        int degraded = 0;
        int down = 0;
        List<BusinessServiceImpactDetail> details = new ArrayList<>();

        for (BusinessService bs : services) {
            if ("DOWN".equals(bs.getHealthStatus()) || "DEGRADED".equals(bs.getHealthStatus())) {
                if ("DOWN".equals(bs.getHealthStatus())) {
                    down++;
                } else {
                    degraded++;
                }
                
                double loss = "DOWN".equals(bs.getHealthStatus()) ? bs.getRevenueRiskPerHour() : (bs.getRevenueRiskPerHour() * 0.3);
                totalLoss += loss;
                
                details.add(new BusinessServiceImpactDetail(
                        bs.getName(),
                        bs.getHealthStatus(),
                        loss,
                        bs.getOwner()
                ));
            }
        }

        return new BusinessServiceImpact(totalLoss, degraded, down, details);
    }
}
