package com.finance.core.repository;

import com.finance.core.entity.RecurringTransaction;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface RecurringTransactionRepository
        extends MongoRepository<RecurringTransaction, String> {
    List<RecurringTransaction> findByUserIdAndActive(
            String userId, boolean active);
    List<RecurringTransaction> findByActive(boolean active);
}