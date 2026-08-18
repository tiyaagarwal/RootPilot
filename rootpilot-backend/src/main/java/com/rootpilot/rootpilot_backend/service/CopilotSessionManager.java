package com.rootpilot.rootpilot_backend.service;

import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Component
public class CopilotSessionManager {

    // Thread-safe map to store conversation history per user session
    private final Map<String, List<String>> sessions = new ConcurrentHashMap<>();

    public List<String> getHistory(String sessionId) {
        return sessions.computeIfAbsent(sessionId, k -> new ArrayList<>());
    }

    public void append(String sessionId, String prompt, String answer) {
        List<String> history = getHistory(sessionId);
        history.add("User: " + prompt);
        history.add("Assistant: " + answer);
        
        // Keep history window to last 10 messages to avoid context overflow
        if (history.size() > 20) {
            history.remove(0);
            history.remove(0);
        }
    }

    public void clear(String sessionId) {
        sessions.remove(sessionId);
    }
}
