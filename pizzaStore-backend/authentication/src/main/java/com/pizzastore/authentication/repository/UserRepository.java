package com.pizzastore.authentication.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.pizzastore.authentication.entity.Users;
@Repository
public interface UserRepository extends JpaRepository<Users,Integer> {
	Optional<Users> findByEmail(String email);
}
