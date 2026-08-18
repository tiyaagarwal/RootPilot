package com.rootpilot.rootpilot_backend.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "anomaly_events")
public class AnomalyEvent {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String serviceName;
    private String metricType;
    private double zScore;
    private double baselineValue;
    private double currentValue;
    private LocalDateTime timestamp;
    private String severity;

    public AnomalyEvent() {
    }

    public AnomalyEvent(String serviceName, String metricType, double zScore, double baselineValue, double currentValue, LocalDateTime timestamp, String severity) {
        this.serviceName = serviceName;
        this.metricType = metricType;
        this.zScore = zScore;
        this.baselineValue = baselineValue;
        this.currentValue = currentValue;
        this.timestamp = timestamp;
        this.severity = severity;
    }

    public Long getId() {
        return id;
    }

    public String getServiceName() {
        return serviceName;
    }

    public String getMetricType() {
        return metricType;
    }

    public double getZScore() {
        return zScore;
    }

    public double getBaselineValue() {
        return baselineValue;
    }

    public double getCurrentValue() {
        return currentValue;
    }

    public LocalDateTime getTimestamp() {
        return timestamp;
    }

    public String getSeverity() {
        return severity;
    }
}
