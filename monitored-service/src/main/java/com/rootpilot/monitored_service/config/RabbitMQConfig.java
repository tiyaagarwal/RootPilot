package com.rootpilot.monitored_service.config;
import org.springframework.amqp.core.Queue;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class RabbitMQConfig {

    public static final String FAILURE_QUEUE = "failure-events";

    @Bean
    public Queue failureQueue() {
        return new Queue(FAILURE_QUEUE, true);
    }
}