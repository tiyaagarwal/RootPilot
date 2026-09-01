# Monitored Service (Failure Simulator)

A minimal Spring Boot service that publishes simulated failure events to RabbitMQ, standing in for a real microservice that the RootPilot backend monitors.

## What it does

`GET /simulate-failure` builds a hardcoded `FailureEvent` (service `auth-service`, endpoint `/login`, status `500`, exception `NullPointerException`) and publishes it to the `failure-events` RabbitMQ queue via `FailurePublisher`. The RootPilot backend consumes from that queue, computes rolling Z-score anomalies, and stores the resulting incidents.

## Running it

Requires a running RabbitMQ broker (see the [root README](../README.md#quick-start-guide) for the full local setup).

```bash
./mvnw spring-boot:run
```

The service boots on **port 8081**. Trigger a simulated failure with:

```bash
curl http://localhost:8081/simulate-failure
```

## Configuration

Set via environment variables (see `src/main/resources/application.properties`):

| Variable | Default |
| :--- | :--- |
| `RABBITMQ_HOST` | `localhost` |
| `RABBITMQ_PORT` | `5672` |
| `RABBITMQ_USERNAME` | `guest` |
| `RABBITMQ_PASSWORD` | `guest` |
