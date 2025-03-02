package com.documentManagementSystem.server.service;

import java.io.IOException;
import java.util.List;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.amazonaws.services.s3.AmazonS3;
import com.amazonaws.services.s3.model.ListObjectsV2Request;
import com.amazonaws.services.s3.model.ListObjectsV2Result;
import com.amazonaws.services.s3.model.ObjectMetadata;
import com.amazonaws.services.s3.model.PutObjectRequest;
import com.amazonaws.services.s3.model.PutObjectResult;
import com.amazonaws.services.s3.model.S3Object;
import com.documentManagementSystem.server.exceptions.ImageUploadException;

@Service
public class S3Service  {
	
	@Autowired
	private AmazonS3 client;
	
	@Value("${app.s3.bucket}")
	private String bucketName;

	
	
	public String uploadFile(MultipartFile file) throws IOException {
        String fileName = UUID.randomUUID() + "_" + file.getOriginalFilename();
        ObjectMetadata metadata = new ObjectMetadata();
        metadata.setContentLength(file.getSize());
        metadata.setContentType(file.getContentType());

        client.putObject(bucketName, fileName, file.getInputStream(), metadata);
        return client.getUrl(bucketName, fileName).toString();
    }
	
	public S3Object downloadFile(String s3Url) {
        String key = extractKeyFromUrl(s3Url);
        return client.getObject(bucketName, key);
    }

    public void deleteFile(String s3Url) {
        String key = extractKeyFromUrl(s3Url);
        client.deleteObject(bucketName, key);
    }

    private String extractKeyFromUrl(String s3Url) {
        // Extract the object key from the S3 URL (e.g., after bucket name)
        return s3Url.substring(s3Url.indexOf(bucketName) + bucketName.length() + 1);
    }
	
	
	/*@Override
    public List<String> allFiles() {
        ListObjectsV2Request request = new ListObjectsV2Request().withBucketName(bucketName);
        ListObjectsV2Result result = AmazonS3.listObjectsV2(request);
        return result.getObjectSummaries()
                .stream()
                .map(S3ObjectSummary::getKey)
                .collect(Collectors.toList());
    }*/

    /*@Override
    public String preSignedUrl(String s3Url) {
        String key = extractKeyFromUrl(s3Url);
        // Set expiration time (e.g., 1 hour from now)
        Date expiration = new Date(System.currentTimeMillis() + 1000 * 60 * 60); 
        URL url = amazonS3.generatePresignedUrl(bucketName, key, expiration);
        return url.toString();
    }*/

}
