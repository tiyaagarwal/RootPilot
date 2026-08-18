package com.rootpilot.rootpilot_backend.controller;

import com.rootpilot.rootpilot_backend.dto.BusinessService;
import com.rootpilot.rootpilot_backend.dto.BusinessServiceImpact;
import com.rootpilot.rootpilot_backend.service.BusinessServiceService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/business-services")
public class BusinessServiceController {

    private final BusinessServiceService businessServiceService;

    public BusinessServiceController(BusinessServiceService businessServiceService) {
        this.businessServiceService = businessServiceService;
    }

    @GetMapping
    public List<BusinessService> getBusinessServices() {
        return businessServiceService.getBusinessServices();
    }

    @GetMapping("/impact")
    public BusinessServiceImpact getBusinessServiceImpact() {
        return businessServiceService.getBusinessServiceImpact();
    }
}
