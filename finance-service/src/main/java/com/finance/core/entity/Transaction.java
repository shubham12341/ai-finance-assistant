package com.finance.core.entity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Document(collection = "transactions")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Transaction {

    @Id
    private String id;

    private String userId;
    private String userEmail;
    private String title;
    private BigDecimal amount;
    private String category;
    private String type; // INCOME or EXPENSE
    private String description;
    private LocalDateTime transactionDate;
    private LocalDateTime createdAt;
}
