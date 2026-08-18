package com.rootpilot.rootpilot_backend.config;

import org.springframework.amqp.core.Queue;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
@ConditionalOnProperty(name = "rabbitmq.enabled", havingValue = "true", matchIfMissing = false)
public class RabbitMQConfig {

    public static final String FAILURE_QUEUE =
            "failure-events";

    @Bean
    public Queue failureQueue() {
        return new Queue(FAILURE_QUEUE, true);
    }
}
