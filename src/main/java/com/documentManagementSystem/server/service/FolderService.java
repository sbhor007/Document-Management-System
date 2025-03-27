package com.documentManagementSystem.server.service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.documentManagementSystem.server.DTO.FolderRequest;
import com.documentManagementSystem.server.DTO.FolderResponse;
import com.documentManagementSystem.server.entity.Document;
import com.documentManagementSystem.server.entity.Folder;
import com.documentManagementSystem.server.entity.Users;
import com.documentManagementSystem.server.repository.DocumentRepository;
import com.documentManagementSystem.server.repository.FolderRepository;
import com.documentManagementSystem.server.repository.UsersRepository;

import lombok.extern.slf4j.Slf4j;

@Service
@Slf4j
public class FolderService {
	@Autowired
	private FolderRepository folderRepository;

	@Autowired
	private UserService userService;
	
	@Autowired
	DocumentServiceV2 documentService;
	
	

	public FolderResponse createFolder(FolderRequest request, String username) {
        log.debug("Creating folder for user: {}, request: {}", username, request);
        if (request == null) {
            log.error("Folder creation failed: Request is null for user: {}", username);
            throw new RuntimeException("Folder request cannot be null");
        }

        Users user = userService.findByUserName(username);
        if (user == null) {
            log.error("User not found: {}", username);
            throw new RuntimeException("User not found: " + username);
        }

        Folder folder = new Folder();
        folder.setFolderName(request.getFolderName());
        folder.setFolderDescription(request.getFolderDescription());
        folder.setUser(user);

        if (request.getParentFolderId() != null) {
            Folder parentFolder = folderRepository.findById(request.getParentFolderId())
                    .orElseThrow(() -> {
                        log.error("Parent folder not found with ID: {}", request.getParentFolderId());
                        return new RuntimeException("Parent folder not found: " + request.getParentFolderId());
                    });
            folder.setParentFolder(parentFolder);
        }

        try {
            Folder savedFolder = folderRepository.save(folder);
            return new FolderResponse(savedFolder);
        } catch (Exception e) {
            log.error("Failed to save folder for user: {}, error: {}", username, e.getMessage());
            throw new RuntimeException("Failed to create folder: " + e.getMessage());
        }
    }

    public List<FolderResponse> getAllFolders(String username) {
        if (username == null) {
            log.error("Username is null while fetching all folders");
            throw new RuntimeException("Username cannot be null");
        }
        try {
            return folderRepository.findByUser_UserName(username)
                    .stream()
                    .map(FolderResponse::new)
                    .collect(Collectors.toList());
        } catch (Exception e) {
            log.error("Failed to fetch folders for user: {}, error: {}", username, e.getMessage());
            throw new RuntimeException("Failed to fetch folders: " + e.getMessage());
        }
    }
    
    

    public void deleteFolder(Long folderId, String username) {
        if (folderId == null) {
            log.error("Folder ID is null for user: {}", username);
            throw new RuntimeException("Folder ID cannot be null");
        }
        if (username == null) {
            log.error("Username is null while deleting folder ID: {}", folderId);
            throw new RuntimeException("Username cannot be null");
        }

        Folder folder = folderRepository.findById(folderId)
                .orElseThrow(() -> {
                    log.error("Folder not found with ID: {} for user: {}", folderId, username);
                    return new RuntimeException("Folder not found: " + folderId);
                });
        

        validateFolderOwnership(folder, username);

        try {
        	documentService.deleteAllDocumentsByFolder(folderId, username);
        	
        } catch (Exception e) {
            log.error("Failed to delete folder ID: {} for user: {}, error: {}", folderId, username, e.getMessage());
            throw new RuntimeException("Failed to delete folder: " + e.getMessage());
        }
    }
    
    public FolderResponse updateFolder(Long folderId, FolderRequest request, String username) {
        if (folderId == null ) {
            log.error("Folder ID is null for user: {}", username);
            throw new RuntimeException("Folder ID cannot be null");
        }
        if (request == null) {
            log.error("Folder update failed: Request is null for user: {}", username);
            throw new RuntimeException("Folder request cannot be null");
        }
        if (username == null) {
            log.error("Username is null while updating folder ID: {}", folderId);
            throw new RuntimeException("Username cannot be null");
        }

        log.debug("Updating folder ID: {} for user: {}, request: {}", folderId, username, request);

        Folder folder = folderRepository.findById(folderId)
                .orElseThrow(() -> {
                    log.error("Folder not found with ID: {} for user: {}", folderId, username);
                    return new RuntimeException("Folder not found: " + folderId);
                });

        validateFolderOwnership(folder, username);

        // Update folder details
        if (request.getFolderName() != null && !request.getFolderName().trim().isEmpty()) {
            folder.setFolderName(request.getFolderName().trim());
        }
        if (request.getFolderDescription() != null) {
            folder.setFolderDescription(request.getFolderDescription().trim());
        }

        // Handle parent folder update if provided
        if (request.getParentFolderId() != null) {
            Folder parentFolder = folderRepository.findById(request.getParentFolderId())
                    .orElseThrow(() -> {
                        log.error("Parent folder not found with ID: {} for user: {}", request.getParentFolderId(), username);
                        return new RuntimeException("Parent folder not found: " + request.getParentFolderId());
                    });
            folder.setParentFolder(parentFolder);
        } else if (request.getParentFolderId() == null && folder.getParentFolder() != null) {
            folder.setParentFolder(null); // Allow removing parent folder
        }

        try {
            Folder updatedFolder = folderRepository.save(folder);
            log.info("Successfully updated folder ID: {} for user: {}", folderId, username);
            return new FolderResponse(updatedFolder);
        } catch (Exception e) {
            log.error("Failed to update folder ID: {} for user: {}, error: {}", folderId, username, e.getMessage());
            throw new RuntimeException("Failed to update folder: " + e.getMessage());
        }
    }
    
    //delete folder with documents
    public FolderResponse getFolderDetails(Long folderId, String username) {
        if (folderId == null) {
            log.error("Folder ID is null for user: {}", username);
            throw new RuntimeException("Folder ID cannot be null");
        }

        Folder folder = folderRepository.findById(folderId)
                .orElseThrow(() -> {
                    log.error("Folder not found with ID: {} for user: {}", folderId, username);
                    return new RuntimeException("Folder not found: " + folderId);
                });
        

        validateFolderOwnership(folder, username);
        return new FolderResponse(folder);
    }

    private void validateFolderOwnership(Folder folder, String username) {
        if (folder == null || username == null || !folder.getUser().getUserName().equals(username)) {
            log.error("Access denied for folder: {} by user: {}", folder != null ? folder.getId() : "null", username);
            throw new RuntimeException("Access denied: You do not own this folder");
        }
    }
}
