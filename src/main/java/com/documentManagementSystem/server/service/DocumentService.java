package com.documentManagementSystem.server.service;

import java.io.IOException;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.documentManagementSystem.server.entity.Document;
import com.documentManagementSystem.server.entity.Folder;
import com.documentManagementSystem.server.repository.DocumentRepository;
import com.documentManagementSystem.server.repository.FolderRepository;

@Service
public class DocumentService {

    @Autowired
    private DocumentRepository documentRepository;

    @Autowired
    private FolderRepository folderRepository;

    public void uploadDocument(MultipartFile file, Long folderId) throws IOException {
        Folder folder = folderRepository.findById(folderId)
                .orElseThrow(() -> new RuntimeException("Folder not found"));
        
        // Create a new document entity
        Document document = new Document();
        document.setDocumentName(file.getOriginalFilename()); // Set document name from uploaded file
        document.setFileType(file.getContentType()); // Set file type from uploaded file metadata
        document.setFolder(folder); // Associate document with the selected folder
        document.setUser(folder.getUser()); // Associate document with the authenticated user

        // Save document details in the database
        documentRepository.save(document);
        
    }

    public Document getDocumentById(Long id) {
        return documentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Document not found"));
    }

    public List<Document> getDocumentsByFolder(Long folderId) {
        return documentRepository.findByFolderId(folderId);
    }

    public void deleteDocument(Long id) {
        documentRepository.deleteById(id);
    }
}
