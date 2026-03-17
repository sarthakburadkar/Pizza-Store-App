package com.pizzastore.userservice.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.pizzastore.userservice.entity.Orders;
import com.pizzastore.userservice.services.OrderService;

@RestController
@RequestMapping("/user/orders")
public class OrderController {

	@Autowired
	OrderService orderService;

	// PLACE ORDER
  
    @PostMapping("/place/{userId}")
    public ResponseEntity<Orders> placeOrder(
            @PathVariable int userId,
            @RequestBody Orders orderRequest) {

        Orders order = orderService.placeOrder(
            userId,
            orderRequest.getDeliveryAddress(),
            orderRequest.getDeliveryMode()
        );
        return ResponseEntity.ok(order);
    }

    // GET all orders for a user
    
    @GetMapping("/{userId}")
    public ResponseEntity<List<Orders>> getOrders(@PathVariable int userId) {
        return ResponseEntity.ok(orderService.getOrdersByUserId(userId));
    }

    // GET single order detail
    
    @GetMapping("/detail/{orderId}")
    public ResponseEntity<Orders> getOrderDetail(@PathVariable int orderId) {
        return ResponseEntity.ok(orderService.getOrderById(orderId));
    }

    // CANCEL order
    
    @PutMapping("/cancel/{orderId}")
    public ResponseEntity<Orders> cancelOrder(@PathVariable int orderId) {
        return ResponseEntity.ok(orderService.cancelOrder(orderId));
    }
    
 // UPDATE order status (called by AdminService)
    @PutMapping("/updateStatus/{orderId}")
    public ResponseEntity<Orders> updateOrderStatus(
            @PathVariable int orderId,
            @RequestParam String status) {
        return ResponseEntity.ok(orderService.updateOrderStatus(orderId, status));
    }
    
    @GetMapping("/bill/{orderId}")
    public ResponseEntity<Orders> getBill(@PathVariable int orderId) {
        Orders order = orderService.getOrderById(orderId);
        return ResponseEntity.ok(order);
    }
}
