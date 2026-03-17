package com.pizzastore.authentication.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class LoginUser {
	private String email, password;
}
