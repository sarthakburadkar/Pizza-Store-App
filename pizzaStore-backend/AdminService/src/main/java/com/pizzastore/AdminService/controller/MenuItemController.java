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

import com.pizzastore.AdminService.entity.MenuItem;
import com.pizzastore.AdminService.service.MenuItemService;

@RestController
@RequestMapping("/admin/menu")
public class MenuItemController {
	@Autowired
    MenuItemService menuItemService;

    // ADD menu item
    
    @PostMapping
    public ResponseEntity<MenuItem> addMenuItem(@RequestBody MenuItem menuItem) {
        return ResponseEntity.ok(menuItemService.addMenuItem(menuItem));
    }

    // GET all menu items
    
    @GetMapping
    public ResponseEntity<List<MenuItem>> getAllMenuItems() {
        return ResponseEntity.ok(menuItemService.getAllMenuItems());
    }

    // GET menu items by category
    
    @GetMapping("/category/{id}")
    public ResponseEntity<List<MenuItem>> getMenuItemsByCategory(@PathVariable int id) {
        return ResponseEntity.ok(menuItemService.getMenuItemsByCategory(id));
    }

    // UPDATE menu item
    
    @PutMapping("/{id}")
    public ResponseEntity<MenuItem> updateMenuItem(
            @PathVariable int id,
            @RequestBody MenuItem menuItem) {
        return ResponseEntity.ok(menuItemService.updateMenuItem(id, menuItem));
    }

    // DELETE menu item
    
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteMenuItem(@PathVariable int id) {
        return ResponseEntity.ok(menuItemService.deleteMenuItem(id));
    }
}
