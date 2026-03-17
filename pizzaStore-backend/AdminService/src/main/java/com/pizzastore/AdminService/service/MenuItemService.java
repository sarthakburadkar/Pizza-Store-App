package com.pizzastore.AdminService.service;

import java.util.Date;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;
import org.springframework.web.client.RestTemplate;

import com.pizzastore.AdminService.entity.Category;
import com.pizzastore.AdminService.entity.MenuItem;
import com.pizzastore.AdminService.repository.CategoryRepository;
import com.pizzastore.AdminService.repository.MenuItemRepository;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;

@Service
public class MenuItemService {
	@Autowired
    MenuItemRepository menuItemRepository;
	
	@Autowired
	CategoryRepository categoryRepository;
	
	@Autowired
	RestTemplate restTemplate;
	
	@Value("${jwt.secret}")  
    private String secretKey;
	
	private static final String USER_SERVICE_URL = "http://UserService";
	
	private String generateServiceToken() {
        return Jwts.builder()
                .setSubject("admin-service")
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + 1000 * 60 * 60))
                .signWith(Keys.hmacShaKeyFor(Decoders.BASE64.decode(secretKey)), SignatureAlgorithm.HS256)
                .compact();
    }
	
	private HttpHeaders createHeaders() {
        HttpHeaders headers = new HttpHeaders();
        headers.set("Authorization", "Bearer " + generateServiceToken());
        headers.setContentType(MediaType.APPLICATION_JSON);
        return headers;
    }

	public MenuItem addMenuItem(MenuItem menuItem) {
	    // Fetch full category
	    Category category = categoryRepository.findById(menuItem.getCategory().getId())
	            .orElseThrow(() -> new RuntimeException("Category not found!"));
	    menuItem.setCategory(category);

	    // Save to admin database
	    MenuItem saved = menuItemRepository.save(menuItem);

	    // Sync to user service
	    HttpEntity<MenuItem> addRequest = new HttpEntity<>(saved, createHeaders());
	    restTemplate.postForObject(
	        USER_SERVICE_URL + "/user/menu",
	        addRequest,
	        MenuItem.class
	    );

	    return saved;
	}

    // Get all menu items
    public List<MenuItem> getAllMenuItems() {
        return menuItemRepository.findAll();
    }

    // Get menu items by category
    public List<MenuItem> getMenuItemsByCategory(int categoryId) {
        return menuItemRepository.findByCategoryId(categoryId);
    }

    public MenuItem updateMenuItem(int id, MenuItem updatedItem) {
        MenuItem existing = menuItemRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Menu item not found!"));
        System.out.println("Stock received from frontend: " + updatedItem.getStock()); // 👈 add
        System.out.println("Current stock in DB: " + existing.getStock());
        existing.setName(updatedItem.getName());
        existing.setDescription(updatedItem.getDescription());
        existing.setPrice(updatedItem.getPrice());
        existing.setStock(updatedItem.getStock());        
        existing.setImageUrl(updatedItem.getImageUrl());
        existing.setCategory(updatedItem.getCategory());
        MenuItem saved = menuItemRepository.save(existing);
        System.out.println("Stock being sent to UserService: " + saved.getStock());

        // Sync to user service
        HttpEntity<MenuItem> updateRequest = new HttpEntity<>(saved, createHeaders());
        restTemplate.exchange(
            USER_SERVICE_URL + "/user/menu/" + id,
            HttpMethod.PUT,
            updateRequest,
            MenuItem.class
        );

        return saved;
    }

    public String deleteMenuItem(int id) {
        menuItemRepository.deleteById(id);

        // Sync to user service
        HttpEntity<Void> deleteRequest = new HttpEntity<>(createHeaders());
        restTemplate.exchange(
            USER_SERVICE_URL + "/user/menu/" + id,
            HttpMethod.DELETE,
            deleteRequest,
            Void.class
        );

        return "Menu item deleted successfully";
    }
}
