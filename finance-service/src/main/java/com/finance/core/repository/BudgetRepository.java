package com.finance.core.repository;

import com.finance.core.entity.Budget;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface BudgetRepository
        extends MongoRepository<Budget, String> {

    List<Budget> findByUserId(String userId);

    Optional<Budget> findByUserIdAndCategoryAndMonthAndYear(
            String userId,
            String category,
            int month,
            int year);

    List<Budget> findByUserIdAndMonthAndYear(
            String userId,
            int month,
            int year);
}