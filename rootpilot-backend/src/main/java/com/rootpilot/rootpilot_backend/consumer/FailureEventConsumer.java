package com.rootpilot.rootpilot_backend.consumer;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.rootpilot.rootpilot_backend.config.RabbitMQConfig;
import com.rootpilot.rootpilot_backend.entity.Incident;
import com.rootpilot.rootpilot_backend.event.FailureEvent;
import com.rootpilot.rootpilot_backend.service.IncidentService;
import com.rootpilot.rootpilot_backend.service.AnomalyDetectionService;
import org.springframework.amqp.core.Message;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.stereotype.Component;

@Component
@ConditionalOnProperty(name = "rabbitmq.enabled", havingValue = "true", matchIfMissing = false)
public class FailureEventConsumer {

    private final IncidentService incidentService;
    private final AnomalyDetectionService anomalyDetectionService;
    private final ObjectMapper objectMapper;

    public FailureEventConsumer(
            IncidentService incidentService,
            AnomalyDetectionService anomalyDetectionService,
            ObjectMapper objectMapper) {

        this.incidentService = incidentService;
        this.anomalyDetectionService = anomalyDetectionService;
        this.objectMapper = objectMapper;
    }

    @RabbitListener(
            queues = RabbitMQConfig.FAILURE_QUEUE)
    public void consume(Message message) {

        try {

            FailureEvent event =
                    objectMapper.readValue(
                            message.getBody(),
                            FailureEvent.class);

            System.out.println(
                    "Received Failure Event: "
                            + event.getExceptionType());

            Incident incident = new Incident();

            incident.setServiceName(
                    event.getServiceName());

            incident.setEndpoint(
                    event.getEndpoint());

            incident.setStatusCode(
                    event.getStatusCode());

            incident.setLatency(
                    event.getLatency());

            incident.setExceptionType(
                    event.getExceptionType());

            incident.setVersion(
                    event.getVersion());

            incident.setTimestamp(
                    event.getTimestamp());

            incidentService.saveIncident(incident);

            System.out.println(
                    "Incident saved successfully");

            // Hardening: Route performance metrics directly to the Anomaly Engine
            if (event.getLatency() != null) {
                anomalyDetectionService.processMetric(
                        event.getServiceName(),
                        event.getLatency().doubleValue(),
                        "latency"
                );
            }
            if (event.getStatusCode() != null) {
                double errorRate = event.getStatusCode() >= 500 ? 100.0 : 0.0;
                anomalyDetectionService.processMetric(
                        event.getServiceName(),
                        errorRate,
                        "errorRate"
                );
            }

        } catch (Exception e) {

            System.out.println(
                    "Failed to process message");

            e.printStackTrace();
        }
    }
}