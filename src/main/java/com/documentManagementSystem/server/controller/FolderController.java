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
import com.documentManagementSystem.server.responce.ApiResponce;
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
    public ResponseEntity<FolderResponse> createFolder(
    		@RequestBody FolderRequest request,
    		Authentication authentication
    		) {
    	String username = authentication.getName();
    	log.info("username is : {}",username);
    	log.info("Folder-Api : {}",request);
        return ResponseEntity.ok(folderService.createFolder(request,username));
    }

    // Get folder details (including subfolders)
    @GetMapping("/{folderId}")
    public ResponseEntity<FolderResponse> getFolderDetails(@PathVariable Long folderId,Authentication authentication) {
        return ResponseEntity.ok(folderService.getFolderDetails(folderId,authentication.getName()));
    }

    // Get all folders for a user
    @GetMapping("/all-folders")
    public ResponseEntity<ApiResponce<List<FolderResponse>>> getAllFolders(Authentication authentication) {
    	log.info("all-folders are called");
    	return ResponseEntity.status(HttpStatus.OK).body(new ApiResponce("success", "folders fached successfully",folderService.getAllFolders(authentication.getName())));
//        return ResponseEntity.ok(folderService.getAllFolders(authentication.getName()));
    }

    // Delete a folder (optional: delete subfolders/documents)
    @DeleteMapping("/{folderId}")
    public ResponseEntity<String> deleteFolder(@PathVariable Long folderId,Authentication authentication) {
        folderService.deleteFolder(folderId,authentication.getName());
        return ResponseEntity.ok("Folder deleted successfully.");
    }
}