package com.documentManagementSystem.server.entity;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Set;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonManagedReference;

import jakarta.persistence.*;

@Entity
@Table(name = "folders")
public class Folder {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String folderName;
    
//    @JsonBackReference
    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    @JsonIgnoreProperties({"folders", "documents", "password"})
    private Users user; // The owner of this folder.

//    @JsonBackReference(value = "parent-folder")
    @ManyToOne
    @JoinColumn(name = "parent_folder_id")
    @JsonIgnoreProperties({"subfolders", "documents", "user"})
    private Folder parentFolder; // Parent folder (NULL if it's a root folder).

//    @JsonManagedReference(value = "parent-folder")
    @OneToMany(mappedBy = "parentFolder", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnoreProperties("parentFolder")
    private List<Folder> subfolders = new ArrayList<Folder>(); // List of subfolders.

//    @JsonManagedReference
    @OneToMany(mappedBy = "folder", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnoreProperties("folder")
    private List<Document> documents = new ArrayList<>(); // List of documents in this folder.

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public String getFolderName() {
		return folderName;
	}

	public void setFolderName(String folderName) {
		this.folderName = folderName;
	}

	public Users getUser() {
		return user;
	}

	public void setUser(Users user) {
		this.user = user;
	}

	public Folder getParentFolder() {
		return parentFolder;
	}

	public void setParentFolder(Folder parentFolder) {
		this.parentFolder = parentFolder;
	}

	public List<Folder> getSubfolders() {
		return subfolders;
	}

	public void setSubfolders(List<Folder> subfolders) {
		this.subfolders = subfolders;
	}

	public List<Document> getDocuments() {
		return documents;
	}

	public void setDocuments(List<Document> documents) {
		this.documents = documents;
	}
    
    
    
}