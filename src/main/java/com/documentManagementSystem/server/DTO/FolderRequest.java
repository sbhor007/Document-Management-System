package com.documentManagementSystem.server.DTO;

import lombok.Data;

@Data
public class FolderRequest {
	private String folderName;
	private String folderDescription;
    private Long parentFolderId = null;
}
