package com.rootpilot.rootpilot_backend.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.rootpilot.rootpilot_backend.dto.CopilotContext;
import org.springframework.stereotype.Service;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.time.Duration;
import java.util.*;

@Service
public class GeminiProvider implements AIProvider {

    private final ObjectMapper objectMapper = new ObjectMapper();
    private final HttpClient httpClient = HttpClient.newBuilder()
            .connectTimeout(Duration.ofSeconds(10))
            .build();

    @Override
    public Map<String, Object> getResponse(String userPrompt, CopilotContext systemContext, List<String> chatHistory) {
        String apiKey = System.getenv("GEMINI_API_KEY");
        if (apiKey == null || apiKey.trim().isEmpty()) {
            apiKey = System.getProperty("GEMINI_API_KEY");
        }

        if (apiKey == null || apiKey.trim().isEmpty()) {
            return null;
        }

        try {
            String systemInstructions = "You are RootPilot Operations Copilot, an AI SRE Assistant and Incident Commander.\n" +
                    "Use the following real RootPilot platform context to answer the user's question:\n" +
                    "Health Score: " + systemContext.getHealthScore() + "\n" +
                    "System Status: " + systemContext.getSystemStatus() + "\n" +
                    "Active Incident Count: " + systemContext.getActiveIncidentCount() + "\n" +
                    "Critical Incident Count: " + systemContext.getCriticalIncidentCount() + "\n" +
                    "SLO Violations: " + systemContext.getSloViolationCount() + "\n" +
                    "Open Anomalies: " + systemContext.getOpenAnomalyCount() + "\n" +
                    "Highest Risk Service: " + systemContext.getHighestRiskService() + "\n" +
                    "Active Incidents List: " + systemContext.getActiveIncidentsList() + "\n\n" +
                    "Previous Chat History:\n" + String.join("\n", chatHistory) + "\n\n" +
                    "CRITICAL: You must respond ONLY with a single JSON object. Do not include markdown formatting codeblocks (like ```json). Just return the raw JSON content.\n" +
                    "The JSON object MUST contain the following keys:\n" +
                    "- \"answer\": (markdown string answering the question)\n" +
                    "- \"riskLevel\": (string, one of: LOW, MEDIUM, HIGH, CRITICAL)\n" +
                    "- \"confidenceScore\": (number between 0.0 and 1.0)\n" +
                    "- \"affectedServices\": (array of strings representing services involved)\n" +
                    "- \"recommendations\": (array of strings recommending SRE actions)\n" +
                    "- \"actionLinks\": (array of objects with \"label\" and \"route\" keys. e.g. [{\"label\": \"View RCA\", \"route\": \"/rca\"}])\n" +
                    "- \"dataSources\": (array of strings representing evidence sources, e.g. [\"Gemini LLM Inference\", \"PostgreSQL Incident Logs\"])\n";

            String userMessageText = systemInstructions + "\n\nUser Question: " + userPrompt;

            Map<String, Object> requestBody = Map.of(
                    "contents", List.of(
                            Map.of("parts", List.of(
                                    Map.of("text", userMessageText)
                              ))
                    )
            );

            String requestBodyJson = objectMapper.writeValueAsString(requestBody);

            HttpRequest request = HttpRequest.newBuilder()
                    .uri(URI.create("https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=" + apiKey))
                    .header("Content-Type", "application/json")
                    .POST(HttpRequest.BodyPublishers.ofString(requestBodyJson))
                    .build();

            HttpResponse<String> response = httpClient.send(request, HttpResponse.BodyHandlers.ofString());

            if (response.statusCode() == 200) {
                JsonNode rootNode = objectMapper.readTree(response.body());
                String responseText = rootNode
                        .path("candidates")
                        .path(0)
                        .path("content")
                        .path("parts")
                        .path(0)
                        .path("text")
                        .asText();

                if (responseText.contains("```json")) {
                    responseText = responseText.substring(responseText.indexOf("```json") + 7);
                    if (responseText.contains("```")) {
                        responseText = responseText.substring(0, responseText.indexOf("```"));
                    }
                } else if (responseText.contains("```")) {
                    responseText = responseText.substring(responseText.indexOf("```") + 3);
                    if (responseText.contains("```")) {
                        responseText = responseText.substring(0, responseText.indexOf("```"));
                    }
                }
                responseText = responseText.trim();

                try {
                    Map<String, Object> geminiMap = objectMapper.readValue(responseText, Map.class);
                    if (geminiMap.containsKey("answer")) {
                        return geminiMap;
                    }
                } catch (Exception parseEx) {
                    Map<String, Object> fallback = new HashMap<>();
                    fallback.put("answer", responseText);
                    fallback.put("riskLevel", "LOW");
                    fallback.put("confidenceScore", 0.8);
                    fallback.put("affectedServices", List.of());
                    fallback.put("recommendations", List.of("Review Gemini raw response text"));
                    fallback.put("actionLinks", List.of(Map.of("label", "Platform Dashboard", "route", "/")));
                    fallback.put("dataSources", List.of("Gemini LLM Raw Text"));
                    return fallback;
                }
            }
        } catch (Exception e) {
            // Log or fallback
        }
        return null;
    }
}
