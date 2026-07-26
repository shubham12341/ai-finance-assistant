package com.finance.core.dto;

import lombok.Data;
import java.math.BigDecimal;

@Data
public class BudgetRequest {
    private String category;
    private BigDecimal monthlyLimit;
    private int month;
    private int year;
}