package com.documentManagementSystem.server.controller;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.apache.catalina.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.documentManagementSystem.server.DTO.UpdatePassword;
import com.documentManagementSystem.server.entity.Users;
import com.documentManagementSystem.server.responce.ApiResponse;
import com.documentManagementSystem.server.service.AuthService;
import com.documentManagementSystem.server.service.UserService;

import lombok.extern.slf4j.Slf4j;

@RestController
@RequestMapping("/api/auth")
@Slf4j
public class AuthController {

	 	@Autowired
	    private AuthService authService;
	 	
	 	@Autowired
	 	private UserService userService;
	 
	    @GetMapping("/email-exists/{email}")
	    public ResponseEntity<ApiResponse<Boolean>> checkEmailExists(@PathVariable String email) {
	        log.info("Checking if email exists: {}", email);
	        try {
	            boolean exists = authService.emailExists(email);
	            System.out.println("is exist : " + exists);
	            log.info("Checking if email exists: {}", exists);
	            log.info("Email is exist : {}",exists);
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
	            Users savedUser = authService.register(user);
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
	            String jwtToken = authService.verify(user);
	            Users u = authService.getUser(user.getUserName());
	            log.info("{} : {}",u.getRoll(),user.getRoll());
	            if (jwtToken != null && u.getRoll().equals(user.getRoll())) {
	                Map<String, Object> tokenDetails = new HashMap<>();
	                tokenDetails.put("token", jwtToken);
	                tokenDetails.put("expiryTime", 60 * 1000 * 60 * 24);
	                
	                tokenDetails.put("roll", u.getRoll());
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
	    
	    @PutMapping("/forgot-password/{email}")
	    public ResponseEntity<ApiResponse<?>> forgotPassword(@PathVariable String email, @RequestBody String newPassword){
	    	log.info("New Password credentials: username {}, password {}", email, newPassword);
	    	try {
				Users user = new Users();
				user.setUserName(email);
				user.setPassword(newPassword);
				
				 Users savedUser = userService.updateUser(user);
		            return ResponseEntity.status(HttpStatus.CREATED)
		                    .body(new ApiResponse<>("success", "Password Forget Successfully", savedUser));
		        } catch (RuntimeException e) {
		            log.error("Error in Forgot Password  error: {}",  e.getMessage());
		            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
		                    .body(new ApiResponse<>("error", e.getMessage(), null));
		        }
	    }
	    
	    @GetMapping("all-users")
	    public ResponseEntity<ApiResponse<List<Users>>> getAllUsers() {
	        log.info("Fetching all users");
	        try {
	            List<Users> users = authService.getAllUser();
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
	            Users user = authService.getUserById(userId);
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
	    
	    @GetMapping("/user")
	    public ResponseEntity<ApiResponse<Users>> getUser(Authentication authentication) {
	        log.info("Fetching user with token: {}", authentication);
	        try {
	            Users user = authService.getUser(authentication.getName());
	            if (user == null) {
	                log.warn("User not found with username: {}", authentication.getName());
	                return ResponseEntity.status(HttpStatus.NOT_FOUND)
	                        .body(new ApiResponse<>("error", "User not found: " + authentication.getName(), null));
	            }
	            log.info("User details: {}", user);
	            return ResponseEntity.status(HttpStatus.OK)
	                    .body(new ApiResponse<>("success", "User fetched successfully", user));
	        } catch (RuntimeException e) {
	            log.error("Error fetching user with username: {}, error: {}", authentication.getName(), e.getMessage());
	            HttpStatus status = e.getMessage().contains("not found") ? HttpStatus.NOT_FOUND : 
	                               HttpStatus.INTERNAL_SERVER_ERROR;
	            return ResponseEntity.status(status)
	                    .body(new ApiResponse<>("error", e.getMessage(), null));
	        }
	    }
	    
	    @DeleteMapping("/users/{username}")  // Changed to use path variable instead of request body
	    public ResponseEntity<ApiResponse<?>> deleteUser(@PathVariable String username) {
	        try {
	            userService.deleteUser(username);
	            return ResponseEntity.ok(
	                new ApiResponse<>("success", "User " + username + " deleted successfully")
	            );
	        } catch (RuntimeException e) {
	            return ResponseEntity
	                .status(HttpStatus.BAD_REQUEST)
	                .body(new ApiResponse<>("error", e.getMessage()));
	        } catch (Exception e) {
	            return ResponseEntity
	                .status(HttpStatus.INTERNAL_SERVER_ERROR)
	                .body(new ApiResponse<>("error", "Failed to delete user: " + e.getMessage()));
	        }
	    }
}