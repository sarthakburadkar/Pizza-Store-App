package com.pizzastore.AdminService.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.pizzastore.AdminService.entity.Orders;

@Repository
public interface OrderRepository extends JpaRepository<Orders, Integer>{
	List<Orders> findByStatus(String status);
	List<Orders> findByStatusOrderByCreatedAtDesc(String status);  // 👈 add this
    List<Orders> findAllByOrderByCreatedAtDesc(); 
}
