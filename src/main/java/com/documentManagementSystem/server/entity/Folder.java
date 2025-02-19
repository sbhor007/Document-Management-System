package com.documentManagementSystem.server.entity;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Set;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonManagedReference;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "folders")
@Data
public class Folder {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String folderName;
    
    @Column(nullable = false)
    private String folderDescription;
    
    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    @JsonIgnoreProperties({"folders", "documents", "password"})
    private Users user; // The owner of this folder.

    @ManyToOne
    @JoinColumn(name = "parent_folder_id")
    @JsonIgnoreProperties({"subfolders", "documents", "user", "parentFolder"})
    private Folder parentFolder; // Parent folder (NULL if it's a root folder).


    @OneToMany(mappedBy = "parentFolder", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnoreProperties({"parentFolder", "documents", "user"})
    private List<Folder> subfolders = new ArrayList<Folder>(); // List of subfolders.

    @OneToMany(mappedBy = "folder", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnoreProperties({"folder", "user"})
    private List<Document> documents = new ArrayList<>(); // List of documents in this folder.
 
}