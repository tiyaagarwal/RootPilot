# ⚙️ RootPilot Backend

[![Java 21](https://img.shields.io/badge/Java-21-orange?style=flat-square&logo=openjdk)](https://openjdk.org/)
[![Spring Boot 4.0](https://img.shields.io/badge/Spring_Boot-4.0.6-brightgreen?style=flat-square&logo=springboot)](https://spring.io/projects/spring-boot)
[![RabbitMQ](https://img.shields.io/badge/RabbitMQ-Enabled-red?style=flat-square&logo=rabbitmq)](https://www.rabbitmq.com/)
[![Redis](https://img.shields.io/badge/Redis-Enabled-red?style=flat-square&logo=redis)](https://redis.io/)

The backend service for **RootPilot**, built on Spring Boot. It acts as the core telemetry collection, processing, and operations intelligence repository.

---

## 🚀 Key Features

* **Event-Driven Telemetry Ingestion**: Ingests asynchronous failure events through an event-driven pipeline powered by **RabbitMQ**.
* **Statistical Anomaly Detection (Z-Score)**: Dynamically calculates standard deviation ($\sigma$) and mean ($\mu$) over a 30-point rolling window of microservice latency and error metrics. Active Z-score violations are cached in **Redis**.
* **GenAI-Powered SRE Copilot**: Leverages **Google Gemini 1.5 Flash API** to dynamically reason over active incidents, SLO targets, and anomalies to yield triaging recommendations and remediation code scripts.
* **Stateless Security**: Employs signed HMAC-SHA256 tokens for session security and route-level authorization via **Spring Security**.
* **Fail-Safe Caching Layers**: Incorporates custom defensive wrappers around `RedisTemplate` to automatically fallback to database-only operations in the event of cache connection degradation.

---

## 🛠️ Technology Stack

* **Language & SDK**: Java 21 (OpenJDK)
* **Framework**: Spring Boot 4.x / Spring Web
* **Database**: PostgreSQL (JPA / Hibernate)
* **Caching**: Redis
* **Event Broker**: RabbitMQ
* **Security**: Spring Security & JSON Web Tokens (`jjwt`)

---

## ⚙️ Prerequisites

Before booting the backend server, make sure the following local services are running:
1. **PostgreSQL** (Port `5432`): Database `postgres` or `rootpilot`
2. **Redis** (Port `6379`)
3. **RabbitMQ** (Port `5672` / Management Console: `15672`)

---

## 🔧 Installation & Running

### 1. Environment Configuration
You can customize the datasource and provider configurations in `src/main/resources/application.yml` or set them as environment variables:

```bash
# Database Setup
export SPRING_DATASOURCE_URL=jdbc:postgresql://localhost:5432/postgres
export SPRING_DATASOURCE_USERNAME=postgres
export SPRING_DATASOURCE_PASSWORD=password

# Message Broker Setup
export SPRING_RABBITMQ_HOST=localhost
export SPRING_RABBITMQ_USERNAME=guest
export SPRING_RABBITMQ_PASSWORD=guest

# Redis Setup
export SPRING_DATA_REDIS_HOST=localhost
export SPRING_DATA_REDIS_PORT=6379

# Gemini Integration (Optional - Enables Live SRE Copilot responses)
export GEMINI_API_KEY=your_gemini_api_key
```

### 2. Compile and Boot
Clean compile the project and start the server:
```bash
# Compile and build JAR
./mvnw clean compile

# Run Spring Boot app
./mvnw spring-boot:run
```
The application will boot and bind to **port 8080**.

---

## 📡 API Reference Summary

### Authentication (`/api/auth`)
* `POST /api/auth/login` - Authenticate username/password and return JWT. (Default accounts: `admin`/`sre`/`operator`/`viewer` - Password: `rootpilot`).
* `GET /api/auth/session` - Return session details from thread-local security context.

### Telemetry Ingestion
* `GET /api/incidents` - Retrieve all recorded incident history.
* `POST /api/telemetry/ingest` - Directly push new metrics telemetry points.

### AIOps Analytics (`/api/analysis`)
* `GET /api/analysis/dashboard` - High-level metrics aggregator.
* `GET /api/analysis/anomalies` - Active Z-score violations.
* `GET /api/analysis/recommendations` - AI-generated corrective recommendations.
* `GET /api/analysis/service-reliability` - Dynamic service SLO metrics.
* `GET /api/analysis/top-dependencies` - Blast radius service dependency map.

### Operations Copilot (`/api/copilot`)
* `POST /api/copilot/ask` - Send SRE queries. Expects JSON `{ "question": "..." }` and returns answers along with risk badges and recommendations.
