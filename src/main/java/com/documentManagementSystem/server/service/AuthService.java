package com.documentManagementSystem.server.service;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import com.documentManagementSystem.server.entity.Users;
import com.documentManagementSystem.server.repository.UsersRepository;

@Service
public class AuthService {
	
	@Autowired
	UsersRepository userRepository;
	
	@Autowired
	AuthenticationManager authManager;
	
	@Autowired
	JWTService jwtService;
	
	private BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder(12);
	
	public boolean emailExists(String email) {
	    return userRepository.findByUserName(email) != null; 
	}
	
	public Users register(Users user) {
        try {
        	
            user.setPassword(passwordEncoder.encode(user.getPassword()));
            return userRepository.save(user);
        } catch (Exception e) {
            throw new RuntimeException("User registration failed", e);
        }
    }

    public String verify(Users user) {
        try {
        	
        	
        	
            Authentication authentication = authManager.authenticate(new UsernamePasswordAuthenticationToken(user.getUserName(), user.getPassword()));
            if (authentication.isAuthenticated()) {
                return jwtService.generateToken(user.getUserName());
            }
            return null;
        } catch (Exception e) {
            return null;
        }
    }
    
    public ArrayList<Users> getAllUser() {
		return (ArrayList<Users>) userRepository.findAll();
	}
    public Users getUserById(Long userId){
    	return userRepository.findById(userId).orElse(null);
    }
    
    public Users getUser(String usernamr) {
    	return userRepository.findByUserName(usernamr);
    }
    
    

	

}