package com.rootpilot.monitored_service.event;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class FailureEvent {

    private String serviceName;

    private String endpoint;

    private Integer statusCode;

    private Long latency;

    private String exceptionType;

    private String version;

    private LocalDateTime timestamp;
}