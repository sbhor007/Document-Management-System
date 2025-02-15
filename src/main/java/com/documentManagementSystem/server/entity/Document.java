package com.documentManagementSystem.server.entity;

import java.time.LocalDateTime;
import java.util.Set;

import jakarta.persistence.*;

@Entity
@Table(name = "documents")
public class Document {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String documentName;

    @Column(nullable = false)
    private String fileType;

    @Column(nullable = false)
    private String s3Url; // Amazon S3 URL for document storage.

    @Column(nullable = false)
    private LocalDateTime uploadedAt = LocalDateTime.now();

    @ManyToOne
    @JoinColumn(name = "folder_id", nullable = false)
    private Folder folder; // The folder where this document is stored.

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private Users user; // The user who uploaded the document.

    @OneToOne(mappedBy = "document", cascade = CascadeType.ALL, orphanRemoval = true)
    private DocumentAnalysis analysis; // AI analysis of this document.

    @OneToOne(mappedBy = "document", cascade = CascadeType.ALL, orphanRemoval = true)
    private SearchIndex searchIndex; // Indexed text for fast searching.

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	

	public String getDocumentName() {
		return documentName;
	}

	public void setDocumentName(String documentName) {
		this.documentName = documentName;
	}

	public String getFileType() {
		return fileType;
	}

	public void setFileType(String fileType) {
		this.fileType = fileType;
	}

	public String getS3Url() {
		return s3Url;
	}

	public void setS3Url(String s3Url) {
		this.s3Url = s3Url;
	}

	public LocalDateTime getUploadedAt() {
		return uploadedAt;
	}

	public void setUploadedAt(LocalDateTime uploadedAt) {
		this.uploadedAt = uploadedAt;
	}

	public Folder getFolder() {
		return folder;
	}

	public void setFolder(Folder folder) {
		this.folder = folder;
	}

	public Users getUser() {
		return user;
	}

	public void setUser(Users user) {
		this.user = user;
	}

	public DocumentAnalysis getAnalysis() {
		return analysis;
	}

	public void setAnalysis(DocumentAnalysis analysis) {
		this.analysis = analysis;
	}

	public SearchIndex getSearchIndex() {
		return searchIndex;
	}

	public void setSearchIndex(SearchIndex searchIndex) {
		this.searchIndex = searchIndex;
	}

    
}
