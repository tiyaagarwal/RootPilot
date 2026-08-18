package com.rootpilot.rootpilot_backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class BusinessService {
    private long id;
    private String name;
    private String description;
    private String owner;
    private double revenueRiskPerHour;
    private String healthStatus;
}
