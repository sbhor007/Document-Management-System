package com.documentManagementSystem.server.service;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Arrays;
import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.FileSystemResource;
import org.springframework.core.io.Resource;
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

	private static final Logger log = LoggerFactory.getLogger(DocumentService.class);

	@Autowired
	private DocumentRepository documentRepository;

	@Autowired
	private UsersRepository userRepository;

	@Autowired
	private FolderRepository folderRepository;

	@Value("${file.upload-dir}")
	private String uploadDir;

	public void uploadDocument(MultipartFile[] files, Long folderId, String username) throws IOException {

		/*
		 * retrive folder with the folder id
		 */
		log.info("Uploading documents for folder ID: {} and username: {}", folderId, username);
		Folder folder = folderRepository.findById(folderId).orElseThrow(() -> new RuntimeException("Folder not found"));

		/*
		 * check authenticated user
		 */
		log.info("Document service Username: {}", username);
		if (!folder.getUser().getUserName().equals(username)) {
			log.warn("Unauthorized access upload to document {} by user {}", folderId, username);
			throw new RuntimeException("Unauthorized to upload to this folder");
		}

		/*
		 * check file directory exist
		 */
		
		 String newUploadDir =  uploadDir + folder.getFolderName() + "\\";
		File directory = new File(newUploadDir);
		if (!directory.exists()) {
			log.info("New Directory created {}",directory.getPath());
			directory.mkdir();
		} else {
			log.info("Directory found");
		}
		log.info("New Directory created {}",directory.getPath());

		List<Document> documents = Arrays.stream(files).map(file -> {

			if (file.isEmpty()) {
				log.warn("Empty file skipped: {}", file.getOriginalFilename());
			}
			// Generate unique file name
			String fileName = System.currentTimeMillis() + "_" + file.getOriginalFilename();
			Path filePath = Paths.get(newUploadDir + fileName);
			log.info("file path {}",filePath);

			// Save file to local storage

			try {
				Files.write(filePath, file.getBytes());

				Document document = new Document();
				document.setDocumentName(file.getOriginalFilename());
				document.setFileType(file.getContentType());
				document.setS3Url(filePath.toString());
				document.setFolder(folder);
				document.setUser(folder.getUser());
				log.info("Uploaded document: {} to {}", file.getOriginalFilename(), filePath);
				return document;
			} catch (IOException e) {
				log.error("Failed to upload file {}: {}", file.getOriginalFilename(), e.getMessage());
				return null;
			}
		})
				.filter(Objects::nonNull) // Remove nulls from failed uploads
				.collect(Collectors.toList());
		if (documents.isEmpty()) {
            log.warn("No documents were successfully processed for upload");
            throw new IOException("No documents were uploaded due to processing errors");
        }
		documentRepository.saveAll(documents);
		log.info("Documents uploaded successfully");
	}

	public Document getDocumentById(Long documentId, String username) {
		log.info("Fetching document by document ID: {} and username: {}", documentId, username);
		Document document = documentRepository.findById(documentId)
				.orElseThrow(() -> new RuntimeException("Document not found"));
		if (!document.getUser().getUserName().equals(username)) {
			log.warn("Unauthorized access attempt to document {} by user {}", documentId, username);
			throw new RuntimeException("Unauthorized access to this document");
		}
		log.info("Found document with ID: {}", documentId);
		return document;
	}

	public List<Document> getDocumentsByFolder(Long folderId, String username) {
		
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
	}

	public List<Document> getAllDocumentsByUser(String username) {
		log.info("Fetching all documents for username: {}", username);
		Users user = userRepository.findByUserName(username);
		if (user == null) {
			log.warn("Unauthorized access attempt by user {}", username);
			throw new RuntimeException("User not found");
		}
		List<Document> documents = documentRepository.findByUserId(user.getId());
		log.info("Found {} documents in user {}", documents.size(), user.getName());
		return documents;
	}

	/*
	 * for docundoad functionality
	 */
	
	public Resource getDocumentFile(Long documentId,String username) throws IOException{
		log.info("Fetching document file by ID: {} for username: {}", documentId, username);
		Document document = documentRepository.findById(documentId)
				.orElseThrow(() -> new RuntimeException("Document Not found"));
		if (!document.getUser().getUserName().equals(username)) {
	        log.warn("Unauthorized access attempt to document {} by user {}", documentId, username);
	        throw new RuntimeException("Unauthorized access to this document");
	    }
		File file = new File(document.getS3Url());
		if(!file.exists()) {
			log.error("File not found on server: {}:{}", document.getS3Url(),file.getPath());
	        throw new IOException("File not found on server");
		}
		return new FileSystemResource(file);
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
//	         deleteFromS3(document.getS3Url());

		} catch (Exception e) {
			log.error("Error deleting document with ID {}: {}", id, e.getMessage());
			throw new RuntimeException("Failed to delete document: " + e.getMessage());
		}
	}

}
