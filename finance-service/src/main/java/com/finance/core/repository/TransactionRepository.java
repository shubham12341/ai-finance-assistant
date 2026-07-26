package com.finance.core.repository;

import com.finance.core.entity.Transaction;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;
import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface TransactionRepository
        extends MongoRepository<Transaction, String> {

    List<Transaction> findByUserId(String userId);

    List<Transaction> findByUserIdAndType(
            String userId, String type);

    List<Transaction> findByUserIdAndTransactionDateBetween(
            String userId,
            LocalDateTime start,
            LocalDateTime end);

    List<Transaction> findByUserIdAndCategory(
            String userId, String category);
}