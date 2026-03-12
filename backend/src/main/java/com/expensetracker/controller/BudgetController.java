package com.expensetracker.controller;

import com.expensetracker.entity.Budget;
import com.expensetracker.service.BudgetService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/budgets")
@CrossOrigin(origins = "*")
@RequiredArgsConstructor
public class BudgetController {

    private final BudgetService budgetService;

    /**
     * Create a new budget
     * POST /api/budgets
     */
    @PostMapping
    public ResponseEntity<?> createBudget(@RequestBody Budget budget) {
        try {
            Budget createdBudget = budgetService.createBudget(budget);
            return ResponseEntity.status(HttpStatus.CREATED).body(createdBudget);
        } catch (IllegalArgumentException e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
        }
    }

    /**
     * Get all budgets for a user
     * GET /api/budgets?userId={userId}
     */
    @GetMapping
    public ResponseEntity<List<Budget>> getBudgetsByUser(@RequestParam Long userId) {
        List<Budget> budgets = budgetService.getBudgetsByUser(userId);
        return ResponseEntity.ok(budgets);
    }

    /**
     * Get budgets for a specific period
     * GET /api/budgets/period?userId={userId}&period={period}
     */
    @GetMapping("/period")
    public ResponseEntity<List<Budget>> getBudgetsByPeriod(
            @RequestParam Long userId,
            @RequestParam String period) {
        List<Budget> budgets = budgetService.getBudgetsByPeriod(userId, period);
        return ResponseEntity.ok(budgets);
    }

    /**
     * Get current month's budgets
     * GET /api/budgets/current?userId={userId}
     */
    @GetMapping("/current")
    public ResponseEntity<List<Budget>> getCurrentMonthBudgets(@RequestParam Long userId) {
        List<Budget> budgets = budgetService.getCurrentMonthBudgets(userId);
        return ResponseEntity.ok(budgets);
    }

    /**
     * Get budget by ID
     * GET /api/budgets/{id}?userId={userId}
     */
    @GetMapping("/{id}")
    public ResponseEntity<?> getBudgetById(@PathVariable Long id, @RequestParam Long userId) {
        try {
            Budget budget = budgetService.getBudgetById(id, userId);
            return ResponseEntity.ok(budget);
        } catch (IllegalArgumentException e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(error);
        }
    }

    /**
     * Update a budget
     * PUT /api/budgets/{id}?userId={userId}
     */
    @PutMapping("/{id}")
    public ResponseEntity<?> updateBudget(
            @PathVariable Long id,
            @RequestParam Long userId,
            @RequestBody Budget budget) {
        try {
            Budget updatedBudget = budgetService.updateBudget(id, userId, budget);
            return ResponseEntity.ok(updatedBudget);
        } catch (IllegalArgumentException e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
        }
    }

    /**
     * Delete a budget
     * DELETE /api/budgets/{id}?userId={userId}
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteBudget(@PathVariable Long id, @RequestParam Long userId) {
        try {
            budgetService.deleteBudget(id, userId);
            Map<String, String> response = new HashMap<>();
            response.put("message", "Budget deleted successfully");
            return ResponseEntity.ok(response);
        } catch (IllegalArgumentException e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(error);
        }
    }

    /**
     * Get budget utilization percentage
     * GET /api/budgets/{id}/utilization?userId={userId}
     */
    @GetMapping("/{id}/utilization")
    public ResponseEntity<?> getBudgetUtilization(@PathVariable Long id, @RequestParam Long userId) {
        try {
            BigDecimal utilization = budgetService.calculateBudgetUtilization(id, userId);
            Map<String, Object> response = new HashMap<>();
            response.put("budgetId", id);
            response.put("utilization", utilization);
            response.put("exceeded", utilization.compareTo(BigDecimal.valueOf(100)) > 0);
            return ResponseEntity.ok(response);
        } catch (IllegalArgumentException e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(error);
        }
    }
}
