package com.finance.core.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class TransactionResponse {
    private String id;
    private String userId;
    private String userEmail;
    private String title;
    private BigDecimal amount;
    private String category;
    private String type;
    private String description;
    private LocalDateTime transactionDate;
    private String message;
}
