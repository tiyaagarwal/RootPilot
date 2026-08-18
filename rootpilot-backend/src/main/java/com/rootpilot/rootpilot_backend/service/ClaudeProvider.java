package com.rootpilot.rootpilot_backend.service;

import com.rootpilot.rootpilot_backend.dto.CopilotContext;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;

@Service
public class ClaudeProvider implements AIProvider {
    @Override
    public Map<String, Object> getResponse(String userPrompt, CopilotContext systemContext, java.util.List<String> chatHistory) {
        // Claude connector stub
        Map<String, Object> mockResponse = new HashMap<>();
        mockResponse.put("answer", "### [Claude Provider Status]\n\nClaude integration is configured. Please set the environment API keys in application.yml to activate Claude.");
        mockResponse.put("riskLevel", "LOW");
        mockResponse.put("confidenceScore", 1.0);
        mockResponse.put("affectedServices", java.util.List.of());
        mockResponse.put("recommendations", java.util.List.of("Set CLAUDE_API_KEY"));
        return mockResponse;
    }
}
