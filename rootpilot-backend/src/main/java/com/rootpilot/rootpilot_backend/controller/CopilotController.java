package com.rootpilot.rootpilot_backend.controller;

import com.rootpilot.rootpilot_backend.dto.CopilotContext;
import com.rootpilot.rootpilot_backend.service.CopilotContextService;
import com.rootpilot.rootpilot_backend.service.CopilotSessionManager;
import com.rootpilot.rootpilot_backend.service.OperationalIntelligenceProvider;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/copilot")
public class CopilotController {

    private final CopilotContextService copilotContextService;
    private final OperationalIntelligenceProvider aiProvider;
    private final CopilotSessionManager sessionManager;

    public CopilotController(CopilotContextService copilotContextService,
                             OperationalIntelligenceProvider aiProvider,
                             CopilotSessionManager sessionManager) {
        this.copilotContextService = copilotContextService;
        this.aiProvider = aiProvider;
        this.sessionManager = sessionManager;
    }

    @PostMapping("/ask")
    public ResponseEntity<?> ask(@RequestBody Map<String, String> requestBody) {
        String question = requestBody.get("question");
        if (question == null || question.trim().isEmpty()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("message", "Question is required"));
        }

        // Get session based on active user context
        var authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = (authentication != null) ? authentication.getName() : "anonymous";

        // Aggregate real platform context dynamically
        CopilotContext platformContext = copilotContextService.getActiveContext();

        // Fetch user chat history
        List<String> chatHistory = sessionManager.getHistory(username);

        // Fetch reasoning output from OperationalIntelligenceProvider
        Map<String, Object> aiResponse = aiProvider.getResponse(question, platformContext, chatHistory);

        // Append this interaction to session memory
        String answer = (String) aiResponse.get("answer");
        sessionManager.append(username, question, answer);

        return ResponseEntity.ok(aiResponse);
    }
}
