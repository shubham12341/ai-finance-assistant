package com.finance.core.controller;

import com.finance.core.dto.*;
import com.finance.core.entity.Budget;
import com.finance.core.entity.RecurringTransaction;
import com.finance.core.entity.Transaction;
import com.finance.core.service.FinanceService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/finance")
@RequiredArgsConstructor
@CrossOrigin(origins = {
        "http://localhost:5173",
        "https://ai-finance-assistant.vercel.app",
        "*"
})
public class FinanceController {

    private final FinanceService financeService;

    @PostMapping("/transactions")
    public ResponseEntity<TransactionResponse> addTransaction(
            HttpServletRequest request,
            @RequestBody TransactionRequest body) {
        String userId = (String) request
                .getAttribute("userId");
        String userEmail = (String) request
                .getAttribute("userEmail");
        return ResponseEntity.ok(
                financeService.addTransaction(
                        userId, userEmail, body));
    }

    @GetMapping("/transactions")
    public ResponseEntity<List<Transaction>>
    getAllTransactions(
            HttpServletRequest request) {
        String userId = (String) request
                .getAttribute("userId");
        return ResponseEntity.ok(
                financeService.getAllTransactions(userId));
    }

    @GetMapping("/transactions/category/{category}")
    public ResponseEntity<List<Transaction>>
    getByCategory(
            HttpServletRequest request,
            @PathVariable String category) {
        String userId = (String) request
                .getAttribute("userId");
        return ResponseEntity.ok(
                financeService.getTransactionsByCategory(
                        userId, category));
    }

    @GetMapping("/summary")
    public ResponseEntity<SummaryResponse>
    getMonthlySummary(
            HttpServletRequest request,
            @RequestParam int month,
            @RequestParam int year) {
        String userId = (String) request
                .getAttribute("userId");
        return ResponseEntity.ok(
                financeService.getMonthlySummary(
                        userId, month, year));
    }

    @PostMapping("/budgets")
    public ResponseEntity<Budget> createBudget(
            HttpServletRequest request,
            @RequestBody BudgetRequest body) {
        String userId = (String) request
                .getAttribute("userId");
        return ResponseEntity.ok(
                financeService.createBudget(
                        userId, body));
    }

    @GetMapping("/budgets")
    public ResponseEntity<List<Budget>> getBudgets(
            HttpServletRequest request,
            @RequestParam int month,
            @RequestParam int year) {
        String userId = (String) request
                .getAttribute("userId");
        return ResponseEntity.ok(
                financeService.getBudgets(
                        userId, month, year));
    }

    @GetMapping("/health")
    public ResponseEntity<String> health() {
        return ResponseEntity.ok(
                "Finance Service is running! ✅");
    }

    @PutMapping("/transactions/{id}")
    public ResponseEntity<Transaction> updateTransaction(
            @PathVariable String id,
            @RequestBody TransactionRequest body) {
        return ResponseEntity.ok(
                financeService.updateTransaction(id, body));
    }

    @DeleteMapping("/transactions/{id}")
    public ResponseEntity<Void> deleteTransaction(
            @PathVariable String id) {
        financeService.deleteTransaction(id);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/recurring")
    public ResponseEntity<RecurringTransaction>
    createRecurring(
            HttpServletRequest request,
            @RequestBody RecurringRequest body) {
        String userId = (String) request
                .getAttribute("userId");
        return ResponseEntity.ok(
                financeService.createRecurring(userId, body));
    }

    @GetMapping("/recurring")
    public ResponseEntity<List<RecurringTransaction>>
    getRecurring(HttpServletRequest request) {
        String userId = (String) request
                .getAttribute("userId");
        return ResponseEntity.ok(
                financeService.getRecurring(userId));
    }

    @DeleteMapping("/recurring/{id}")
    public ResponseEntity<Void> deleteRecurring(
            @PathVariable String id) {
        financeService.deleteRecurring(id);
        return ResponseEntity.ok().build();
    }
}