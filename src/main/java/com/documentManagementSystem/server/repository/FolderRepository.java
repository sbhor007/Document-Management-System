package com.documentManagementSystem.server.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.documentManagementSystem.server.entity.Folder;

@Repository
public interface FolderRepository extends JpaRepository<Folder, Long> {
	List<Folder> findByUser_UserName(String userName); // This will fetch folders by users userName
}
