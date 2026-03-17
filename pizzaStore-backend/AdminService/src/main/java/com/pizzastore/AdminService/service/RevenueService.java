package com.pizzastore.AdminService.service;



import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.pizzastore.AdminService.repository.OrderRepository;

@Service
public class RevenueService {

    @Autowired
    OrderRepository orderRepository;

    // Total revenue from DELIVERED orders
    public double getTotalRevenue() {
        return orderRepository.findByStatus("DELIVERED")
                .stream()
                .mapToDouble(order -> order.getTotalAmount())
                .sum();
    }

    // Total number of orders
    public long getTotalOrders() {
        return orderRepository.count();
    }

    // Count orders by status
    public long getOrderCountByStatus(String status) {
        return orderRepository.findByStatus(status).size();
    }
}