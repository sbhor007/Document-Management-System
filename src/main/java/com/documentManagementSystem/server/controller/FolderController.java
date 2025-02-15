package com.documentManagementSystem.server.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.documentManagementSystem.server.DTO.FolderRequest;
import com.documentManagementSystem.server.DTO.FolderResponse;
import com.documentManagementSystem.server.service.FolderService;

@RestController
@RequestMapping("/api/folders")
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
    public ResponseEntity<FolderResponse> createFolder(@RequestBody FolderRequest request) {
    	System.out.println("folder-api : " + request);
        return ResponseEntity.ok(folderService.createFolder(request));
    }

    // Get folder details (including subfolders)
    @GetMapping("/{folderId}")
    public ResponseEntity<FolderResponse> getFolderDetails(@PathVariable Long folderId) {
        return ResponseEntity.ok(folderService.getFolderDetails(folderId));
    }

    // Get all folders for a user
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<FolderResponse>> getUserFolders(@PathVariable Long userId) {
        return ResponseEntity.ok(folderService.getUserFolders(userId));
    }

    // Delete a folder (optional: delete subfolders/documents)
    @DeleteMapping("/{folderId}")
    public ResponseEntity<String> deleteFolder(@PathVariable Long folderId) {
        folderService.deleteFolder(folderId);
        return ResponseEntity.ok("Folder deleted successfully.");
    }
}