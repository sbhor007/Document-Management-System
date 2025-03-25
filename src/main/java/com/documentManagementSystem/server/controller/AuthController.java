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
import com.documentManagementSystem.server.responce.ApiResponse;
import com.documentManagementSystem.server.service.AuthService;

import lombok.extern.slf4j.Slf4j;

@RestController
@RequestMapping("/api/auth")
@Slf4j
public class AuthController {

	 @Autowired
	    private AuthService userService;
	 
//	 / New endpoint to check if email exists
	    @GetMapping("/email-exists/{email}")
	    public ResponseEntity<ApiResponse<Boolean>> checkEmailExists(@PathVariable String email) {
	        log.info("Checking if email exists: {}", email);
	        try {
	            boolean exists = userService.emailExists(email);
	            return ResponseEntity.ok(new ApiResponse<>("success", "Email check completed", exists));
	        } catch (RuntimeException e) {
	            log.error("Error checking email: {}, error: {}", email, e.getMessage());
	            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
	                    .body(new ApiResponse<>("error", e.getMessage(), null));
	        }
	    }

	    @PostMapping("/register")
	    public ResponseEntity<ApiResponse<Users>> register(@RequestBody Users user) {
	        log.info("User registration data: {}", user);
	        try {
	            Users savedUser = userService.register(user);
	            return ResponseEntity.status(HttpStatus.CREATED)
	                    .body(new ApiResponse<>("success", "User registered successfully", savedUser));
	        } catch (RuntimeException e) {
	            log.error("Error registering user: {}, error: {}", user, e.getMessage());
	            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
	                    .body(new ApiResponse<>("error", e.getMessage(), null));
	        }
	    }

	    @PostMapping("/logins")
	    public ResponseEntity<ApiResponse<Map<String, Object>>> login(@RequestBody Users user) {
	        log.info("Login credentials: {}", user);
	        try {
	            String jwtToken = userService.verify(user);
	            if (jwtToken != null) {
	                Map<String, Object> tokenDetails = new HashMap<>();
	                tokenDetails.put("token", jwtToken);
	                tokenDetails.put("expiryTime", 60 * 1000 * 60 * 24);
	                return ResponseEntity.ok(new ApiResponse<>("success", "Login successful", tokenDetails));
	            } else {
	                log.warn("Login failed for user: {}", user);
	                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
	                        .body(new ApiResponse<>("error", "Invalid credentials", null));
	            }
	        } catch (RuntimeException e) {
	            log.error("Error during login for user: {}, error: {}", user, e.getMessage());
	            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
	                    .body(new ApiResponse<>("error", e.getMessage(), null));
	        }
	    }
	    
	    @GetMapping("all-users")
	    public ResponseEntity<ApiResponse<List<Users>>> getAllUsers() {
	        log.info("Fetching all users");
	        try {
	            List<Users> users = userService.getAllUser();
	            log.info("Fetched {} users", users.size());
	            return ResponseEntity.status(HttpStatus.OK)
	                    .body(new ApiResponse<>("success", "All users fetched successfully", users));
	        } catch (RuntimeException e) {
	            log.error("Error fetching all users, error: {}", e.getMessage());
	            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
	                    .body(new ApiResponse<>("error", e.getMessage(), null));
	        }
	    }
	    
	    @GetMapping("/{userId}")
	    public ResponseEntity<ApiResponse<Users>> getUserById(@PathVariable Long userId) {
	        log.info("Fetching user with ID: {}", userId);
	        try {
	            Users user = userService.getUserById(userId);
	            if (user == null) {
	                log.warn("User not found with ID: {}", userId);
	                return ResponseEntity.status(HttpStatus.NOT_FOUND)
	                        .body(new ApiResponse<>("error", "User not found: " + userId, null));
	            }
	            log.info("User details: {}", user);
	            return ResponseEntity.status(HttpStatus.OK)
	                    .body(new ApiResponse<>("success", "User fetched successfully", user));
	        } catch (RuntimeException e) {
	            log.error("Error fetching user with ID: {}, error: {}", userId, e.getMessage());
	            HttpStatus status = e.getMessage().contains("not found") ? HttpStatus.NOT_FOUND : 
	                               HttpStatus.INTERNAL_SERVER_ERROR;
	            return ResponseEntity.status(status)
	                    .body(new ApiResponse<>("error", e.getMessage(), null));
	        }
	    }
	    
	   /* public ResponseEntity<ApiResponce<Users>> updateUser(
	            @PathVariable Long userId,
	            @RequestBody Users updatedUser) {
	        log.info("Updating user with ID: {}, data: {}", userId, updatedUser);
	        try {
	            Users savedUser = userService.updateUser(userId, updatedUser);
	            return ResponseEntity.status(HttpStatus.OK)
	                    .body(new ApiResponce<>("success", "User updated successfully", savedUser));
	        } catch (RuntimeException e) {
	            log.error("Error updating user with ID: {}, error: {}", userId, e.getMessage());
	            HttpStatus status = e.getMessage().contains("not found") ? HttpStatus.NOT_FOUND :
	                               HttpStatus.BAD_REQUEST;
	            return ResponseEntity.status(status)
	                    .body(new ApiResponce<>("error", e.getMessage(), null));
	        }
	    }*/
}
