package com.documentManagementSystem.server.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "search_index")
public class SearchIndex {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(length = 16000) // Store indexed text.
    private String indexedText;

    @OneToOne
    @JoinColumn(name = "document_id")
    private Document document; // The document indexed.

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public String getIndexedText() {
		return indexedText;
	}

	public void setIndexedText(String indexedText) {
		this.indexedText = indexedText;
	}

	public Document getDocument() {
		return document;
	}

	public void setDocument(Document document) {
		this.document = document;
	}

    
}

