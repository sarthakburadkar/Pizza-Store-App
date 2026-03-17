package com.pizzastore.userservice.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.pizzastore.userservice.entity.Orders;

@Repository
public interface OrderRepository extends JpaRepository<Orders, Integer> {
	List<Orders> findByUserId(int userId);
	List<Orders> findByUserIdOrderByCreatedAtDesc(int userId);
}
