package com.documentManagementSystem.server.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.documentManagementSystem.server.DTO.FolderRequest;
import com.documentManagementSystem.server.DTO.FolderResponse;
import com.documentManagementSystem.server.responce.ApiResponse;
import com.documentManagementSystem.server.service.FolderService;

import lombok.extern.java.Log;
import lombok.extern.slf4j.Slf4j;

@RestController
@RequestMapping("/api/folders")
@Slf4j
public class FolderController {
	
	@Autowired
    private  FolderService folderService;
//	
	@PostMapping("/test")
	public String name() {
		return "santosh";
	}

    // Create a new folder
    @PostMapping("/create-folder")
    public ResponseEntity<ApiResponse<FolderResponse>> createFolder(
    		@RequestBody FolderRequest request,
    		Authentication authentication
    		) {
    	String username = authentication.getName();
        log.info("Creating folder for user: {}, request: {}", username, request);
        try {
            FolderResponse folderResponse = folderService.createFolder(request, username);
            return ResponseEntity.status(HttpStatus.OK)
                    .body(new ApiResponse<>("success", "Folder created successfully", folderResponse));
        } catch (RuntimeException e) {
            log.error("Error creating folder for user: {}, error: {}", username, e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new ApiResponse<>("error", e.getMessage(), null));
        }
    	    }

    // Get folder details (including subfolders)
    @GetMapping("/{folderId}")
    public ResponseEntity<ApiResponse<FolderResponse>> getFolderDetails(@PathVariable Long folderId,Authentication authentication) {
    	String username = authentication.getName();
        log.debug("Fetching folder details for folderId: {} by user: {}", folderId, username);
        try {
            FolderResponse folderResponse = folderService.getFolderDetails(folderId, username);
            return ResponseEntity.status(HttpStatus.OK)
                    .body(new ApiResponse<>("success", "Folder details fetched successfully", folderResponse));
        } catch (RuntimeException e) {
            log.error("Error fetching folder details for folderId: {} by user: {}, error: {}", 
                    folderId, username, e.getMessage());
            HttpStatus status = e.getMessage().contains("not found") ? HttpStatus.NOT_FOUND : HttpStatus.FORBIDDEN;
            return ResponseEntity.status(status)
                    .body(new ApiResponse<>("error", e.getMessage(), null));
        }
    }

    // Get all folders for a user
    @GetMapping("/all-folders")
    public ResponseEntity<ApiResponse<List<FolderResponse>>> getAllFolders(Authentication authentication) {
        String username = authentication.getName();
        log.info("Fetching all folders for user: {}", username);
        try {
            List<FolderResponse> folders = folderService.getAllFolders(username);
            log.info("Fetched {} folders for user: {}", folders.size(), username);
            return ResponseEntity.status(HttpStatus.OK)
                    .body(new ApiResponse<>("success", "Folders fetched successfully", folders));
        } catch (RuntimeException e) {
            log.error("Error fetching folders for user: {}, error: {}", username, e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ApiResponse<>("error", e.getMessage(), null));
        }
    }

    // Delete a folder (optional: delete subfolders/documents)
    @DeleteMapping("/{folderId}")
    public ResponseEntity<ApiResponse<String>> deleteFolder(
            @PathVariable Long folderId,
            Authentication authentication) {
        String username = authentication.getName();
        log.debug("Deleting folderId: {} for user: {}", folderId, username);
        try {
            folderService.deleteFolder(folderId, username);
            return ResponseEntity.status(HttpStatus.OK)
                    .body(new ApiResponse<>("success", "Folder deleted successfully", null));
        } catch (RuntimeException e) {
            log.error("Error deleting folderId: {} for user: {}, error: {}", folderId, username, e.getMessage());
            HttpStatus status = e.getMessage().contains("not found") ? HttpStatus.NOT_FOUND : 
                               e.getMessage().contains("Access denied") ? HttpStatus.FORBIDDEN : 
                               HttpStatus.INTERNAL_SERVER_ERROR;
            return ResponseEntity.status(status)
                    .body(new ApiResponse<>("error", e.getMessage(), null));
        }
    }
}