//package com.documentManagementSystem.server.controller;
//
//import java.io.IOException;
//import java.util.List;
//
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.core.io.Resource;
//import org.springframework.http.HttpHeaders;
//import org.springframework.http.HttpStatus;
//import org.springframework.http.MediaType;
//import org.springframework.http.ResponseEntity;
//import org.springframework.security.core.Authentication;
//import org.springframework.web.bind.annotation.DeleteMapping;
//import org.springframework.web.bind.annotation.GetMapping;
//import org.springframework.web.bind.annotation.PathVariable;
//import org.springframework.web.bind.annotation.PostMapping;
//import org.springframework.web.bind.annotation.RequestMapping;
//import org.springframework.web.bind.annotation.RequestParam;
//import org.springframework.web.bind.annotation.RestController;
//import org.springframework.web.multipart.MultipartFile;
//
//import com.documentManagementSystem.server.entity.Document;
//import com.documentManagementSystem.server.responce.ApiResponse;
//import com.documentManagementSystem.server.service.DocumentServiceV1;
//
//import lombok.extern.slf4j.Slf4j;
//
//@RestController
//@RequestMapping("/api/documentsV1")
//@Slf4j
//public class DocumentControllerV1 {
//	@Autowired
//	private DocumentServiceV1 documentService;
//	
//	@PostMapping("/upload/{folderId}")
//    public ResponseEntity<ApiResponse<?>> uploadDocuments(
//            @RequestParam("files") MultipartFile[] files,
//            @PathVariable Long folderId,
//            Authentication authentication) {
//        try {
//            log.info("Received upload request for {} files to folder ID: {}", files.length, folderId);
//            List<Document> documents = documentService.uploadDocument(files, folderId, authentication.getName());
//            return ResponseEntity.ok(new ApiResponse("success", "Documents uploaded successfully", documents));
//        } catch (IOException e) {
//            log.error("Failed to upload documents: {}", e.getMessage());
//            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
//                    .body(new ApiResponse("error", "Failed to upload documents: " + e.getMessage()));
//        } catch (RuntimeException e) {
//            log.warn("Unauthorized or invalid request: {}", e.getMessage());
//            return ResponseEntity.status(HttpStatus.FORBIDDEN)
//                    .body(new ApiResponse("error", e.getMessage()));
//        }
//    }
//
//    @GetMapping("/download/{documentId}")
//    public ResponseEntity<Resource> downloadDocument(
//            @PathVariable Long documentId,
//            Authentication authentication) {
//        try {
//            log.info("Received download request for document ID: {} by user: {}", documentId, authentication.getName());
//            Document document = documentService.getDocumentById(documentId, authentication.getName());
//            Resource fileResource = documentService.getDocumentFile(documentId, authentication.getName());
//
//            return ResponseEntity.ok()
//                    .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + document.getDocumentName() + "\"")
//                    .contentType(MediaType.parseMediaType(document.getFileType()))
//                    .body(fileResource);
//        } catch (IOException e) {
//            log.error("Failed to download document ID {}: {}", documentId, e.getMessage());
//            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
//        } catch (RuntimeException e) {
//            log.warn("Document not found or unauthorized: {}", e.getMessage());
//            return ResponseEntity.status(HttpStatus.NOT_FOUND)
//                    .body(null);
//        }
//    }
//
//    @DeleteMapping("/{documentId}")
//    public ResponseEntity<ApiResponse> deleteDocument(
//            @PathVariable Long documentId,
//            Authentication authentication) {
//        try {
//            log.info("Received delete request for document ID: {} by user: {}", documentId, authentication.getName());
//            documentService.deleteDocument(documentId, authentication.getName());
//            return ResponseEntity.ok(new ApiResponse("success", "Document deleted successfully"));
//        } catch (RuntimeException e) {
//            log.warn("Failed to delete document ID {}: {}", documentId, e.getMessage());
//            return ResponseEntity.status(HttpStatus.NOT_FOUND)
//                    .body(new ApiResponse("error", "Document not found or unauthorized: " + e.getMessage()));
//        }
//    }
//    
//    @GetMapping("/folder/{folderId}")
//	public ResponseEntity<ApiResponse<?>> getDocumentsByFolder(@PathVariable Long folderId,
//			Authentication authentication) {
//		log.info("Folder ID : {}",folderId);
//		List<Document> documents = documentService.getDocumentsByFolder(folderId, authentication.getName());
//		 return ResponseEntity.status(HttpStatus.OK).body(new ApiResponse("success", "getting all documents inside that folder successfully",documents));
//	}
//    
//    @GetMapping("/presigned/{documentId}")
//    public ResponseEntity<ApiResponse<?>> getPreSignedUrl(
//            @PathVariable Long documentId,
//            Authentication authentication) {
//        try {
//            log.info("Received request for pre-signed URL for document ID: {} by user: {}", documentId, authentication.getName());
//            String preSignedUrl = documentService.getPreSignedUrl(documentId, authentication.getName());
//            return ResponseEntity.ok(new ApiResponse("success", "Pre-signed URL generated successfully", preSignedUrl));
//        } catch (RuntimeException  e) {
//            log.warn("Failed to generate pre-signed URL for document ID {}: {}", documentId, e.getMessage());
//            return ResponseEntity.status(HttpStatus.NOT_FOUND)
//                    .body(new ApiResponse("error", "Document not found or unauthorized: " + e.getMessage()));
//        }
//    }
//}
