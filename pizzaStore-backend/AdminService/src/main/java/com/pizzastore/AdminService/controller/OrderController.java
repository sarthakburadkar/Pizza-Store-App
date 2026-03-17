package com.pizzastore.AdminService.controller;

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

import com.pizzastore.AdminService.entity.Orders;
import com.pizzastore.AdminService.service.OrderService;

@RestController
@RequestMapping("/admin/orders")
public class OrderController {
	@Autowired
    OrderService orderService;

    // GET all orders
    
    @GetMapping
    public ResponseEntity<List<Orders>> getAllOrders() {
        return ResponseEntity.ok(orderService.getAllOrders());
    }

    // GET orders by status
    
    @GetMapping("/status/{status}")
    public ResponseEntity<List<Orders>> getOrdersByStatus(@PathVariable String status) {
        return ResponseEntity.ok(orderService.getOrdersByStatus(status));
    }

    // UPDATE order status
    
    @PutMapping("/{id}/status")
    public ResponseEntity<Orders> updateOrderStatus(
            @PathVariable int id,
            @RequestParam String status) {
        return ResponseEntity.ok(orderService.updateOrderStatus(id, status));
    }

    // GENERATE BILL for an order
    
    @GetMapping("/bill/{orderId}")
    public ResponseEntity<Orders> generateBill(@PathVariable int orderId) {
        return ResponseEntity.ok(orderService.generateBill(orderId));
    }
    
    @PostMapping("/sync")
    public ResponseEntity<Orders> syncOrder(@RequestBody Orders order) {
        return ResponseEntity.ok(orderService.syncOrder(order));
    }
}
