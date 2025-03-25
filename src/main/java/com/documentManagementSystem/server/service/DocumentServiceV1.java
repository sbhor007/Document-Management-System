//package com.documentManagementSystem.server.service;
//
//import java.io.IOException;
//import java.time.LocalDateTime;
//import java.util.Arrays;
//import java.util.List;
//import java.util.Objects;
//import java.util.stream.Collectors;
//
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.core.io.InputStreamResource;
//import org.springframework.core.io.Resource;
//import org.springframework.stereotype.Service;
//import org.springframework.transaction.annotation.Transactional;
//import org.springframework.web.multipart.MultipartFile;
//
//import com.amazonaws.services.s3.model.AmazonS3Exception;
//import com.amazonaws.services.s3.model.S3Object;
//import com.documentManagementSystem.server.entity.Document;
//import com.documentManagementSystem.server.entity.Folder;
//import com.documentManagementSystem.server.entity.Users;
//import com.documentManagementSystem.server.repository.DocumentRepository;
//import com.documentManagementSystem.server.repository.FolderRepository;
//
//import lombok.extern.slf4j.Slf4j;
//
//@Service
//@Slf4j
//@Transactional
//public class DocumentServiceV1 {
//	@Autowired
//	private  DocumentRepository documentRepository;
//	
//	@Autowired
//	private FolderRepository folderRepository;
//	
//	@Autowired
//    private  S3Service s3Service;
//    
//	@Autowired
//    private  UserService userService;
//    
////	@Autowired
////    private FolderService folderService; 
//	
//	
//	
//	public List<Document> uploadDocument(MultipartFile[] files, Long folderId, String username) throws IOException {
//        log.info("Uploading documents for folder ID: {} and username: {}", folderId, username);
//
//        // Retrieve folder with the folder ID
//        Folder folder = folderRepository.findById(folderId)
//                .orElseThrow(() -> new RuntimeException("Folder not found"));
//
//        // Check authenticated user
//        log.info("Document service Username: {}", username);
//        if (!folder.getUser().getUserName().equals(username)) {
//            log.warn("Unauthorized access upload to folder {} by user {}", folderId, username);
//            throw new RuntimeException("Unauthorized to upload to this folder");
//        }
//
//        // Process and upload files to S3
//        List<Document> documents = Arrays.stream(files)
//                .map(file -> {
//                    if (file.isEmpty()) {
//                        log.warn("Empty file skipped: {}", file.getOriginalFilename());
//                        return null;
//                    }
//
//                    try {
//                        // Upload to S3 and get the S3 URL
//                        String s3Url = s3Service.uploadFile(file);
//
//                        // Create Document entity
//                        Document document = new Document();
//                        document.setDocumentName(file.getOriginalFilename());
//                        document.setFileType(file.getContentType());
//                        document.setS3Url(s3Url);
//                        document.setUploadedAt(LocalDateTime.now());
//                        document.setFolder(folder);
//                        document.setUser(folder.getUser());
//
//                        log.info("Uploaded document: {} to S3 at {}", file.getOriginalFilename(), s3Url);
//                        return document;
//                    } catch (IOException e) {
//                        log.error("Failed to upload file {}: {}", file.getOriginalFilename(), e.getMessage());
//                        return null;
//                    }
//                })
//                .filter(Objects::nonNull) // Remove nulls from failed uploads
//                .collect(Collectors.toList());
//
//        // Check if any documents were processed successfully
//        if (documents.isEmpty()) {
//            log.warn("No documents were successfully processed for upload");
//            throw new IOException("No documents were uploaded due to processing errors");
//        }
//
//        // Save all documents to the database
//        documentRepository.saveAll(documents);
//        log.info("Documents uploaded successfully");
//        return documents;
//    }
//	
//	public Document getDocumentById(Long id, String username) {
//        Document document = documentRepository.findById(id)
//                .orElseThrow(() -> new RuntimeException("Document not found with ID: " + id));
//        if (!document.getUser().getUserName().equals(username)) {
//            throw new SecurityException("Unauthorized access to document");
//        }
//        return document;
//    }
//	
//	public Resource getDocumentFile(Long id, String username) throws IOException {
//        Document document = getDocumentById(id, username);
//        S3Object s3Object = s3Service.downloadFile(document.getS3Url());
//        return new InputStreamResource(s3Object.getObjectContent());
//    }
//	
//	public void deleteDocument(Long id, String username) {
//        Document document = getDocumentById(id, username);
//        s3Service.deleteFile(document.getS3Url());
//        documentRepository.delete(document);
//    }
//	
//	public void deleteSelectedDocumentsByFolder(Long folderId,String username) throws AmazonS3Exception {
//		List<Document> documents = getDocumentsByFolder(folderId, username);
//		s3Service.deleteSelectedFiles(documents);
//		documentRepository.deleteAll(documents);
//	}
//	
//	public List<Document> getDocumentsByFolder(Long folderId, String username) {
//		
//		log.info("Fetching documents for folder ID: {} and username: {}", folderId, username);
//
//		Folder folder = folderRepository.findById(folderId)
//				.orElseThrow(() -> new RuntimeException("Folder not found with ID: " + folderId));
//
//		if (!folder.getUser().getUserName().equals(username)) {
//			log.warn("Unauthorized access attempt to folder {} by user {}", folderId, username);
//			throw new RuntimeException("Unauthorized access to this folder");
//		}
//
//		List<Document> documents = documentRepository.findByFolderId(folderId);
//		log.info("Found {} documents in folder {}", documents.size(), folderId);
//
//		return documents;
//	}
//	
//	public String getPreSignedUrl(Long id, String username) {
//        Document document = getDocumentById(id, username);
//        return s3Service.preSignedUrl(document.getS3Url());
//    }
//
//}
