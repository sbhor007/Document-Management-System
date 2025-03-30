package com.documentManagementSystem.server.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import com.documentManagementSystem.server.entity.Users;
import com.documentManagementSystem.server.repository.UsersRepository;

import lombok.extern.slf4j.Slf4j;

@Service
@Slf4j
public class UserService {
	
	@Autowired
	private UsersRepository userRepository;
	
	private BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder(12);
	
	public List<Users> getAllUsers() {
        try {
            List<Users> users = userRepository.findAll();
            log.debug("Fetched {} users", users.size());
            return users;
        } catch (Exception e) {
            log.error("Failed to fetch all users, error: {}", e.getMessage());
            throw new RuntimeException("Failed to fetch users: " + e.getMessage());
        }
    }

	public Users findUserById(Long userId) {
        if (userId == null) {
            log.error("User ID is null");
            throw new RuntimeException("User ID cannot be null");
        }

        try {
            Users user = userRepository.findById(userId)
                    .orElseThrow(() -> {
                        log.error("User not found with ID: {}", userId);
                        return new RuntimeException("User not found: " + userId);
                    });
            log.debug("Found user with ID: {}", userId);
            return user;
        } catch (Exception e) {
            log.error("Failed to fetch user with ID: {}, error: {}", userId, e.getMessage());
            throw new RuntimeException("Failed to fetch user: " + e.getMessage());
        }
    }
	
	public Users findByUserName(String username) {
        if (username == null) {
            log.error("Username is null");
            throw new RuntimeException("Username cannot be null");
        }

        try {
            Users user = userRepository.findByUserName(username);
            if (user == null) {
                log.error("User not found with username: {}", username);
                throw new RuntimeException("User not found: " + username);
            }
            log.debug("Found user with username: {}", username);
            return user;
        } catch (Exception e) {
            log.error("Failed to fetch user with username: {}, error: {}", username, e.getMessage());
            throw new RuntimeException("Failed to fetch user: " + e.getMessage());
        }
    }
	
	
	public Users updateUser(Users updatedUser) {

        try {
        	Users existingUser = userRepository.findByUserName(updatedUser.getUserName());
        	if(existingUser == null) {
        		log.error("User not found with Username: {} for update", updatedUser.getUserName());
        	    throw new RuntimeException("User not found: " + updatedUser.getUserName());
        	}
           
            if (updatedUser.getPassword() != null) {
                existingUser.setPassword(passwordEncoder.encode(updatedUser.getPassword()));
            }
            // Add other fields as needed (e.g., email, role)

            Users savedUser = userRepository.save(existingUser);
            log.debug("Updated user with Usermane: {}", updatedUser.getUserName());
            return savedUser;
        } catch (RuntimeException e) {
            throw e;
        } catch (Exception e) {
            log.error("Failed to update user with: {}, error: {}", updatedUser.getUserName(), e.getMessage());
            throw new RuntimeException("Failed to update user: " + e.getMessage());
        }
    }
	
//	public 
	
	
}
