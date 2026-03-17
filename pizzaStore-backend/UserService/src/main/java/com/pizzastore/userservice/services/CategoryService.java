package com.pizzastore.userservice.services;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.pizzastore.userservice.entity.Category;
import com.pizzastore.userservice.repository.CategoryRepository;

@Service
public class CategoryService {
	
	@Autowired
	CategoryRepository categoryrepo;
	
	// Fetch all categories
    public List<Category> getAllCategories() {
        return categoryrepo.findAll();
    }
    
    public Category addCategory(Category category) {
        return categoryrepo.save(category);
    }

    public Category updateCategory(int id, Category updatedCategory) {
        Category existing = categoryrepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Category not found!"));
        existing.setName(updatedCategory.getName());
        return categoryrepo.save(existing);
    }

    public void deleteCategory(int id) {
        categoryrepo.deleteById(id);
    }
}
