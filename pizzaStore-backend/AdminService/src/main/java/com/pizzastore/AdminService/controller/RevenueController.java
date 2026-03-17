package com.pizzastore.AdminService.controller;

import java.util.HashMap;
import java.util.Map;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import com.pizzastore.AdminService.service.RevenueService;

@RestController
@RequestMapping("/admin/revenue")
public class RevenueController {

    @Autowired
    RevenueService revenueService;

    // Total revenue from delivered orders
    @GetMapping("/total")
    public ResponseEntity<Map<String, Object>> getTotalRevenue() {
        Map<String, Object> response = new HashMap<>();
        response.put("totalRevenue", revenueService.getTotalRevenue());
        response.put("totalOrders", revenueService.getTotalOrders());
        response.put("pendingOrders", revenueService.getOrderCountByStatus("PENDING"));
        response.put("deliveredOrders", revenueService.getOrderCountByStatus("DELIVERED"));
        response.put("cancelledOrders", revenueService.getOrderCountByStatus("CANCELLED"));
        return ResponseEntity.ok(response);
    }
}