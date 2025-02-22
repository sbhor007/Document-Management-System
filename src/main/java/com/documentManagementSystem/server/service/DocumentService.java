package com.documentManagementSystem.server.service;

import java.io.IOException;
import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.documentManagementSystem.server.entity.Document;
import com.documentManagementSystem.server.entity.Folder;
import com.documentManagementSystem.server.entity.Users;
import com.documentManagementSystem.server.repository.DocumentRepository;
import com.documentManagementSystem.server.repository.FolderRepository;
import com.documentManagementSystem.server.repository.UsersRepository;

import lombok.extern.slf4j.Slf4j;

@Service
@Slf4j
public class DocumentService {

	@Autowired
	private DocumentRepository documentRepository;
	
	@Autowired
	private UsersRepository userRepository;

	@Autowired
	private FolderRepository folderRepository;

	public void uploadDocument(MultipartFile[] files, Long folderId, String username) throws IOException {
	    log.info("Uploading documents for folder ID: {} and username: {}", folderId, username);
	    Folder folder = folderRepository.findById(folderId)
	            .orElseThrow(() -> new RuntimeException("Folder not found"));

	    log.info("Document service Username: {}", username);
	    if (!folder.getUser().getUserName().equals(username)) {
	        log.warn("Unauthorized access upload to document {} by user {}", folderId, username);
	        throw new RuntimeException("Unauthorized to upload to this folder");
	    }


	    List<Document> documents = Arrays.stream(files)
	    		.map(file ->{
	    			Document document = new Document();
	                document.setDocumentName(file.getOriginalFilename());
	                document.setFileType(file.getContentType());
	                document.setFolder(folder);
	                document.setUser(folder.getUser());
	                document.setS3Url("Santosh");
	                return document;
	    		})
	    		.collect(Collectors.toList());
	    documentRepository.saveAll(documents);
	    log.info("Documents uploaded successfully");
	}

	
	public Document getDocumentById(Long id,String username) {
		log.info("Fetching document by document ID: {} and username: {}", id, username);
		Document document =  documentRepository.findById(id).orElseThrow(() -> new RuntimeException("Document not found"));
		if(!document.getUser().getUserName().equals(username)){
			log.warn("Unauthorized access attempt to document {} by user {}", id, username);
			throw new RuntimeException("Unauthorized access to this document");
		}
		log.info("Found {} documents by document id : ",id);
		return document;
	}

	public List<Document> getDocumentsByFolder(Long folderId, String username) {
        try {
            log.info("Fetching documents for folder ID: {} and username: {}", folderId, username);
            
            Folder folder = folderRepository.findById(folderId)
                .orElseThrow(() -> new RuntimeException("Folder not found with ID: " + folderId));
            
            if (!folder.getUser().getUserName().equals(username)) {
                log.warn("Unauthorized access attempt to folder {} by user {}", folderId, username);
                throw new RuntimeException("Unauthorized access to this folder");
            }
            
            List<Document> documents = documentRepository.findByFolderId(folderId);
            log.info("Found {} documents in folder {}", documents.size(), folderId);
            
            return documents;
        } catch (Exception e) {
            log.error("Error fetching documents for folder {}: {}", folderId, e.getMessage());
            throw e;
        }
    }
	
	public List<Document> getAllDocumentsByUser(String username) {
		log.info("Fetching all documents for username: {}",  username);
        Users user = userRepository.findByUserName(username);
        if (user == null) {
        	log.warn("Unauthorized access attempt by user {}", username);
            throw new RuntimeException("User not found");
        }
        List<Document> documents = documentRepository.findByUserId(user.getId());
       log.info("Found {} documents in user {}", documents.size(),user.getName());
        return documents;
    }

	public void deleteDocument(Long id, String username) {
	    log.info("Attempting to delete document with ID: {} by user: {}", id, username);
	    
	    Document document = documentRepository.findById(id)
	        .orElseThrow(() -> new RuntimeException("Document not found with ID: " + id));
	    
	    if (!document.getUser().getUserName().equals(username)) {
	        log.warn("Unauthorized deletion attempt of document {} by user {}", id, username);
	        throw new RuntimeException("Unauthorized: You don't have permission to delete this document");
	    }
	    
	    try {
	        documentRepository.delete(document);
	        log.info("Successfully deleted document with ID: {}", id);
	        
	        // If you're using S3 or other storage, add cleanup here
	        // deleteFromS3(document.getS3Url());
	        
	    } catch (Exception e) {
	        log.error("Error deleting document with ID {}: {}", id, e.getMessage());
	        throw new RuntimeException("Failed to delete document: " + e.getMessage());
	    }
	}

}
