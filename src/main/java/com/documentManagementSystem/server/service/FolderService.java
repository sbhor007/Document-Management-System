package com.documentManagementSystem.server.service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.documentManagementSystem.server.DTO.FolderRequest;
import com.documentManagementSystem.server.DTO.FolderResponse;
import com.documentManagementSystem.server.entity.Folder;
import com.documentManagementSystem.server.entity.Users;
import com.documentManagementSystem.server.repository.FolderRepository;
import com.documentManagementSystem.server.repository.UsersRepository;

@Service
public class FolderService {
	@Autowired
	private FolderRepository folderRepository;

	@Autowired
	private UserService userService;

	// Create a new folder
	public FolderResponse createFolder(FolderRequest request, String username) {
		System.out.println(request);
		Users user = userService.findUserByUserName(username);
                // .orElseThrow(() -> new RuntimeException("User not found"));
		if (user == null)
			throw new RuntimeException("User not found");

		Folder folder = new Folder();
		folder.setFolderName(request.getFolderName());
		folder.setUser(user);

		if (request.getParentFolderId() != null) {
			Folder parentFolder = folderRepository.findById(request.getParentFolderId())
					.orElseThrow(() -> new RuntimeException("Parent folder not found"));
			folder.setParentFolder(parentFolder);
		}

		Folder savedFolder = folderRepository.save(folder);
		return new FolderResponse(savedFolder);
	}

	// Get folder details (including subfolders)
	public FolderResponse getFolderDetails(Long folderId, String username) {
		// Find the folder by ID
		Folder folder = folderRepository.findById(folderId).orElseThrow(() -> new RuntimeException("Folder not found"));

		// Ensure the logged-in user is the owner of the folder
		if (!folder.getUser().getUserName().equals(username)) {
			throw new RuntimeException("Access denied: You do not own this folder");
		}

		return new FolderResponse(folder);
	}

	// Get all folders for a user
	public List<FolderResponse> getAllFolders(String username) {
		return folderRepository.findByUser_UserName(username).stream().map(FolderResponse::new)
				.collect(Collectors.toList());
	}

	// Delete a folder (and all subfolders/documents)
	public void deleteFolder(Long folderId,String username) {
		Folder folder = folderRepository.findById(folderId).orElseThrow(() -> new RuntimeException("Folder not found"));
		
		if(!folder.getUser().getUserName().equals(username)) {
			throw new RuntimeException("Access denied: You do not own this folder");
		}
		folderRepository.delete(folder);
	}

}
