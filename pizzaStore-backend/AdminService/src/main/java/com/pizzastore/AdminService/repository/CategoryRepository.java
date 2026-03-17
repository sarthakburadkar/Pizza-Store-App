package com.pizzastore.AdminService.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.pizzastore.AdminService.entity.Category;

@Repository
public interface CategoryRepository extends JpaRepository<Category, Integer>{

}
