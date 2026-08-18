package com.rootpilot.rootpilot_backend.service;

import com.rootpilot.rootpilot_backend.dto.CopilotContext;
import com.rootpilot.rootpilot_backend.dto.DashboardSnapshot;
import com.rootpilot.rootpilot_backend.dto.ReliabilitySummary;
import com.rootpilot.rootpilot_backend.entity.Incident;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class CopilotContextService {

    private final IncidentService incidentService;
    private final AnomalyDetectionService anomalyDetectionService;

    public CopilotContextService(IncidentService incidentService, AnomalyDetectionService anomalyDetectionService) {
        this.incidentService = incidentService;
        this.anomalyDetectionService = anomalyDetectionService;
    }

    public CopilotContext getActiveContext() {
        // Fetch incidents
        List<Incident> allIncidents = incidentService.getAllIncidents();
        int activeCount = allIncidents.size();
        
        int criticalCount = 0;
        List<Map<String, Object>> activeList = new ArrayList<>();
        List<String> criticalServicesList = new ArrayList<>();
        
        for (Incident incident : allIncidents) {
            Map<String, Object> details = new HashMap<>();
            details.put("id", incident.getId());
            details.put("serviceName", incident.getServiceName());
            details.put("exceptionType", incident.getExceptionType());
            details.put("latency", incident.getLatency());
            details.put("statusCode", incident.getStatusCode());
            activeList.add(details);
            
            // Heuristic context evaluation for incident criticality
            if (incident.getLatency() != null && incident.getLatency() > 3000) {
                criticalCount++;
                if (!criticalServicesList.contains(incident.getServiceName())) {
                    criticalServicesList.add(incident.getServiceName());
                }
            }
        }

        // Fetch anomalies
        int openAnomalies = anomalyDetectionService.getAllAnomalies().size();

        // Fetch reliability and dashboard snapshot metrics
        DashboardSnapshot snapshot = incidentService.getDashboardSnapshot();
        ReliabilitySummary reliability = incidentService.getReliabilitySummary();

        int healthScore = snapshot != null ? snapshot.getHealthScore() : 100;
        String status = snapshot != null ? snapshot.getSystemStatus() : "HEALTHY";
        int violations = reliability != null ? reliability.getSloViolations() : 0;
        String highestRisk = reliability != null ? reliability.getMostUnreliableService() : "N/A";

        return new CopilotContext(
                activeCount,
                criticalCount,
                openAnomalies,
                healthScore,
                status,
                highestRisk,
                violations,
                criticalServicesList,
                activeList
        );
    }
}
