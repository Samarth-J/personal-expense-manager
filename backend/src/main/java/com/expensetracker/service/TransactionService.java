package com.expensetracker.service;

import com.expensetracker.entity.Transaction;
import com.expensetracker.repository.TransactionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
public class TransactionService {

    private final TransactionRepository transactionRepository;

    /**
     * Add a new transaction
     * @param transaction Transaction object with all required fields
     * @return Saved transaction with generated ID
     */
    public Transaction addTransaction(Transaction transaction) {
        // Validate transaction date is not in the future
        if (transaction.getDate().isAfter(LocalDate.now())) {
            throw new IllegalArgumentException("Transaction date cannot be in the future");
        }
        
        // Validate amount is positive
        if (transaction.getAmount().signum() <= 0) {
            throw new IllegalArgumentException("Transaction amount must be positive");
        }
        
        return transactionRepository.save(transaction);
    }

    /**
     * Get all transactions for a user
     * @param userId User ID
     * @return List of transactions
     */
    public List<Transaction> getTransactions(Long userId) {
        return transactionRepository.findByUserId(userId);
    }

    /**
     * Get transaction by ID
     * @param id Transaction ID
     * @param userId User ID (for authorization check)
     * @return Transaction if found and belongs to user
     */
    public Transaction getTransactionById(Long id, Long userId) {
        Transaction transaction = transactionRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Transaction not found with id: " + id));
        
        // Verify transaction belongs to the user
        if (!transaction.getUserId().equals(userId)) {
            throw new IllegalArgumentException("Unauthorized access to transaction");
        }
        
        return transaction;
    }

    /**
     * Get transactions by date range
     * @param userId User ID
     * @param startDate Start date (inclusive)
     * @param endDate End date (inclusive)
     * @return List of transactions in date range
     */
    public List<Transaction> getTransactionsByDateRange(Long userId, LocalDate startDate, LocalDate endDate) {
        if (startDate.isAfter(endDate)) {
            throw new IllegalArgumentException("Start date must be before or equal to end date");
        }
        return transactionRepository.findByUserIdAndDateBetween(userId, startDate, endDate);
    }

    /**
     * Get transactions by category
     * @param userId User ID
     * @param categoryId Category ID
     * @return List of transactions in category
     */
    public List<Transaction> getTransactionsByCategory(Long userId, Long categoryId) {
        return transactionRepository.findByUserIdAndCategoryId(userId, categoryId);
    }

    /**
     * Get transactions by type (INCOME or EXPENSE)
     * @param userId User ID
     * @param type Transaction type
     * @return List of transactions of specified type
     */
    public List<Transaction> getTransactionsByType(Long userId, Transaction.TransactionType type) {
        return transactionRepository.findByUserIdAndType(userId, type);
    }

    /**
     * Update an existing transaction
     * @param id Transaction ID
     * @param userId User ID (for authorization check)
     * @param updatedTransaction Updated transaction data
     * @return Updated transaction
     */
    public Transaction updateTransaction(Long id, Long userId, Transaction updatedTransaction) {
        Transaction existingTransaction = getTransactionById(id, userId);
        
        // Validate updated date
        if (updatedTransaction.getDate().isAfter(LocalDate.now())) {
            throw new IllegalArgumentException("Transaction date cannot be in the future");
        }
        
        // Validate amount
        if (updatedTransaction.getAmount().signum() <= 0) {
            throw new IllegalArgumentException("Transaction amount must be positive");
        }
        
        existingTransaction.setCategoryId(updatedTransaction.getCategoryId());
        existingTransaction.setAmount(updatedTransaction.getAmount());
        existingTransaction.setType(updatedTransaction.getType());
        existingTransaction.setDate(updatedTransaction.getDate());
        existingTransaction.setDescription(updatedTransaction.getDescription());
        
        return transactionRepository.save(existingTransaction);
    }

    /**
     * Delete a transaction
     * @param id Transaction ID
     * @param userId User ID (for authorization check)
     */
    public void deleteTransaction(Long id, Long userId) {
        Transaction transaction = getTransactionById(id, userId);
        transactionRepository.delete(transaction);
    }

    /**
     * Delete all transactions for a user
     * @param userId User ID
     */
    public void deleteAllTransactionsByUser(Long userId) {
        List<Transaction> transactions = transactionRepository.findByUserId(userId);
        transactionRepository.deleteAll(transactions);
    }
}
