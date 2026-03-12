package com.expensetracker.service;

import com.expensetracker.entity.Category;
import com.expensetracker.repository.CategoryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class CategoryService {

    private final CategoryRepository categoryRepository;

    /**
     * Get all categories (predefined + user's custom categories)
     * @param userId User ID
     * @return List of all available categories
     */
    public List<Category> getAllCategories(Long userId) {
        List<Category> categories = new ArrayList<>();
        
        // Get predefined categories
        categories.addAll(categoryRepository.findByType(Category.CategoryType.PREDEFINED));
        
        // Get user's custom categories
        categories.addAll(categoryRepository.findByUserId(userId));
        
        return categories;
    }

    /**
     * Get predefined categories only
     * @return List of predefined categories
     */
    public List<Category> getPredefinedCategories() {
        return categoryRepository.findByType(Category.CategoryType.PREDEFINED);
    }

    /**
     * Get user's custom categories
     * @param userId User ID
     * @return List of custom categories
     */
    public List<Category> getCustomCategories(Long userId) {
        return categoryRepository.findByUserId(userId);
    }

    /**
     * Create a custom category
     * @param userId User ID
     * @param categoryName Category name
     * @return Created category
     */
    public Category createCustomCategory(Long userId, String categoryName) {
        Category category = new Category();
        category.setName(categoryName);
        category.setType(Category.CategoryType.CUSTOM);
        category.setUserId(userId);
        
        return categoryRepository.save(category);
    }

    /**
     * Get category by ID
     * @param id Category ID
     * @return Category if found
     */
    public Category getCategoryById(Long id) {
        return categoryRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Category not found with id: " + id));
    }

    /**
     * Delete a custom category
     * @param id Category ID
     * @param userId User ID (for authorization check)
     */
    public void deleteCustomCategory(Long id, Long userId) {
        Category category = getCategoryById(id);
        
        // Check if it's a predefined category
        if (category.getType() == Category.CategoryType.PREDEFINED) {
            throw new IllegalArgumentException("Cannot delete predefined category");
        }
        
        // Check if category belongs to user
        if (!category.getUserId().equals(userId)) {
            throw new IllegalArgumentException("Unauthorized access to category");
        }
        
        // TODO: Reassign transactions to "Other" category before deleting
        categoryRepository.delete(category);
    }
}
