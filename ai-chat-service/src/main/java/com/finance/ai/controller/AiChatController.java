package com.finance.ai.controller;

import com.finance.ai.dto.ChatRequest;
import com.finance.ai.dto.ChatResponse;
import com.finance.ai.dto.TransactionEvent;
import com.finance.ai.entity.ChatMessage;
import com.finance.ai.service.AiChatService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/chat")
@RequiredArgsConstructor
@CrossOrigin(origins = {
        "http://localhost:5173",
        "https://ai-finance-assistant.vercel.app",
        "*"
})
public class AiChatController {

    private final AiChatService aiChatService;

    @PostMapping("/message")
    public ResponseEntity<ChatResponse> chat(
            HttpServletRequest request,
            @RequestBody ChatRequest body) {
        String userId = (String) request
                .getAttribute("userId");
        return ResponseEntity.ok(
                aiChatService.chat(userId, body));
    }

    @GetMapping("/history")
    public ResponseEntity<List<ChatMessage>> history(
            HttpServletRequest request) {
        String userId = (String) request
                .getAttribute("userId");
        return ResponseEntity.ok(
                aiChatService.getChatHistory(userId));
    }

    @GetMapping("/health")
    public ResponseEntity<String> health() {
        return ResponseEntity.ok(
                "AI Chat Service is running! ✅");
    }
    @DeleteMapping("/history")
    public ResponseEntity<Void> clearHistory(
            HttpServletRequest request) {
        String userId = (String) request
                .getAttribute("userId");
        aiChatService.clearChatHistory(userId);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/internal/transaction")
    public ResponseEntity<Void> receiveTransaction(
            @RequestBody TransactionEvent body) {
        aiChatService.saveTransactionContext(body);
        return ResponseEntity.ok().build();
    }
}