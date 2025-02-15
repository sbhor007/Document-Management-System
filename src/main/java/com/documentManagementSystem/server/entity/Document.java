package com.documentManagementSystem.server.entity;

import java.time.LocalDateTime;
import java.util.Set;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "documents")
@Data
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

    
}
