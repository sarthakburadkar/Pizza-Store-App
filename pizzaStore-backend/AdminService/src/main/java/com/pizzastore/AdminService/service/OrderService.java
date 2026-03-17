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
import com.pizzastore.AdminService.entity.OrderItem;
import com.pizzastore.AdminService.entity.Orders;
import com.pizzastore.AdminService.repository.MenuItemRepository;
import com.pizzastore.AdminService.repository.OrderRepository;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;

@Service
public class OrderService {
    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private MenuItemRepository menuItemRepository;  // 👈 add this

    @Autowired
    RestTemplate restTemplate;

    @Value("${jwt.secret}")
    private String secretKey;

    private static final String USER_SERVICE_URL = "http://UserService";

    // 👇 generate service token
    private String generateServiceToken() {
        return Jwts.builder()
                .setSubject("admin-service")
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + 1000 * 60 * 60))
                .signWith(Keys.hmacShaKeyFor(Decoders.BASE64.decode(secretKey)), SignatureAlgorithm.HS256)
                .compact();
    }

    // 👇 create headers with JWT token
    private HttpHeaders createHeaders() {
        HttpHeaders headers = new HttpHeaders();
        headers.set("Authorization", "Bearer " + generateServiceToken());
        return headers;
    }

    public List<Orders> getAllOrders() {
        return orderRepository.findAllByOrderByCreatedAtDesc();
    }

    public List<Orders> getOrdersByStatus(String status) {
        return orderRepository.findByStatusOrderByCreatedAtDesc(status);
    }

    public Orders getOrderById(int orderId) {
        return orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found!"));
    }

    public Orders updateOrderStatus(int orderId, String newStatus) {
        Orders order = getOrderById(orderId);
        order.setStatus(newStatus);
        Orders saved = orderRepository.save(order);

        // Sync to UserService with JWT token 👇
        try {
            HttpEntity<Void> request = new HttpEntity<>(createHeaders());
            restTemplate.exchange(
                USER_SERVICE_URL + "/user/orders/updateStatus/" + orderId + "?status=" + newStatus,
                HttpMethod.PUT,
                request,
                Void.class
            );
        } catch (Exception e) {
            System.out.println("Failed to sync status to UserService: " + e.getMessage());
        }
        return saved;
    }

    public Orders syncOrder(Orders order) {
        if (order.getOrderItems() != null) {
            for (OrderItem item : order.getOrderItems()) {
                item.setOrder(order);

                // 👇 reduce stock in AdminService
                menuItemRepository.findById(item.getMenuItemId()).ifPresent(menuItem -> {
                    int newStock = menuItem.getStock() - item.getQuantity();
                    if (newStock < 0) newStock = 0;
                    menuItem.setStock(newStock);
                    menuItemRepository.save(menuItem);
                });
            }
        }
        return orderRepository.save(order);
    }

    public Orders generateBill(int orderId) {
        return getOrderById(orderId);
    }
}