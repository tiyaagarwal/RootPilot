package com.rootpilot.monitored_service.service;

import com.rootpilot.monitored_service.config.RabbitMQConfig;
import com.rootpilot.monitored_service.event.FailureEvent;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.stereotype.Service;

@Service
public class FailurePublisher {

    private final RabbitTemplate rabbitTemplate;

    public FailurePublisher(RabbitTemplate rabbitTemplate) {
        this.rabbitTemplate = rabbitTemplate;
    }

    public void publishFailure(FailureEvent event) {

        rabbitTemplate.convertAndSend(
                RabbitMQConfig.FAILURE_QUEUE,  //the java obj is converted to json
                event
        );

        System.out.println("Published Failure Event: " + event);
    }
}