package com.documentManagementSystem.server.service;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.documentManagementSystem.server.entity.Users;
import com.documentManagementSystem.server.repository.UsersRepository;

@Service
public class UserService {
	
	@Autowired
	private UsersRepository userRepositiory;

	public Object getAllUsers() {
		return userRepositiory.findAll();
	}

	public Users findUserById(Long userId) {
		Users user = userRepositiory.findById(userId).orElse(null);
		return user;
	}
	
	public Users findUserByUserName(String username) {
		return userRepositiory.findByUserName(username);
	}
	
	
	
}
