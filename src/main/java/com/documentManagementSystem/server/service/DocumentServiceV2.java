package com.documentManagementSystem.server.service;

import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.util.Arrays;
import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.InputStreamResource;
import org.springframework.core.io.Resource;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import com.documentManagementSystem.server.entity.Document;
import com.documentManagementSystem.server.entity.Folder;
import com.documentManagementSystem.server.entity.Users;
import com.documentManagementSystem.server.repository.DocumentRepository;
import com.documentManagementSystem.server.repository.FolderRepository;
import com.documentManagementSystem.server.repository.UsersRepository;

@Service
public class DocumentServiceV2 {
	private static final Logger log = LoggerFactory.getLogger(DocumentServiceV2.class);

    @Autowired
    private DocumentRepository documentRepository;

    @Autowired
    private UsersRepository userRepository;

    @Autowired
    private FolderRepository folderRepository;

    @Transactional
    public void uploadDocument(MultipartFile[] files, Long folderId, String username) throws IOException {
        log.info("Uploading documents for folder ID: {} and username: {}", folderId, username);
        Folder folder = folderRepository.findById(folderId)
                .orElseThrow(() -> new RuntimeException("Folder not found"));

        if (!folder.getUser().getUserName().equals(username)) {
            log.warn("Unauthorized access upload to folder {} by user {}", folderId, username);
            throw new RuntimeException("Unauthorized to upload to this folder");
        }

        List<Document> documents = Arrays.stream(files)
                .map(file -> {
                    if (file.isEmpty()) {
                        log.warn("Empty file skipped: {}", file.getOriginalFilename());
                        return null;
                    }
                    try {
                        Document document = new Document();
                        document.setDocumentName(file.getOriginalFilename());
                        document.setFileType(file.getContentType());
                        document.setFileContent(file.getBytes()); // Store file bytes in DB
                        document.setSize(file.getSize()); // Set the file size
                        document.setFolder(folder);
                        document.setUser(folder.getUser());
                        log.info("Prepared document for upload: {}", file.getOriginalFilename());
                        return document;
                    } catch (IOException e) {
                        log.error("Failed to process file {}: {}", file.getOriginalFilename(), e.getMessage());
                        return null;
                    }
                })
                .filter(Objects::nonNull)
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
        log.info("Found {} documents for user {}", documents.size(), user.getName());
        return documents;
    }

    public Resource getDocumentFile(Long documentId, String username) throws IOException {
        log.info("Fetching document file by ID: {} for username: {}", documentId, username);
        Document document = documentRepository.findById(documentId)
                .orElseThrow(() -> new RuntimeException("Document not found"));
        if (!document.getUser().getUserName().equals(username)) {
            log.warn("Unauthorized access attempt to document {} by user {}", documentId, username);
            throw new RuntimeException("Unauthorized access to this document");
        }
        if (document.getFileContent() == null || document.getFileContent().length == 0) {
            log.error("No file content found for document ID: {}", documentId);
            throw new IOException("File content not found in database");
        }
        return new InputStreamResource(new ByteArrayInputStream(document.getFileContent()));
    }
    
    @Transactional
    public void deleteAllDocumentsByFolder(Long folderId, String username) {
        log.info("Attempting to delete all documents in folder ID: {} by user: {}", folderId, username);
        
        Folder folder = folderRepository.findById(folderId)
            .orElseThrow(() -> new RuntimeException("Folder not found with ID: " + folderId));
        
        if (!folder.getUser().getUserName().equals(username)) {
            log.warn("Unauthorized attempt to delete documents in folder {} by user {}", folderId, username);
            throw new RuntimeException("Unauthorized: You don't have permission to delete documents in this folder");
        }
        
        try {
            List<Document> documents = documentRepository.findByFolderId(folderId);
            
            if (documents.isEmpty()) {
                log.info("No documents found in folder ID: {} to delete", folderId);
                folderRepository.delete(folder);
                log.info("Deleted empty folder with ID: {}", folderId);
                return;
            }
            
            documentRepository.deleteAll(documents);
            log.info("Successfully deleted {} documents from folder ID: {}", documents.size(), folderId);
            
            // Delete the folder after all documents are removed
            folderRepository.delete(folder);
            log.info("Deleted folder with ID: {} after removing all documents", folderId);
            
        } catch (Exception e) {
            log.error("Error deleting documents from folder ID {}: {}", folderId, e.getMessage());
            throw new RuntimeException("Failed to delete documents: " + e.getMessage());
        }
    }

    @Transactional
    public void deleteDocument(Long documentId, String username) {
        log.info("Attempting to delete document with ID: {} by user: {}", documentId, username);
        Document document = documentRepository.findById(documentId)
                .orElseThrow(() -> new RuntimeException("Document not found with ID: " + documentId));
        if (!document.getUser().getUserName().equals(username)) {
            log.warn("Unauthorized deletion attempt of document {} by user {}", documentId, username);
            throw new RuntimeException("Unauthorized: You don't have permission to delete this document");
        }
        try {
            Folder folder = document.getFolder();
            documentRepository.delete(document);
            log.info("Successfully deleted document with ID: {}", documentId);

            // Optional: Delete folder if empty
            List<Document> remainingDocs = documentRepository.findByFolderId(folder.getId());
            if (remainingDocs.isEmpty()) {
                folderRepository.delete(folder);
                log.info("Deleted empty folder with ID: {}", folder.getId());
            }
        } catch (Exception e) {
            log.error("Error deleting document with ID {}: {}", documentId, e.getMessage());
            throw new RuntimeException("Failed to delete document: " + e.getMessage());
        }
    }
}
