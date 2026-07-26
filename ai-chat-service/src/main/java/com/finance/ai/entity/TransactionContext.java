package com.finance.ai.entity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Document(collection = "transaction_context")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TransactionContext {

    @Id
    private String id;
    private String transactionId;
    private String userId;
    private String userEmail;
    private String title;
    private BigDecimal amount;
    private String category;
    private String type;
    private LocalDateTime transactionDate;
}