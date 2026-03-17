package com.pizzastore.userservice.services;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.pizzastore.userservice.entity.MenuItem;
import com.pizzastore.userservice.repository.MenuItemRepository;

@Service
public class MenuItemService {
	@Autowired
	MenuItemRepository menuitemrepo;
	
	// Get all menu items
    public List<MenuItem> getAllMenuItems() {
        return menuitemrepo.findAll();
    }
    
    public MenuItem addMenuItem(MenuItem menuItem) {
        return menuitemrepo.save(menuItem);
    }

    // Get menu items by category
    public List<MenuItem> getMenuItemsByCategory(int categoryId) {
        return menuitemrepo.findByCategoryId(categoryId);
    }
    
    public MenuItem updateMenuItem(int id, MenuItem updatedItem) {
        MenuItem existing = menuitemrepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Menu item not found!"));
        existing.setName(updatedItem.getName());
        existing.setDescription(updatedItem.getDescription());
        existing.setPrice(updatedItem.getPrice());
        existing.setStock(updatedItem.getStock());        
        existing.setImageUrl(updatedItem.getImageUrl());
        existing.setCategory(updatedItem.getCategory());
        return menuitemrepo.save(existing);
    }

    public void deleteMenuItem(int id) {
        menuitemrepo.deleteById(id);
    }
}
