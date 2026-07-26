package com.finance.core.service;

import com.finance.core.dto.*;
import com.finance.core.entity.Budget;
import com.finance.core.entity.RecurringTransaction;
import com.finance.core.entity.Transaction;
import com.finance.core.kafka.TransactionProducer;
import com.finance.core.repository.BudgetRepository;
import com.finance.core.repository.RecurringTransactionRepository;
import com.finance.core.repository.TransactionRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class FinanceService {

    private final TransactionRepository transactionRepository;
    private final BudgetRepository budgetRepository;
    private final RecurringTransactionRepository recurringTransactionRepository;
    private final TransactionProducer transactionProducer;

    // ← ADD THESE 3 LINES HERE
    @Value("${ai.chat.service.url:http://localhost:8083}")
    private String aiChatServiceUrl;

    @Value("${spring.profiles.active:local}")
    private String activeProfile;

    private RestTemplate restTemplate = new RestTemplate();

    public TransactionResponse addTransaction(
            String userId,
            String userEmail,
            TransactionRequest request
    ){
        Transaction transaction = Transaction.builder()
                .userId(userId)
                .userEmail(userEmail)
                .title(request.getTitle())
                .amount(request.getAmount())
                .category(request.getCategory())
                .type(request.getType())
                .description(request.getDescription())
                .transactionDate(LocalDateTime.now())
                .createdAt(LocalDateTime.now())
                .build();

        Transaction saved = transactionRepository.save(transaction);

        // Update budget if it's an expense
        if("EXPENSE".equals(request.getType())){
            updateBudgetSpent(userId, request.getCategory(), request.getAmount());
        }

        // Publish to Kafka
        TransactionEvent event = TransactionEvent.builder()
                .transactionId(saved.getId())
                .userId(userId)
                .userEmail(userEmail)
                .title(saved.getTitle())
                .amount(saved.getAmount())
                .category(saved.getCategory())
                .type(saved.getType())
                .transactionDate(saved.getTransactionDate())
                .build();

        //transactionProducer.publishTransaction(event);

        if ("prod".equals(activeProfile)) {
            // Production: direct HTTP call
            notifyAiChatService(event);
        } else {
            // Local: use Kafka
            transactionProducer.publishTransaction(event);
        }

        return TransactionResponse.builder()
                .id(saved.getId())
                .userId(userId)
                .userEmail(userEmail)
                .title(saved.getTitle())
                .amount(saved.getAmount())
                .category(saved.getCategory())
                .type(saved.getType())
                .description(saved.getDescription())
                .transactionDate(saved.getTransactionDate())
                .message("Transaction added successfully!")
                .build();
    }

    public List<Transaction> getAllTransactions(String userId){
        return transactionRepository.findByUserId(userId);
    }

    public List<Transaction> getTransactionsByCategory(
            String userId, String category) {
        return transactionRepository
                .findByUserIdAndCategory(userId, category);
    }

    public SummaryResponse getMonthlySummary(String userId, int month, int year){
        LocalDateTime start = LocalDateTime.of(year, month, 1,0 ,0);
        LocalDateTime end = start.plusMonths(1).minusSeconds(1);

        List<Transaction> transactions = transactionRepository.findByUserIdAndTransactionDateBetween(userId, start, end);

        BigDecimal totalIncome = transactions.stream()
                .filter(t -> "INCOME".equals(t.getType()))
                .map(Transaction::getAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        BigDecimal totalExpense = transactions.stream()
                .filter(t -> "EXPENSE".equals(t.getType()))
                .map(Transaction::getAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        BigDecimal balance = totalIncome.subtract(totalExpense);

        BigDecimal savingsRate = BigDecimal.ZERO;
        if(totalIncome.compareTo(BigDecimal.ZERO) > 0){
            savingsRate = balance.divide(totalIncome, 4, RoundingMode.HALF_UP)
                    .multiply(BigDecimal.valueOf(100))
                    .setScale(2, RoundingMode.HALF_UP);
        }

        return SummaryResponse.builder()
                .totalIncome(totalIncome)
                .totalExpense(totalExpense)
                .balance(balance)
                .savingsRate(savingsRate)
                .month(month)
                .year(year)
                .build();
    }

    public Budget createBudget(
            String userId, BudgetRequest request) {
        Budget budget = Budget.builder()
                .userId(userId)
                .category(request.getCategory())
                .monthlyLimit(request.getMonthlyLimit())
                .spent(BigDecimal.ZERO)
                .month(request.getMonth())
                .year(request.getYear())
                .build();
        return budgetRepository.save(budget);
    }

    public List<Budget> getBudgets(
            String userId, int month, int year) {
        return budgetRepository
                .findByUserIdAndMonthAndYear(
                        userId, month, year);
    }

    private void updateBudgetSpent(
            String userId,
            String category,
            BigDecimal amount) {

        LocalDateTime now = LocalDateTime.now();
        int month = now.getMonthValue();
        int year = now.getYear();

        budgetRepository
                .findByUserIdAndCategoryAndMonthAndYear(
                        userId, category, month, year)
                .ifPresent(budget -> {
                    BigDecimal currentSpent = budget.getSpent();
                    BigDecimal newSpent = currentSpent.add(amount);
                    budget.setSpent(newSpent);
                    budgetRepository.save(budget);
                    log.info("Budget updated for category: {}",
                            category);
                });
    }
    public void deleteTransaction(String id) {
        transactionRepository.deleteById(id);
    }

    public Transaction updateTransaction(
            String id, TransactionRequest request) {
        Transaction tx = transactionRepository
                .findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Transaction not found"));
        tx.setTitle(request.getTitle());
        tx.setAmount(request.getAmount());
        tx.setCategory(request.getCategory());
        tx.setType(request.getType());
        tx.setDescription(request.getDescription());
        return transactionRepository.save(tx);
    }

    public RecurringTransaction createRecurring(
            String userId, RecurringRequest request) {
        RecurringTransaction recurring =
                RecurringTransaction.builder()
                        .userId(userId)
                        .title(request.getTitle())
                        .amount(request.getAmount())
                        .category(request.getCategory())
                        .type(request.getType())
                        .description(request.getDescription())
                        .dayOfMonth(request.getDayOfMonth())
                        .active(true)
                        .createdAt(LocalDateTime.now())
                        .build();
        return recurringTransactionRepository.save(recurring);
    }

    public List<RecurringTransaction> getRecurring(
            String userId) {
        return recurringTransactionRepository
                .findByUserIdAndActive(userId, true);
    }

    public void deleteRecurring(String id) {
        recurringTransactionRepository.findById(id)
                .ifPresent(r -> {
                    r.setActive(false);
                    recurringTransactionRepository.save(r);
                });
    }
    private void notifyAiChatService(
            TransactionEvent event) {
        try {
            restTemplate.postForObject(
                    aiChatServiceUrl +
                            "/api/internal/transaction",
                    event,
                    Void.class);
            log.info("AI Chat Service notified: {}",
                    event.getTransactionId());
        } catch (Exception e) {
            log.warn("Could not notify AI Chat: {}",
                    e.getMessage());
        }
    }

}
