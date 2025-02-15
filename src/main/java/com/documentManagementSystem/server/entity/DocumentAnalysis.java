package com.documentManagementSystem.server.entity;

import java.time.LocalDateTime;
import java.util.Map;

import jakarta.persistence.*;

@Entity
@Table(name = "document_analysis")
public class DocumentAnalysis {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String documentType; // AI-detected type (Invoice, Contract, etc.)
    
    @Column(length = 5000) // Large text for summaries.
    private String summary;

    @Column(length = 10000) // Full extracted text.
    private String extractedText;

    @ElementCollection
    @CollectionTable(name = "document_key_info", joinColumns = @JoinColumn(name = "analysis_id"))
    @MapKeyColumn(name = "key_name")
    @Column(name = "key_value")
    private Map<String, String> keyInformation; // Key details like {"Amount": "$500", "Due Date": "2025-02-15"}

    @OneToOne
    @JoinColumn(name = "document_id", nullable = false)
    private Document document; // The document analyzed.

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public String getDocumentType() {
		return documentType;
	}

	public void setDocumentType(String documentType) {
		this.documentType = documentType;
	}

	public String getSummary() {
		return summary;
	}

	public void setSummary(String summary) {
		this.summary = summary;
	}

	public String getExtractedText() {
		return extractedText;
	}

	public void setExtractedText(String extractedText) {
		this.extractedText = extractedText;
	}

	public Map<String, String> getKeyInformation() {
		return keyInformation;
	}

	public void setKeyInformation(Map<String, String> keyInformation) {
		this.keyInformation = keyInformation;
	}

	public Document getDocument() {
		return document;
	}

	public void setDocument(Document document) {
		this.document = document;
	}

    
}

