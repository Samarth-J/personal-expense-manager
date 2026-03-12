package com.expensetracker.service;

import com.expensetracker.entity.Budget;
import com.expensetracker.entity.Transaction;
import com.expensetracker.repository.BudgetRepository;
import com.expensetracker.repository.TransactionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.time.YearMonth;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class BudgetService {

    private final BudgetRepository budgetRepository;
    private final TransactionRepository transactionRepository;

    /**
     * Create a new budget
     * @param budget Budget object with userId, categoryId, amount, and period
     * @return Created budget
     */
    public Budget createBudget(Budget budget) {
        // Validate amount is positive
        if (budget.getAmount().signum() <= 0) {
            throw new IllegalArgumentException("Budget amount must be positive");
        }
        
        // Check if budget already exists for this category and period
        Optional<Budget> existing = budgetRepository.findByUserIdAndCategoryIdAndPeriod(
                budget.getUserId(), budget.getCategoryId(), budget.getPeriod());
        
        if (existing.isPresent()) {
            throw new IllegalArgumentException("Budget already exists for this category and period");
        }
        
        return budgetRepository.save(budget);
    }

    /**
     * Get all budgets for a user
     * @param userId User ID
     * @return List of budgets
     */
    public List<Budget> getBudgetsByUser(Long userId) {
        return budgetRepository.findByUserId(userId);
    }

    /**
     * Get budgets for a specific period
     * @param userId User ID
     * @param period Period in YYYY-MM format
     * @return List of budgets for the period
     */
    public List<Budget> getBudgetsByPeriod(Long userId, String period) {
        return budgetRepository.findByUserIdAndPeriod(userId, period);
    }

    /**
     * Get budget by ID
     * @param id Budget ID
     * @param userId User ID (for authorization check)
     * @return Budget if found and belongs to user
     */
    public Budget getBudgetById(Long id, Long userId) {
        Budget budget = budgetRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Budget not found with id: " + id));
        
        if (!budget.getUserId().equals(userId)) {
            throw new IllegalArgumentException("Unauthorized access to budget");
        }
        
        return budget;
    }

    /**
     * Update a budget
     * @param id Budget ID
     * @param userId User ID (for authorization check)
     * @param updatedBudget Updated budget data
     * @return Updated budget
     */
    public Budget updateBudget(Long id, Long userId, Budget updatedBudget) {
        Budget existingBudget = getBudgetById(id, userId);
        
        // Validate amount
        if (updatedBudget.getAmount().signum() <= 0) {
            throw new IllegalArgumentException("Budget amount must be positive");
        }
        
        existingBudget.setAmount(updatedBudget.getAmount());
        
        return budgetRepository.save(existingBudget);
    }

    /**
     * Delete a budget
     * @param id Budget ID
     * @param userId User ID (for authorization check)
     */
    public void deleteBudget(Long id, Long userId) {
        Budget budget = getBudgetById(id, userId);
        budgetRepository.delete(budget);
    }

    /**
     * Calculate budget utilization percentage
     * @param budgetId Budget ID
     * @param userId User ID
     * @return Utilization percentage (0-100+)
     */
    public BigDecimal calculateBudgetUtilization(Long budgetId, Long userId) {
        Budget budget = getBudgetById(budgetId, userId);
        
        // Parse period to get date range
        YearMonth yearMonth = YearMonth.parse(budget.getPeriod(), DateTimeFormatter.ofPattern("yyyy-MM"));
        LocalDate startDate = yearMonth.atDay(1);
        LocalDate endDate = yearMonth.atEndOfMonth();
        
        // Get expenses for this category in this period
        List<Transaction> transactions = transactionRepository.findByUserIdAndDateBetween(
                userId, startDate, endDate);
        
        // Sum expenses for this category
        BigDecimal totalExpenses = transactions.stream()
                .filter(t -> t.getCategoryId().equals(budget.getCategoryId()))
                .filter(t -> t.getType() == Transaction.TransactionType.EXPENSE)
                .map(Transaction::getAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        
        // Calculate percentage
        if (budget.getAmount().compareTo(BigDecimal.ZERO) == 0) {
            return BigDecimal.ZERO;
        }
        
        return totalExpenses.multiply(BigDecimal.valueOf(100))
                .divide(budget.getAmount(), 2, RoundingMode.HALF_UP);
    }

    /**
     * Check if budget is exceeded
     * @param budgetId Budget ID
     * @param userId User ID
     * @return true if budget is exceeded
     */
    public boolean isBudgetExceeded(Long budgetId, Long userId) {
        BigDecimal utilization = calculateBudgetUtilization(budgetId, userId);
        return utilization.compareTo(BigDecimal.valueOf(100)) > 0;
    }

    /**
     * Get current month's budgets
     * @param userId User ID
     * @return List of current month budgets
     */
    public List<Budget> getCurrentMonthBudgets(Long userId) {
        String currentPeriod = YearMonth.now().format(DateTimeFormatter.ofPattern("yyyy-MM"));
        return budgetRepository.findByUserIdAndPeriod(userId, currentPeriod);
    }
}
