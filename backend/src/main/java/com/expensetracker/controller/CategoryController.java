package com.expensetracker.controller;

import com.expensetracker.entity.Category;
import com.expensetracker.service.CategoryService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/categories")
@CrossOrigin(origins = "*")
@RequiredArgsConstructor
public class CategoryController {

    private final CategoryService categoryService;

    /**
     * Get all categories (predefined + custom)
     * GET /api/categories?userId={userId}
     */
    @GetMapping
    public ResponseEntity<List<Category>> getAllCategories(@RequestParam Long userId) {
        List<Category> categories = categoryService.getAllCategories(userId);
        return ResponseEntity.ok(categories);
    }

    /**
     * Get predefined categories only
     * GET /api/categories/predefined
     */
    @GetMapping("/predefined")
    public ResponseEntity<List<Category>> getPredefinedCategories() {
        List<Category> categories = categoryService.getPredefinedCategories();
        return ResponseEntity.ok(categories);
    }

    /**
     * Get user's custom categories
     * GET /api/categories/custom?userId={userId}
     */
    @GetMapping("/custom")
    public ResponseEntity<List<Category>> getCustomCategories(@RequestParam Long userId) {
        List<Category> categories = categoryService.getCustomCategories(userId);
        return ResponseEntity.ok(categories);
    }

    /**
     * Create a custom category
     * POST /api/categories?userId={userId}
     */
    @PostMapping
    public ResponseEntity<Category> createCustomCategory(
            @RequestParam Long userId,
            @RequestBody Map<String, String> request) {
        String categoryName = request.get("name");
        Category category = categoryService.createCustomCategory(userId, categoryName);
        return ResponseEntity.status(HttpStatus.CREATED).body(category);
    }

    /**
     * Get category by ID
     * GET /api/categories/{id}
     */
    @GetMapping("/{id}")
    public ResponseEntity<?> getCategoryById(@PathVariable Long id) {
        try {
            Category category = categoryService.getCategoryById(id);
            return ResponseEntity.ok(category);
        } catch (IllegalArgumentException e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(error);
        }
    }

    /**
     * Delete a custom category
     * DELETE /api/categories/{id}?userId={userId}
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteCustomCategory(@PathVariable Long id, @RequestParam Long userId) {
        try {
            categoryService.deleteCustomCategory(id, userId);
            Map<String, String> response = new HashMap<>();
            response.put("message", "Category deleted successfully");
            return ResponseEntity.ok(response);
        } catch (IllegalArgumentException e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
        }
    }
}
