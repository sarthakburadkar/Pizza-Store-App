package com.pizzastore.userservice.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.pizzastore.userservice.entity.MenuItem;

@Repository
public interface MenuItemRepository extends JpaRepository<MenuItem, Integer> {
	List<MenuItem> findByCategoryId(int categoryId);
}
