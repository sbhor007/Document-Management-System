package com.documentManagementSystem.server.DTO;

import java.util.List;
import java.util.stream.Collectors;

import com.documentManagementSystem.server.entity.Folder;

import lombok.Data;

@Data
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
    
}
