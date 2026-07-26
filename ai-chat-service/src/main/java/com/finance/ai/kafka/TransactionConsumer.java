package com.finance.ai.kafka;

import com.finance.ai.dto.TransactionEvent;
import com.finance.ai.entity.TransactionContext;
import com.finance.ai.repository.TransactionContextRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
@Slf4j
public class TransactionConsumer {

    private final TransactionContextRepository
            transactionContextRepository;

    @KafkaListener(
            topics = "transaction-events",
            groupId = "ai-chat-group"
    )
    public void consumeTransaction(
            TransactionEvent event) {
        log.info("Received transaction event: {}",
                event.getTransactionId());

        TransactionContext context =
                TransactionContext.builder()
                        .transactionId(event.getTransactionId())
                        .userId(event.getUserId())
                        .userEmail(event.getUserEmail())
                        .title(event.getTitle())
                        .amount(event.getAmount())
                        .category(event.getCategory())
                        .type(event.getType())
                        .transactionDate(event.getTransactionDate())
                        .build();

        transactionContextRepository.save(context);
        log.info("Transaction saved for user: {}",
                event.getUserId());
    }
}