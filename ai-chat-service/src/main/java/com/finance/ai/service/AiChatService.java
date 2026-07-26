package com.finance.ai.service;

import com.finance.ai.dto.ChatRequest;
import com.finance.ai.dto.ChatResponse;
import com.finance.ai.entity.ChatMessage;
import com.finance.ai.entity.TransactionContext;
import com.finance.ai.repository.ChatMessageRepository;
import com.finance.ai.repository.TransactionContextRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.ai.chat.client.ChatClient;
import org.springframework.stereotype.Service;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class AiChatService {

    private final ChatClient chatClient;
    private final ChatMessageRepository
            chatMessageRepository;
    private final TransactionContextRepository
            transactionContextRepository;

    public ChatResponse chat(
            String userId, ChatRequest request) {

        chatMessageRepository.save(
                ChatMessage.builder()
                        .userId(userId)
                        .role("USER")
                        .content(request.getMessage())
                        .timestamp(LocalDateTime.now())
                        .build());

        String context = buildContext(userId);
        String history = buildHistory(userId);
        String prompt = buildPrompt(
                context, history, request.getMessage());

        log.info("Calling Gemini for user: {}", userId);
        String aiResponse = chatClient.prompt()
                .user(prompt)
                .call()
                .content();

        chatMessageRepository.save(
                ChatMessage.builder()
                        .userId(userId)
                        .role("ASSISTANT")
                        .content(aiResponse)
                        .timestamp(LocalDateTime.now())
                        .build());

        return ChatResponse.builder()
                .message(aiResponse)
                .role("ASSISTANT")
                .timestamp(LocalDateTime.now())
                .build();
    }

    public List<ChatMessage> getChatHistory(
            String userId) {
        return chatMessageRepository
                .findByUserIdOrderByTimestampAsc(userId);
    }

    private String buildContext(String userId) {
        List<TransactionContext> transactions =
                transactionContextRepository
                        .findByUserId(userId);

        if (transactions.isEmpty()) {
            return "No transactions found yet.";
        }

        BigDecimal totalIncome = transactions.stream()
                .filter(t -> "INCOME".equals(t.getType()))
                .map(TransactionContext::getAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        BigDecimal totalExpense = transactions.stream()
                .filter(t -> "EXPENSE".equals(t.getType()))
                .map(TransactionContext::getAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        String list = transactions.stream()
                .map(t -> String.format(
                        "- %s: ₹%.2f (%s) [%s]",
                        t.getTitle(),
                        t.getAmount(),
                        t.getType(),
                        t.getCategory()))
                .collect(Collectors.joining("\n"));

        return String.format("""
                Financial Summary:
                Total Income  : ₹%.2f
                Total Expense : ₹%.2f
                Balance       : ₹%.2f
                
                Transactions:
                %s
                """,
                totalIncome,
                totalExpense,
                totalIncome.subtract(totalExpense),
                list);
    }

    private String buildHistory(String userId) {
        List<ChatMessage> history =
                chatMessageRepository
                        .findTop20ByUserIdOrderByTimestampDesc(
                                userId);
        if (history.isEmpty()) return "";
        return history.stream()
                .map(m -> m.getRole() + ": "
                        + m.getContent())
                .collect(Collectors.joining("\n"));
    }

    private String buildPrompt(
            String context,
            String history,
            String userMessage) {
        return String.format("""
                You are a helpful personal finance
                assistant for Indian users.
                Use ₹ for amounts. Be concise and friendly.
                
                %s
                
                %s
                
                User: %s
                """,
                context,
                history.isEmpty() ? "" :
                        "Previous Chat:\n" + history,
                userMessage);
    }
    public void clearChatHistory(String userId) {
        List<ChatMessage> messages =
                chatMessageRepository
                        .findByUserIdOrderByTimestampAsc(userId);
        chatMessageRepository.deleteAll(messages);
    }
}