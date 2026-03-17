package com.pizzastore.authentication.controller;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.pizzastore.authentication.dto.LoginResponse;
import com.pizzastore.authentication.dto.LoginUser;
import com.pizzastore.authentication.entity.Users;
import com.pizzastore.authentication.services.JWTService;
import com.pizzastore.authentication.services.UserService;


@RestController
@RequestMapping("/auth")
public class authController {
	@Autowired
    private UserService userService;
	@Autowired
	private JWTService jwtService;
	 
	// REGISTER
    @PostMapping("/register")
    public ResponseEntity<Users> register(@RequestBody Users user) {
        Users savedUser = userService.addUser(user);
        return ResponseEntity.status(HttpStatus.CREATED).body(savedUser);
    }

	@PostMapping("/login")
	public ResponseEntity<LoginResponse> login(@RequestBody LoginUser loginUser) {
	    Users user = userService.getUserByEmail(loginUser.getEmail());
	    if (user == null) {
	        return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
	    }

	    if (!userService.checkPassword(loginUser.getPassword(), user.getPassword())) {
	        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
	    }

	    String token = jwtService.generateToken(user.getEmail(), user.getRole());
	    LoginResponse response = new LoginResponse(user.getId(), user.getEmail(), user.getRole(), token,user.getName());

	    return ResponseEntity.ok(response);
	}
}
