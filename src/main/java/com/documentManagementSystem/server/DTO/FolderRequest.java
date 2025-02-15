package com.documentManagementSystem.server.DTO;

public class FolderRequest {
	
	private String folderName;
//    private Long userId;
    private Long parentFolderId;
    
	public String getFolderName() {
		return folderName;
	}
	public void setFolderName(String folderName) {
		this.folderName = folderName;
	}
//	public Long getUserId() {
//		return userId;
//	}
//	public void setUserId(Long userId) {
//		this.userId = userId;
//	}
	public Long getParentFolderId() {
		return parentFolderId;
	}
	public void setParentFolderId(Long parentFolderId) {
		this.parentFolderId = parentFolderId;
	}
	@Override
	public String toString() {
		return "FolderRequest [folderName=" + folderName +  ", parentFolderId=" + parentFolderId
				+ "]";
	} 
    
    

}
