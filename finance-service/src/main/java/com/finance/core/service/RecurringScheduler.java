package com.finance.core.service;

import com.finance.core.dto.TransactionEvent;
import com.finance.core.entity.RecurringTransaction;
import com.finance.core.entity.Transaction;
import com.finance.core.kafka.TransactionProducer;
import com.finance.core.repository.RecurringTransactionRepository;
import com.finance.core.repository.TransactionRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.List;

@Component
@RequiredArgsConstructor
@Slf4j
public class RecurringScheduler {

    private final RecurringTransactionRepository
            recurringRepo;
    private final TransactionRepository
            transactionRepository;
    private final TransactionProducer
            transactionProducer;

    @Scheduled(cron = "0 0 9 * * *") // runs 9am daily
    public void processRecurring() {
        int today = LocalDateTime.now().getDayOfMonth();
        List<RecurringTransaction> due =
                recurringRepo.findByActive(true)
                        .stream()
                        .filter(r -> r.getDayOfMonth() == today)
                        .toList();

        for (RecurringTransaction r : due) {
            log.info("Processing recurring: {}",
                    r.getTitle());
            Transaction tx = Transaction.builder()
                    .userId(r.getUserId())
                    .userEmail(r.getUserId())
                    .title(r.getTitle() + " (Recurring)")
                    .amount(r.getAmount())
                    .category(r.getCategory())
                    .type(r.getType())
                    .description(r.getDescription())
                    .transactionDate(LocalDateTime.now())
                    .createdAt(LocalDateTime.now())
                    .build();

            Transaction saved =
                    transactionRepository.save(tx);

            TransactionEvent event =
                    TransactionEvent.builder()
                            .transactionId(saved.getId())
                            .userId(r.getUserId())
                            .userEmail(r.getUserId())
                            .title(saved.getTitle())
                            .amount(saved.getAmount())
                            .category(saved.getCategory())
                            .type(saved.getType())
                            .transactionDate(
                                    saved.getTransactionDate())
                            .build();

            transactionProducer.publishTransaction(event);
            r.setLastProcessed(LocalDateTime.now());
            recurringRepo.save(r);
        }
    }
}