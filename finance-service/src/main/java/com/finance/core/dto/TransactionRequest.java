package com.finance.core.dto;

import lombok.Data;

import java.math.BigDecimal;

@Data
public class TransactionRequest {
    private String title;
    private BigDecimal amount;
    private String category;
    private String type; // INCOME or EXPENSE
    private String description;
}
