//package com.documentManagementSystem.server.service;
//
////import java.io.IOException;
////import java.util.List;
////import java.util.UUID;
////
////import org.springframework.beans.factory.annotation.Autowired;
////import org.springframework.beans.factory.annotation.Value;
////import org.springframework.stereotype.Service;
////import org.springframework.web.multipart.MultipartFile;
////
////import com.amazonaws.services.s3.AmazonS3;
////import com.amazonaws.services.s3.model.ListObjectsV2Request;
////import com.amazonaws.services.s3.model.ListObjectsV2Result;
////import com.amazonaws.services.s3.model.ObjectMetadata;
////import com.amazonaws.services.s3.model.PutObjectRequest;
////import com.amazonaws.services.s3.model.PutObjectResult;
////import com.amazonaws.services.s3.model.S3Object;
////import com.documentManagementSystem.server.exceptions.ImageUploadException;
//
//import com.amazonaws.services.s3.AmazonS3;
//import com.amazonaws.services.s3.model.*;
//import com.amazonaws.services.s3.model.DeleteObjectsRequest.KeyVersion;
//import com.documentManagementSystem.server.entity.Document;
//
//import lombok.extern.slf4j.Slf4j;
//
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.beans.factory.annotation.Value;
//import org.springframework.stereotype.Service;
//import org.springframework.web.multipart.MultipartFile;
//
//import java.io.IOException;
//import java.net.URL;
//import java.util.ArrayList;
//import java.util.Date;
//import java.util.List;
//import java.util.UUID;
//import java.util.stream.Collectors;
//
//@Service
//@Slf4j
//public class S3Service  {
//	
//	@Autowired
//	private AmazonS3 client;
//	
//	@Value("${app.s3.bucket}")
//	private String bucketName;
//
//	
//	
//	public String uploadFile(MultipartFile file) throws IOException {
//        String fileName = UUID.randomUUID() + "_" + file.getOriginalFilename();
//        ObjectMetadata metadata = new ObjectMetadata();
//        metadata.setContentLength(file.getSize());
//        metadata.setContentType(file.getContentType());
//
//        client.putObject(bucketName, fileName, file.getInputStream(), metadata);
//        return client.getUrl(bucketName, fileName).toString();
//    }
//	
//	public S3Object downloadFile(String s3Url) {
//        String key = extractKeyFromUrl(s3Url);
//        return client.getObject(bucketName, key);
//    }
//
//    public void deleteFile(String s3Url) {
//        String key = extractKeyFromUrl(s3Url);
//        client.deleteObject(bucketName, key);
//    }
//    
//    public void deleteSelectedFiles(List<Document> documents) throws AmazonS3Exception {
//    	if(!documents.isEmpty()) {
//    		List<KeyVersion> keys = new ArrayList<KeyVersion>();
//    		for(Document document : documents) {
//    			keys.add(new KeyVersion(document.getS3Url()));
//    		}
//    		DeleteObjectsRequest multipDeleteObjectsRequest = new DeleteObjectsRequest(bucketName)
//    				.withKeys(keys)
//    				.withQuiet(false);
//    		DeleteObjectsResult deleteObjectResult = client.deleteObjects(multipDeleteObjectsRequest);
//    		int successfllDeletes = deleteObjectResult.getDeletedObjects().size();
//    		log.info("{} documents delete successfully",successfllDeletes);
//    	}
//    }
//
//
//	
//	
//    public List<String> allFiles() {
//        ListObjectsV2Request request = new ListObjectsV2Request().withBucketName(bucketName);
//        ListObjectsV2Result result = client.listObjectsV2(request);
//        return result.getObjectSummaries()
//                .stream()
//                .map(S3ObjectSummary::getKey)
//                .collect(Collectors.toList());
//    }
//
//    
//    public String preSignedUrl(String s3Url) {
//        String key = extractKeyFromUrl(s3Url);
//        Date expiration = new Date(System.currentTimeMillis() + 1000 * 60 * 60); // 1 hour
//        URL url = client.generatePresignedUrl(bucketName, key, expiration);
//        String preSignedUrl = url.toString();
//        System.out.println("Generated Pre-signed URL: " + preSignedUrl);
//        return preSignedUrl;
//    }
//
//    private String extractKeyFromUrl(String s3Url) {
//        System.out.println("Input S3 URL: " + s3Url);
//        String[] parts = s3Url.split("/");
//        String key = parts[parts.length - 1];
//        System.out.println("Extracted Key: " + key);
//        return key;
//    }
//
//}
