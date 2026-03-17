package com.pizzastore.userservice.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToOne;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Entity
public class Cart {
	@Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    private int userId; // Reference to user in Authentication service
    private double price;

    @ManyToOne
    private MenuItem menuItem;
    private int quantity;
}
