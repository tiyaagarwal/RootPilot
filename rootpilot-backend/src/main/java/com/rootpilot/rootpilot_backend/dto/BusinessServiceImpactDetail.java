package com.rootpilot.rootpilot_backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class BusinessServiceImpactDetail {
    private String businessService;
    private String status;
    private double revenueLoss;
    private String owner;
}
