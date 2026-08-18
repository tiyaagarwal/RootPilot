package com.rootpilot.monitored_service.controller;

import com.rootpilot.monitored_service.event.FailureEvent;
import com.rootpilot.monitored_service.service.FailurePublisher;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDateTime;

@RestController
public class TestController {

    private final FailurePublisher failurePublisher;

    public TestController(FailurePublisher failurePublisher) {
        this.failurePublisher = failurePublisher;
    }

    @GetMapping("/simulate-failure")
    public String simulateFailure() {

        FailureEvent event = new FailureEvent(
                "auth-service",
                "/login",
                500,
                350L,
                "NullPointerException",
                "1.0.0",
                LocalDateTime.now()
        );

        failurePublisher.publishFailure(event);

        return "Failure Event Published";
    }
}