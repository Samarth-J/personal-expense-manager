package com.expensetracker.config;

import com.expensetracker.entity.Category;
import com.expensetracker.repository.CategoryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.util.Arrays;
import java.util.List;

@Component
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {

    private final CategoryRepository categoryRepository;

    @Override
    public void run(String... args) {
        // Check if predefined categories already exist
        List<Category> existingCategories = categoryRepository.findByType(Category.CategoryType.PREDEFINED);
        
        if (existingCategories.isEmpty()) {
            // Create predefined categories
            List<Category> predefinedCategories = Arrays.asList(
                createCategory("Food & Dining", Category.CategoryType.PREDEFINED),
                createCategory("Transportation", Category.CategoryType.PREDEFINED),
                createCategory("Shopping", Category.CategoryType.PREDEFINED),
                createCategory("Entertainment", Category.CategoryType.PREDEFINED),
                createCategory("Bills & Utilities", Category.CategoryType.PREDEFINED),
                createCategory("Healthcare", Category.CategoryType.PREDEFINED),
                createCategory("Education", Category.CategoryType.PREDEFINED),
                createCategory("Travel", Category.CategoryType.PREDEFINED),
                createCategory("Groceries", Category.CategoryType.PREDEFINED),
                createCategory("Rent", Category.CategoryType.PREDEFINED),
                createCategory("Insurance", Category.CategoryType.PREDEFINED),
                createCategory("Salary", Category.CategoryType.PREDEFINED),
                createCategory("Investment", Category.CategoryType.PREDEFINED),
                createCategory("Other", Category.CategoryType.PREDEFINED)
            );
            
            categoryRepository.saveAll(predefinedCategories);
            System.out.println("✅ Initialized " + predefinedCategories.size() + " predefined categories");
        } else {
            System.out.println("✅ Predefined categories already exist (" + existingCategories.size() + " categories)");
        }
    }

    private Category createCategory(String name, Category.CategoryType type) {
        Category category = new Category();
        category.setName(name);
        category.setType(type);
        category.setUserId(null); // Predefined categories don't belong to any user
        return category;
    }
}
