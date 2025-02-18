package com.documentManagementSystem.server.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.documentManagementSystem.server.entity.Document;

public interface DocumentRepository extends JpaRepository<Document, Long>{

	List<Document> findByFolderId(Long folderId);

	List<Document> findByUserId(Long id);
	
}
