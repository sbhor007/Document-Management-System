package com.documentManagementSystem.server.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import com.documentManagementSystem.server.entity.UserPrintiple;
import com.documentManagementSystem.server.entity.Users;
import com.documentManagementSystem.server.repository.UsersRepository;

@Service
public class MyUserDetailsService implements UserDetailsService {
	
	@Autowired
	UsersRepository userRepository;

	@Override
	public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
		
		Users user = userRepository.findByUserName(username);
		
		if(user == null) {
			System.out.println("User Not Found");
			throw new UsernameNotFoundException("User Not Found");
		}
		
		return new UserPrintiple(user);
	}

}