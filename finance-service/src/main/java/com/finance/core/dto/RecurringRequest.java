package com.finance.core.dto;

import lombok.Data;
import java.math.BigDecimal;

@Data
public class RecurringRequest {
    private String title;
    private BigDecimal amount;
    private String category;
    private String type;
    private String description;
    private int dayOfMonth;
}