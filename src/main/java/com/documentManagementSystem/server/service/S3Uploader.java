package com.documentManagementSystem.server.service;

import java.util.List;

import org.springframework.web.multipart.MultipartFile;

public interface S3Uploader {
	
	String uploadDocuments(MultipartFile documents);
	List<String> allFiles();
	String preSignedUrl();

}
