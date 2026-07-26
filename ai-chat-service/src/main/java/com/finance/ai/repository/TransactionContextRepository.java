package com.finance.ai.repository;

import com.finance.ai.entity.TransactionContext;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface TransactionContextRepository
        extends MongoRepository<TransactionContext, String> {

    List<TransactionContext> findByUserId(String userId);

    List<TransactionContext> findByUserIdAndCategory(
            String userId, String category);
}