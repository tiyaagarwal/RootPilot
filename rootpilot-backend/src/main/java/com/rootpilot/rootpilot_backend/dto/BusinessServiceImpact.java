package com.rootpilot.rootpilot_backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class BusinessServiceImpact {
    private double totalEstimatedLoss;
    private int degradedServices;
    private int downServices;
    private List<BusinessServiceImpactDetail> impactedDetails;
}
