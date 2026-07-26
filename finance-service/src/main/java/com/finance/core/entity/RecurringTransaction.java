package com.finance.core.entity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Document(collection = "recurring_transactions")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RecurringTransaction {

    @Id
    private String id;
    private String userId;
    private String title;
    private BigDecimal amount;
    private String category;
    private String type;
    private String description;
    private int dayOfMonth;
    private boolean active;
    private LocalDateTime createdAt;
    private LocalDateTime lastProcessed;
}