//package com.pizzastore.authentication.controller;
//
//import java.util.List;
//
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.http.ResponseEntity;
//import org.springframework.security.core.annotation.AuthenticationPrincipal;
//import org.springframework.web.bind.annotation.CrossOrigin;
//import org.springframework.web.bind.annotation.GetMapping;
//import org.springframework.web.bind.annotation.PostMapping;
//import org.springframework.web.bind.annotation.RequestBody;
//import org.springframework.web.bind.annotation.RequestMapping;
//import org.springframework.web.bind.annotation.RestController;
//
//import com.pizzastore.authentication.entity.UserPrincipal;
//import com.pizzastore.authentication.entity.Users;
//import com.pizzastore.authentication.services.UserService;
//
//@CrossOrigin(origins = "http://localhost:5173")
//@RestController
//@RequestMapping("/users")
//public class UserController {
//	@Autowired
//	UserService userservice;
//	
//	@PostMapping("/add")
//	public Users addUser(@RequestBody Users user) {
//		return userservice.addUser(user);
//	}
//	
//	@GetMapping("/all")
//	public List<Users> getUsers(){
//		return userservice.allUser();
//	}
//	@GetMapping("/profile")
//	public ResponseEntity<Users> getProfile(@AuthenticationPrincipal UserPrincipal userPrincipal) {
//	    return ResponseEntity.ok(userPrincipal.getUser());
//	}
//}
