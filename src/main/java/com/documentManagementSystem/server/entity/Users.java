package com.documentManagementSystem.server.entity;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Set;

import org.hibernate.annotations.processing.Exclude;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonManagedReference;

import jakarta.persistence.*;
import lombok.Data;
import lombok.ToString;

@Entity
@Table(name = "users")
@Data
public class Users {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false, unique = true)
    private String userName;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private String password;
    
    @Column(nullable = false)
    private String roll;


    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnoreProperties({"user", "documents"})
    @ToString.Exclude
    private List<Folder> folders;

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnoreProperties({"user", "folder"})
    @ToString.Exclude
    private List<Document> documents;

    
}