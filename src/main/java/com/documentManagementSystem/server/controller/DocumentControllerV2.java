package com.documentManagementSystem.server.controller;
import java.io.IOException;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.documentManagementSystem.server.entity.Document;
import com.documentManagementSystem.server.responce.ApiResponse;
import com.documentManagementSystem.server.service.DocumentService;
import com.documentManagementSystem.server.service.DocumentServiceV2;

import jakarta.servlet.http.HttpServletRequest;
import lombok.extern.slf4j.Slf4j;

@RestController
@RequestMapping("/api/documentsv2")
@Slf4j
public class DocumentControllerV2 {
	@Autowired
    private DocumentServiceV2 documentService;

    @GetMapping("/check")
    public String check() {
        return "ALL is Good";
    }

    @PostMapping("/upload/{folderId}")
    public ResponseEntity<?> uploadDocuments(
            @RequestParam("files") MultipartFile[] files,
            @PathVariable Long folderId,
            Authentication authentication,
            HttpServletRequest request) {
        log.info("Request Content-Type: {}", request.getContentType());
        try {
            if (files == null || files.length == 0) {
                log.error("No files received in the request!");
                return ResponseEntity.badRequest().body(new ApiResponse("fail", "No files were uploaded."));
            }
            log.info("Number of files received: {}", files.length);
            for (MultipartFile file : files) {
                log.info("File received: {} (Size: {} bytes)", file.getOriginalFilename(), file.getSize());
            }
            documentService.uploadDocument(files, folderId, authentication.getName());
            return ResponseEntity.status(HttpStatus.OK)
                    .body(new ApiResponse("success", "Documents uploaded successfully"));
        } catch (IOException e) {
            log.error("Error uploading documents: {}", e.getMessage());
            return ResponseEntity.status(500)
                    .body(new ApiResponse("fail", "Error uploading documents: " + e.getMessage()));
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<Document> getDocumentById(@PathVariable Long id, Authentication authentication) {
        Document document = documentService.getDocumentById(id, authentication.getName());
        return ResponseEntity.ok(document);
    }

    @GetMapping("/folder/{folderId}")
    public ResponseEntity<ApiResponse<?>> getDocumentsByFolder(@PathVariable Long folderId,
            Authentication authentication) {
        log.info("Folder ID: {}", folderId);
        List<Document> documents = documentService.getDocumentsByFolder(folderId, authentication.getName());
        return ResponseEntity.status(HttpStatus.OK)
                .body(new ApiResponse("success", "Retrieved all documents inside folder successfully", documents));
    }

    @GetMapping
    public ResponseEntity<List<Document>> getAllDocumentsByUser(Authentication authentication) {
        return ResponseEntity.ok(documentService.getAllDocumentsByUser(authentication.getName()));
    }

    @GetMapping("/download/{documentId}")
    public ResponseEntity<?> downloadDocument(@PathVariable Long documentId, Authentication authentication) {
        try {
            Resource fileResource = documentService.getDocumentFile(documentId, authentication.getName());
            Document document = documentService.getDocumentById(documentId, authentication.getName());
            return ResponseEntity.ok()
                    .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"" + document.getDocumentName() + "\"")
                    .contentType(MediaType.parseMediaType(document.getFileType()))
                    .body(fileResource);
        } catch (Exception e) {
            log.error("Error downloading document {}: {}", documentId, e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
            		.body(new ApiResponse("fail", "faild to download" + e.getMessage()));
        }
    }

    @DeleteMapping("/{documentId}")
    public ResponseEntity<ApiResponse<?>> deleteDocument(@PathVariable Long documentId, Authentication authentication) {
        documentService.deleteDocument(documentId, authentication.getName());
        return ResponseEntity.status(HttpStatus.OK)
        		.body(new ApiResponse("success", "document delete successfully"));
    }
}
