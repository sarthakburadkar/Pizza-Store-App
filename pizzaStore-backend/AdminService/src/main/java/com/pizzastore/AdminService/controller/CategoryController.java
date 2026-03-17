package com.pizzastore.AdminService.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.pizzastore.AdminService.entity.Category;
import com.pizzastore.AdminService.service.CategoryService;

@RestController
@RequestMapping("/admin/category")
public class CategoryController {
	@Autowired
    CategoryService categoryService;

    // ADD category
    
    @PostMapping
    public ResponseEntity<Category> addCategory(@RequestBody Category category) {
        return ResponseEntity.ok(categoryService.addCategory(category));
    }

    // GET all categories
    
    @GetMapping
    public ResponseEntity<List<Category>> getAllCategories() {
        return ResponseEntity.ok(categoryService.getAllCategories());
    }

    // UPDATE category
    
    @PutMapping("/{id}")
    public ResponseEntity<Category> updateCategory(
            @PathVariable int id,
            @RequestBody Category category) {
        return ResponseEntity.ok(categoryService.updateCategory(id, category));
    }

    // DELETE category
    
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteCategory(@PathVariable int id) {
        return ResponseEntity.ok(categoryService.deleteCategory(id));
    }
}
