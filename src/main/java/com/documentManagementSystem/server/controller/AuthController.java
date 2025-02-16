package com.documentManagementSystem.server.controller;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.apache.catalina.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.documentManagementSystem.server.entity.Users;
import com.documentManagementSystem.server.responce.ApiResponce;
import com.documentManagementSystem.server.service.AuthService;

import lombok.extern.slf4j.Slf4j;

@RestController
@RequestMapping("/api/auth")
@Slf4j
public class AuthController {

	 @Autowired
	    private AuthService userService;

	    @PostMapping("/register")
	    public ResponseEntity<ApiResponce<?>> register(@RequestBody Users user) {
	        try {
	        	log.info("user Registation Data {}",user);
	            Users savedUser = userService.register(user);
	            return ResponseEntity.status(HttpStatus.CREATED).body(new ApiResponce<>("success", "User registered successfully", savedUser));  // 201 Created
	        } catch (Exception e) {
	            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new ApiResponce<>("error", "Registration failed: " + e.getMessage(), null));  // 400 Bad Request
	        }
	    }

	    @PostMapping("/logins")
	    public ResponseEntity<ApiResponce<?>> login(@RequestBody Users user) {
	    	log.info("Login credentials {}",user);
	        String jwtToken = userService.verify(user);
	        if (jwtToken != null) {
	        	Map<String, Object> tokenDetails = new HashMap<String, Object>();
	        	tokenDetails.put("token", jwtToken);
	        	tokenDetails.put("expiryTime", 60 * 1000 * 60 * 24);
	        	
	            return ResponseEntity.ok(new ApiResponce<>("success", "Login successful", tokenDetails));  // 200 OK
	        } else {
	            
	            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(new ApiResponce<>("error", "Login failed", null));  // 401 Unauthorized
	        }
	    }
	    
	    @GetMapping("all-users")
	    public ResponseEntity<ApiResponce<?>> getAllUsers(){
	    	ArrayList<Users> users = userService.getAllUser();
	    	return ResponseEntity.status(HttpStatus.OK).body(new ApiResponce("success", "all users fetched successfully",users));
	    }
	    
	    @GetMapping("/{userId}")
	    public ResponseEntity<ApiResponce<?>> getUserById(@PathVariable Long userId){
	    	Users user = userService.getUserById(userId);
	    	log.info("User Details {}",user);
	    	return ResponseEntity.status(HttpStatus.OK).body(new ApiResponce("success", "user fetched successfully", user));
	    }
}
