package com.expensetracker.repository;

import com.expensetracker.entity.Transaction;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface TransactionRepository extends JpaRepository<Transaction, Long> {
    List<Transaction> findByUserId(Long userId);
    List<Transaction> findByUserIdAndDateBetween(Long userId, LocalDate startDate, LocalDate endDate);
    List<Transaction> findByUserIdAndCategoryId(Long userId, Long categoryId);
    List<Transaction> findByUserIdAndType(Long userId, Transaction.TransactionType type);
}
