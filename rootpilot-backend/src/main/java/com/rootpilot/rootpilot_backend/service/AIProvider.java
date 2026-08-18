package com.rootpilot.rootpilot_backend.service;

import com.rootpilot.rootpilot_backend.dto.CopilotContext;

import java.util.List;
import java.util.Map;

public interface AIProvider {
    Map<String, Object> getResponse(String userPrompt, CopilotContext systemContext, List<String> chatHistory);
}
