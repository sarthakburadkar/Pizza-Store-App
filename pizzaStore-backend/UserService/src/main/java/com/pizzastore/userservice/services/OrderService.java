package com.pizzastore.userservice.services;

import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import com.pizzastore.userservice.entity.Cart;
import com.pizzastore.userservice.entity.MenuItem;
import com.pizzastore.userservice.entity.Orders;
import com.pizzastore.userservice.entity.OrderItem;
import com.pizzastore.userservice.repository.MenuItemRepository;
import com.pizzastore.userservice.repository.OrderRepository;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;

@Service
public class OrderService {
	@Autowired
	OrderRepository orderRepository;
	
	@Autowired
    MenuItemRepository menuItemRepository;
	
	@Autowired
	RestTemplate restTemplate;
	@Value("${jwt.secret}")
	private String secretKey;

	private String generateServiceToken() {
	    return Jwts.builder()
	            .setSubject("user-service")
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

	private static final String ADMIN_SERVICE_URL = "http://AdminService";
	
	@Autowired
    CartService cartService;
	
	// PLACE ORDER
    public Orders placeOrder(int userId, String deliveryAddress, String deliveryMode) {

        // Step 1 — Get all cart items for this user
        List<Cart> cartItems = cartService.getCartByUserId(userId);

        // Step 2 — If cart is empty, stop here
        if (cartItems.isEmpty()) {
            throw new RuntimeException("Cart is empty!");
        }
     // Step 3 — Validate stock before placing order 
        for (Cart cartItem : cartItems) {
            MenuItem menuItem = cartItem.getMenuItem();
            if (cartItem.getQuantity() > menuItem.getStock()) {
                throw new RuntimeException("Insufficient stock for: " + menuItem.getName());
            }
        }

        // Step 4 — Convert each Cart item into an OrderItem
        List<OrderItem> orderItems = cartItems.stream().map(cartItem -> {
            OrderItem item = new OrderItem();
            item.setMenuItemId(cartItem.getMenuItem().getId());
            item.setItemName(cartItem.getMenuItem().getName());
            item.setPrice(cartItem.getMenuItem().getPrice());
            item.setQuantity(cartItem.getQuantity());
            return item;
        }).collect(Collectors.toList());

        // Step 5 — Calculate total
        double total = 0;
        for (OrderItem item : orderItems) {
            total += item.getPrice() * item.getQuantity();
        }

        // Step 6 — Build the Order
        Orders order = new Orders();
        order.setUserId(userId);
        order.setDeliveryAddress(deliveryAddress);
        order.setDeliveryMode(deliveryMode);
        order.setTotalAmount(total);
        order.setStatus("PENDING");

        // Step 7 — Link each OrderItem to this Order
        for (OrderItem item : orderItems) {
            item.setOrder(order);
        }
        order.setOrderItems(orderItems);

        // Step 8 — Save order (cascade saves orderItems too)
        Orders savedOrder = orderRepository.save(order);
        
     // Step 9 — Reduce stock for each item 👇
        for (Cart cartItem : cartItems) {
            MenuItem menuItem = cartItem.getMenuItem();
            menuItem.setStock(menuItem.getStock() - cartItem.getQuantity());
            menuItemRepository.save(menuItem);
        }
        // Step 10 — Clear the cart
        try {
            HttpEntity<Orders> request = new HttpEntity<>(savedOrder, createHeaders());
            restTemplate.postForObject(
                ADMIN_SERVICE_URL + "/admin/orders/sync",
                request,
                Orders.class
            );
        } catch (Exception e) {
            System.out.println("Failed to sync to AdminService: " + e.getMessage());
        }
        
     
        
            
            // Step 11 — Clear the cart
            cartService.clearCartByUserId(userId);
            return savedOrder;
    }

    // GET all orders for a user
    public List<Orders> getOrdersByUserId(int userId) {
    	return orderRepository.findByUserIdOrderByCreatedAtDesc(userId); 
    }

    // GET single order by id
    public Orders getOrderById(int orderId) {
        return orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found!"));
    }

    // CANCEL order — only allowed if status is PENDING
    public Orders cancelOrder(int orderId) {
        Orders order = getOrderById(orderId);

        if (!order.getStatus().equals("PENDING")) {
            throw new RuntimeException("Cannot cancel. Status is: " + order.getStatus());
        }
        for (OrderItem item : order.getOrderItems()) {
            MenuItem menuItem = menuItemRepository.findById(item.getMenuItemId())
                .orElse(null);
            if (menuItem != null) {
                menuItem.setStock(menuItem.getStock() + item.getQuantity());
                menuItemRepository.save(menuItem);
            }
        }

        order.setStatus("CANCELLED");
        return orderRepository.save(order);
    }
    
 // Update order status
    public Orders updateOrderStatus(int orderId, String status) {
        Orders order = getOrderById(orderId);
        order.setStatus(status);
        return orderRepository.save(order);
    }
    
    
}
