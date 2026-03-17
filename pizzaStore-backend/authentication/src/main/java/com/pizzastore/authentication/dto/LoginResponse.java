package com.pizzastore.authentication.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
public class LoginResponse {
	private int userId;
	private String email;
    private String role;
    private String token;
    private String name;
}
