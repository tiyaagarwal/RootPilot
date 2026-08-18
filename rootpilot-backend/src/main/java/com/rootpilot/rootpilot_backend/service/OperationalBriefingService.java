package com.rootpilot.rootpilot_backend.service;

import com.rootpilot.rootpilot_backend.dto.DailyBriefing;
import com.rootpilot.rootpilot_backend.repository.IncidentRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class OperationalBriefingService {

    private final IncidentRepository incidentRepository;

    public OperationalBriefingService(IncidentRepository incidentRepository) {
        this.incidentRepository = incidentRepository;
    }

    public DailyBriefing getTodayBriefing() {
        LocalDateTime startOfDay = LocalDate.now().atStartOfDay();
        long incidentsToday = incidentRepository.countRecentIncidents(startOfDay);

        List<Object[]> recentCounts = incidentRepository.countRecentIncidentsByService(startOfDay);
        String topService = "N/A";
        if (recentCounts != null && !recentCounts.isEmpty()) {
            topService = (String) recentCounts.get(0)[0];
        }

        double riskScore = Math.min(100.0, (incidentsToday * 2.5));
        double reliability = Math.max(0.0, 100.0 - riskScore);

        String briefingText;
        if (incidentsToday == 0) {
            briefingText = "System is currently operating smoothly. No incidents reported today. All core business services are healthy.";
        } else if (incidentsToday < 10) {
            briefingText = String.format("System is experiencing minor turbulence with %d incidents today. %s is the most active service. Monitoring closely.", incidentsToday, topService);
        } else {
            briefingText = String.format("Elevated risk detected. %d incidents have been logged today, heavily impacting %s. Immediate investigation recommended.", incidentsToday, topService);
        }

        return new DailyBriefing(
                1L,
                LocalDate.now().toString(),
                (int) incidentsToday,
                (int) (incidentsToday * 0.8), // Mocking resolved count
                riskScore,
                reliability,
                85.0, // Mocking remediation success rate
                topService,
                briefingText
        );
    }
}
