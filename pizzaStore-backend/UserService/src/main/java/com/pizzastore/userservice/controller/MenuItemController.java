package com.pizzastore.userservice.controller;

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

import com.pizzastore.userservice.entity.MenuItem;
import com.pizzastore.userservice.services.MenuItemService;

@RestController
@RequestMapping("/user/menu")
public class MenuItemController {
	@Autowired
    private MenuItemService menuItemService;

    // Get all menu items
    @GetMapping
    public List<MenuItem> getAllMenuItems() {
        return menuItemService.getAllMenuItems();
    }

    // Get menu items by category ID
    @GetMapping("/category/{id}")
    public List<MenuItem> getMenuItemsByCategory(@PathVariable("id") int categoryId) {
        return menuItemService.getMenuItemsByCategory(categoryId);
    }
    
 // Add menu item (called by Admin Service for sync)
    @PostMapping
    public ResponseEntity<MenuItem> addMenuItem(@RequestBody MenuItem menuItem) {
        return ResponseEntity.ok(menuItemService.addMenuItem(menuItem));
    }
    
 // Update menu item (called by Admin Service)
    @PutMapping("/{id}")
    public ResponseEntity<MenuItem> updateMenuItem(
            @PathVariable int id,
            @RequestBody MenuItem menuItem) {
        return ResponseEntity.ok(menuItemService.updateMenuItem(id, menuItem));
    }

    // Delete menu item (called by Admin Service)
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteMenuItem(@PathVariable int id) {
        menuItemService.deleteMenuItem(id);
        return ResponseEntity.ok("Menu item deleted");
    }
}
