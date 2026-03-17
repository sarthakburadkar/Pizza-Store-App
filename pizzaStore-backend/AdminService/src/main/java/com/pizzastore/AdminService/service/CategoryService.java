package com.pizzastore.AdminService.service;
import java.util.Date;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import com.pizzastore.AdminService.entity.Category;
import com.pizzastore.AdminService.repository.CategoryRepository;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;

@Service
public class CategoryService {
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
        return headers;
    }

    public Category addCategory(Category category) {
        Category saved = categoryRepository.save(category);
        try {
            HttpEntity<Category> request = new HttpEntity<>(saved, createHeaders());
            restTemplate.postForObject(
                USER_SERVICE_URL + "/user/categories",
                request,
                Category.class
            );
        } catch (Exception e) {
            System.out.println("Failed to sync category to UserService: " + e.getMessage());
        }
        return saved;
    }

    public List<Category> getAllCategories() {
        return categoryRepository.findAll();
    }

    public Category updateCategory(int id, Category updatedCategory) {
        Category existing = categoryRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Category not found!"));
        existing.setName(updatedCategory.getName());
        Category saved = categoryRepository.save(existing);
        try {
            HttpEntity<Category> request = new HttpEntity<>(saved, createHeaders());
            restTemplate.exchange(
                USER_SERVICE_URL + "/user/categories/" + id,
                HttpMethod.PUT,
                request,
                Category.class
            );
        } catch (Exception e) {
            System.out.println("Failed to sync category update: " + e.getMessage());
        }
        return saved;
    }

    public String deleteCategory(int id) {
        categoryRepository.deleteById(id);
        try {
            HttpEntity<Void> request = new HttpEntity<>(createHeaders());
            restTemplate.exchange(
                USER_SERVICE_URL + "/user/categories/" + id,
                HttpMethod.DELETE,
                request,
                Void.class
            );
        } catch (Exception e) {
            System.out.println("Failed to sync category delete: " + e.getMessage());
        }
        return "Category deleted successfully";
    }
}