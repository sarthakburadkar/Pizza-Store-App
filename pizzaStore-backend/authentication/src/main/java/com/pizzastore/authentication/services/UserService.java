package com.pizzastore.authentication.services;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import com.pizzastore.authentication.entity.Users;
import com.pizzastore.authentication.repository.UserRepository;
@Service
public class UserService {
	@Autowired
	UserRepository userrepo;
	
	@Autowired
	BCryptPasswordEncoder passwordEncoder;
	
	@Autowired
	JWTService jwtService;
	
	public Users getUserByEmail(String email) {
	    return userrepo.findByEmail(email).orElse(null);
	}

	public boolean checkPassword(String rawPassword, String encodedPassword) {
	    return passwordEncoder.matches(rawPassword, encodedPassword);
	}
	
	public String loginUser(String email,String password) {
		Users user = userrepo.findByEmail(email).orElse(null);
		
		if(user==null) {
			return "User not found";
		}
		if(passwordEncoder.matches(password, user.getPassword())) {
			String token = jwtService.generateToken(user.getEmail(), user.getRole());
	        return token;  // Return the token instead of a plain message
		}else {
			return "Invalid Password";
		}
	}
	
	public Users addUser(Users user) {
		user.setPassword(passwordEncoder.encode(user.getPassword()));
		return userrepo.save(user);
	}
	
	public List<Users> allUser(){
		return userrepo.findAll();
	}
}
