package com.documentManagementSystem.server.DTO;

import java.util.List;
import java.util.stream.Collectors;

import com.documentManagementSystem.server.entity.Folder;

public class FolderResponse {
	private Long folderId;
    private String folderName;
    private Long userId;
    private Long parentFolderId;
    private List<String> subfolders;
    private List<String> documents;

    public FolderResponse(Folder folder) {
        this.folderId = folder.getId();
        this.folderName = folder.getFolderName();
        this.userId = folder.getUser().getId();
        this.parentFolderId = folder.getParentFolder() != null ? folder.getParentFolder().getId() : null;
        this.subfolders = folder.getSubfolders().stream().map(Folder::getFolderName).collect(Collectors.toList());
        this.documents = folder.getDocuments().stream().map(doc -> doc.getDocumentName()).collect(Collectors.toList());
    }

	public Long getFolderId() {
		return folderId;
	}

	public void setFolderId(Long folderId) {
		this.folderId = folderId;
	}

	public String getFolderName() {
		return folderName;
	}

	public void setFolderName(String folderName) {
		this.folderName = folderName;
	}

	public Long getUserId() {
		return userId;
	}

	public void setUserId(Long userId) {
		this.userId = userId;
	}

	public Long getParentFolderId() {
		return parentFolderId;
	}

	public void setParentFolderId(Long parentFolderId) {
		this.parentFolderId = parentFolderId;
	}

	public List<String> getSubfolders() {
		return subfolders;
	}

	public void setSubfolders(List<String> subfolders) {
		this.subfolders = subfolders;
	}

	public List<String> getDocuments() {
		return documents;
	}

	public void setDocuments(List<String> documents) {
		this.documents = documents;
	}
    
    
}
