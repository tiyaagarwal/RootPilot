package com.rootpilot.rootpilot_backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class DailyBriefing {
    private long id;
    private String date;
    private int incidentsCount;
    private int resolvedCount;
    private double riskScore;
    private double reliabilityScore;
    private double remediationSuccessRate;
    private String highestRiskService;
    private String briefingText;
}
