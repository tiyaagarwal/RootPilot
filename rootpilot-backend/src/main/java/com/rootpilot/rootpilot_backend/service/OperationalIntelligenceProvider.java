package com.rootpilot.rootpilot_backend.service;

import com.rootpilot.rootpilot_backend.dto.CopilotContext;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class OperationalIntelligenceProvider implements AIProvider {

    private final GeminiProvider geminiProvider;

    public OperationalIntelligenceProvider(GeminiProvider geminiProvider) {
        this.geminiProvider = geminiProvider;
    }

    @Override
    public Map<String, Object> getResponse(String userPrompt, CopilotContext context, List<String> chatHistory) {
        // 1. Try real-time Gemini LLM inference first
        Map<String, Object> geminiResponse = geminiProvider.getResponse(userPrompt, context, chatHistory);
        if (geminiResponse != null) {
            return geminiResponse;
        }

        // 2. Fall back to local rule-based intelligence engine
        String prompt = userPrompt.toLowerCase();
        
        String answer;
        String riskLevel = "LOW";
        double confidenceScore = 0.95;
        List<String> affectedServices = new ArrayList<>();
        List<Map<String, String>> actionLinks = new ArrayList<>();
        List<String> dataSources = new ArrayList<>();

        dataSources.add("PostgreSQL Incident Logs");
        dataSources.add("Redis Active Metrics Cache");
        dataSources.add("RabbitMQ Event Ingestion Logs");

        // Topic 1: Operational Briefing / Platform Health
        if (prompt.contains("briefing") || prompt.contains("platform health") || prompt.contains("status")) {
            answer = String.format(
                    "### RootPilot Daily Operational Briefing\n\n" +
                    "**Platform Health:** %d%% (%s)\n" +
                    "**Active Incidents:** %d (Critical: %d)\n" +
                    "**SLO Violations:** %d service(s)\n" +
                    "**Open Anomaly Events:** %d statistical triggers detected.\n\n" +
                    "**Current Assessment:** " +
                    (context.getHealthScore() < 80 ? 
                     "The system is currently DEGRADED. High latency signals have been captured in downstream dependencies." :
                     "The platform is currently STABLE. All critical routes are meeting compliance thresholds."),
                    context.getHealthScore(), context.getSystemStatus(),
                    context.getActiveIncidentCount(), context.getCriticalIncidentCount(),
                    context.getSloViolationCount(), context.getOpenAnomalyCount()
            );
            riskLevel = context.getHealthScore() < 80 ? "HIGH" : "LOW";
            
            actionLinks.add(Map.of("label", "View Command Center", "route", "/"));
            actionLinks.add(Map.of("label", "Audit Active Anomalies", "route", "/rca"));
        }
        
        // Topic 2: Incident Intelligence
        else if (prompt.contains("incident") || prompt.contains("unstable") || prompt.contains("active")) {
            if (context.getActiveIncidentCount() == 0) {
                answer = "### Incident Analysis Summary\n\n" +
                         "There are currently **0 active incidents** reported. The event ingestion queues are clean.";
            } else {
                StringBuilder builder = new StringBuilder();
                builder.append("### Active Incident Assessment\n\n")
                       .append(String.format("There are **%d active incidents** registered.\n\n", context.getActiveIncidentCount()));
                
                context.getActiveIncidentsList().stream().limit(3).forEach(incident -> {
                    builder.append(String.format("- **Service:** `%s` | **Type:** `%s` | **Status:** `Active` (Latency: %s ms, Code: %s)\n",
                            incident.get("serviceName"), incident.get("exceptionType"), 
                            incident.get("latency") != null ? incident.get("latency") : "N/A",
                            incident.get("statusCode") != null ? incident.get("statusCode") : "N/A"));
                    affectedServices.add((String) incident.get("serviceName"));
                });

                if (context.getActiveIncidentsList().size() > 3) {
                    builder.append(String.format("\nAnd %d other incident events. Let me know if you need to trace them.", 
                            context.getActiveIncidentsList().size() - 3));
                }

                answer = builder.toString();
                riskLevel = context.getCriticalIncidentCount() > 0 ? "HIGH" : "MEDIUM";
                confidenceScore = 0.92;
                actionLinks.add(Map.of("label", "Review Incident Logs", "route", "/incidents"));
            }
        }

        // Topic 3: Reliability & Anomaly Analysis
        else if (prompt.contains("anomaly") || prompt.contains("anomalies") || prompt.contains("deviat") || prompt.contains("z-score")) {
            if (context.getOpenAnomalyCount() == 0) {
                answer = "### Statistical Anomaly Analysis\n\n" +
                         "No statistical metric anomalies (Z-Score > 3.0) are currently triggered in PostgreSQL or cached in Redis. Dynamic baselines match current telemetry.\n\n" +
                         "**How Z-Score Anomaly Detection Works in RootPilot:**\n" +
                         "The `AnomalyDetectionService` tracks rolling performance parameters (latency, error rates) for each microservice. " +
                         "For every incoming telemetry item, the system calculates the rolling mean (μ) and standard deviation (σ) over the last 30 telemetry points.\n" +
                         "The current point's deviation is calculated as:\n" +
                         "$$Z = \\frac{x - \\mu}{\\sigma}$$\n" +
                         "If the absolute Z-Score $|Z| > 3.0$ (exceeding the 3-sigma threshold), an anomaly event is triggered.";
            } else {
                answer = String.format(
                        "### Statistical Anomaly Analysis\n\n" +
                        "There are currently **%d active anomalies** triggered.\n\n" +
                        "Our rolling Z-Score engine detected statistical deviations exceeding the 3-sigma threshold. These anomalies correlate with resource constraints in `%s`.\n\n" +
                        "I recommend checking the RCA workbench to evaluate baseline standard deviations.",
                        context.getOpenAnomalyCount(), context.getHighestRiskService()
                );
                affectedServices.add(context.getHighestRiskService());
                riskLevel = "HIGH";
                actionLinks.add(Map.of("label", "Inspect RCA Deviations", "route", "/rca"));
            }
            dataSources.add("Standard Deviation Rolling Index");
        }

        // Topic 4: Dependency / Blast Radius
        else if (prompt.contains("dependency") || prompt.contains("blast radius") || prompt.contains("downstream")) {
            answer = String.format(
                    "### Service Dependency & Blast Radius Assessment\n\n" +
                    "**Highest Risk Node:** `%s` (highest dependency aggregation risk).\n\n" +
                    "A failure on this service propagates cascading warnings to downstream consumers. " +
                    "We recommend validating that circuit breakers are configured and routing rules are active.",
                    context.getHighestRiskService()
            );
            affectedServices.add(context.getHighestRiskService());
            riskLevel = "MEDIUM";
            actionLinks.add(Map.of("label", "Inspect Service Map", "route", "/services"));
        }

        // Topic 5: Security & JWT authentication
        else if (prompt.contains("auth") || prompt.contains("login") || prompt.contains("security") || prompt.contains("jwt") || prompt.contains("token") || prompt.contains("password") || prompt.contains("user")) {
            answer = "### RootPilot Security & Authentication\n\n" +
                     "**Authentication Engine:** Stateful JWT (JSON Web Token) tokens issued upon successful login.\n" +
                     "**Token Lifespan:** 24 hours.\n" +
                     "**Storage:** Stored in the browser's `localStorage` and sent inside the `Authorization: Bearer <token>` header for all API calls.\n\n" +
                     "**Protected API Paths:**\n" +
                     "- `/api/analysis/**` (SRE Metrics/Dashboard)\n" +
                     "- `/api/incidents/**` (Incident Logs)\n" +
                     "- `/api/copilot/ask` (Operations Copilot requests)\n\n" +
                     "Only `/api/auth/login` and the standard Actuator `/health` endpoints permit unauthenticated traffic.";
            riskLevel = "LOW";
            actionLinks.add(Map.of("label", "Configure Settings", "route", "/settings"));
        }

        // Topic 6: Architecture / Tech Stack
        else if (prompt.contains("architecture") || prompt.contains("tech stack") || prompt.contains("what is rootpilot") || prompt.contains("about this app") || prompt.contains("framework") || prompt.contains("system")) {
            answer = "### RootPilot Platform Architecture\n\n" +
                     "RootPilot is a distributed systems monitoring and reliability operations platform designed for SREs.\n\n" +
                     "**Architecture Breakdown:**\n" +
                     "1. **Backend (Java 21 / Spring Boot):** Orchestrates API routes, manages security context, calculates Z-score anomaly indices, and provides SRE recommendations.\n" +
                     "2. **Database (PostgreSQL):** Persistent storage of host configurations, service catalogs, incident histories, and historical anomalies.\n" +
                     "3. **Metrics Store (Redis):** Key-value caching of high-frequency telemetry data and temporary Z-scores.\n" +
                     "4. **Event Broker (RabbitMQ):** Ingests asynchronous failure simulation events to test telemetry evaluation pipelines.\n" +
                     "5. **Frontend (React / TypeScript / Material-UI):** Real-time dashboards, RCA timelines, and interactive dependency maps.";
            riskLevel = "LOW";
            actionLinks.add(Map.of("label", "View Infrastructure", "route", "/infrastructure"));
        }

        // Topic 7: Failure Simulation & RabbitMQ
        else if (prompt.contains("simulate") || prompt.contains("rabbitmq") || prompt.contains("event") || prompt.contains("queue") || prompt.contains("trigger") || prompt.contains("failure")) {
            answer = "### Failure Simulation Pipeline\n\n" +
                     "Failure simulation events are sent asynchronously via RabbitMQ to evaluate standard SRE response profiles.\n\n" +
                     "**Flow Sequence:**\n" +
                     "1. An event publisher triggers a failure event.\n" +
                     "2. `FailureEventConsumer` consumes the message from the `failure-events` queue.\n" +
                     "3. The consumer creates an incident log in PostgreSQL.\n" +
                     "4. Telemetry indices are updated, and the `AnomalyDetectionService` calculates a new Z-score baseline for the target service.";
            riskLevel = "MEDIUM";
            actionLinks.add(Map.of("label", "Scale Autonomous Ops", "route", "/autonomous"));
        }

        // Topic 8: SRE Remediation & Investigation Guide
        else if (prompt.contains("how to resolve") || prompt.contains("remediat") || prompt.contains("action") || prompt.contains("investigate") || prompt.contains("troubleshoot")) {
            answer = "### SRE Remediation Playbook\n\n" +
                     "To triage and resolve anomalies and incident spikes:\n" +
                     "1. **Check standard deviations:** Inspect standard deviations on the RCA dashboard to see which services are reporting metrics $|Z| > 3.0$.\n" +
                     "2. **Inspect Blast Radius:** Check service dependencies to see if upstream failures (like database or core Auth services) are cascading downstream.\n" +
                     "3. **Execute Remediation Actions:** Access the Autonomous Operations panel to run rollback scripts, container restarts, or adjust rate limiting rules.";
            riskLevel = "MEDIUM";
            actionLinks.add(Map.of("label", "Inspect RCA Workbench", "route", "/rca"));
        }

        // Topic 9: Specific Microservices
        else if (prompt.contains("payment") || prompt.contains("auth") || prompt.contains("inventory") || prompt.contains("notification") || prompt.contains("shipping")) {
            String serviceName = prompt.contains("payment") ? "payments" :
                                 prompt.contains("auth") ? "auth" :
                                 prompt.contains("inventory") ? "inventory" :
                                 prompt.contains("notification") ? "notification" : "shipping";
            
            boolean isHighestRisk = context.getHighestRiskService().equalsIgnoreCase(serviceName);
            answer = String.format("### Microservice Analysis: `%s`\n\n" +
                                   "**Service Metrics:**\n" +
                                   "- **Platform Active Incidents:** %d\n" +
                                   "- **Highest Risk Service in System:** `%s`\n\n" +
                                   "**Triaging Recommendation:**\n" +
                                   (isHighestRisk ? 
                                    "This service is flagged as the highest risk node in the network. Check its upstream dependencies and review recent Z-Score logs." : 
                                    "This service is currently reporting normal thresholds. Monitor its logs if upstream dependencies show latency spikes."),
                                   serviceName, context.getActiveIncidentCount(), context.getHighestRiskService());
            
            riskLevel = isHighestRisk ? "HIGH" : "LOW";
            affectedServices.add(serviceName);
            actionLinks.add(Map.of("label", "View Service Catalog", "route", "/services"));
        }

        // Topic 10: Risks
        else if (prompt.contains("risk") || prompt.contains("threat") || prompt.contains("predict")) {
            answer = String.format(
                    "### Operational Risk Assessment\n\n" +
                    "**Threat Vector:** Reliability score for service `%s` is deteriorating.\n" +
                    "**SLO Status:** %d service(s) currently violating compliance targets.\n\n" +
                    "We forecast a potential capacity issue if incoming queue ingestion spikes.",
                    context.getHighestRiskService(), context.getSloViolationCount()
            );
            affectedServices.add(context.getHighestRiskService());
            riskLevel = context.getSloViolationCount() > 0 ? "HIGH" : "MEDIUM";
            actionLinks.add(Map.of("label", "Scale Autonomous Ops", "route", "/autonomous"));
        }

        // Default Catch-All / Dynamic Help Guide
        else {
            answer = "### RootPilot Operations Intelligence Assistant\n\n" +
                     "I am connected to the live RootPilot telemetry engine. I can explain the platform architecture, analyze security protocols, or troubleshoot metrics. \n\n" +
                     "**Try asking me about:**\n" +
                     "- *\"What is RootPilot's architecture?\"*\n" +
                     "- *\"How does anomaly detection (Z-score) work?\"*\n" +
                     "- *\"Summarize active incidents.\"*\n" +
                     "- *\"What is the security model (JWT)?\"*\n" +
                     "- *\"How do we run failure simulations?\"*\n" +
                     "- *\"Give me today's operational briefing.\"*\n" +
                     "- *\"How do I investigate high latency anomalies?\"*";
        }

        // Aggregate recommended SRE actions based on system metrics
        List<String> recommendations = new ArrayList<>();
        if (context.getActiveIncidentCount() > 0) {
            recommendations.add("Remediate active incident logs for affected services");
        }
        if (context.getOpenAnomalyCount() > 0) {
            recommendations.add("Evaluate baseline deviations on the RCA dashboard");
        }
        if (context.getSloViolationCount() > 0) {
            recommendations.add("Review resource capacity limits for violating services");
        }
        if (recommendations.isEmpty()) {
            recommendations.add("System is stable. No action required.");
        }

        return Map.of(
                "answer", answer,
                "riskLevel", riskLevel,
                "confidenceScore", confidenceScore,
                "affectedServices", affectedServices,
                "recommendations", recommendations,
                "actionLinks", actionLinks,
                "dataSources", dataSources
        );
    }
}
