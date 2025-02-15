package com.documentManagementSystem.server.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.documentManagementSystem.server.entity.Users;

@Repository
public interface UsersRepository extends JpaRepository<Users, Long>{

	Users findByUserName(String username);

}
