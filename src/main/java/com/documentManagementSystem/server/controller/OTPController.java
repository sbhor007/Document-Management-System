package com.documentManagementSystem.server.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.documentManagementSystem.server.enums.OTPValidationResponse;
import com.documentManagementSystem.server.responce.ApiResponse;
import com.documentManagementSystem.server.service.AuthService;
import com.documentManagementSystem.server.service.OTPService;
import com.documentManagementSystem.server.service.UserService;

import lombok.extern.java.Log;
import lombok.extern.slf4j.Slf4j;


@RestController
@RequestMapping("/api/email")
@Slf4j
public class OTPController {
	@Autowired
    private OTPService otpService;
	
	@Autowired
	private AuthService userService;

	@PostMapping("/sendOtp/{to}")
	public ResponseEntity<ApiResponse<String>> sendOtp(@PathVariable String to) {
		log.info("Otp Send to {}",to);
	    boolean isOtpSent = otpService.sendOtp(to, "OTP", "Verification OTP: ");

	    if (isOtpSent) {
	        // If OTP is successfully sent, send a success response
	        return ResponseEntity.ok(new ApiResponse<>("success", "OTP sent successfully", null));
	    } else {
	        // If OTP sending failed, send an error response
	        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
	                .body(new ApiResponse<>("error", "Failed to send OTP", null));
	    }
	}
	
//	 / New endpoint to check if email exists
    @GetMapping("/email-exists/{email}")
    public ResponseEntity<ApiResponse<Boolean>> checkEmailExists(@PathVariable String email) {
        log.info("Checking if email exists: {}", email);
        try {
            boolean exists = userService.emailExists(email);
            return ResponseEntity.ok(new ApiResponse<>("success", "Email check completed", exists));
        } catch (RuntimeException e) {
            log.error("Error checking email: {}, error: {}", email, e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ApiResponse<>("error", "Internal Server Error", null));
        }
    }

    // Endpoint to validate OTP
    @PostMapping("/validateOtp/{email}/{otp}")
    public ResponseEntity<ApiResponse<String>> validateOtp(@PathVariable String email, @PathVariable String otp) {
    	log.info("user otp is : {} and email {}",otp,email);
        OTPValidationResponse response = otpService.validateOtp(email, otp);
        
        switch (response) {
            case VALID_OTP:
                return ResponseEntity.ok(new ApiResponse<>("success", "OTP validated successfully", null));
            case INVALID_OTP:
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new ApiResponse<>("error", "Invalid OTP", null));
            case EXPIRED_OTP:
                return ResponseEntity.status(HttpStatus.GONE).body(new ApiResponse<>("error", "OTP has expired", null));
            default:
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(new ApiResponse<>("error", "Unexpected error occurred", null));
        }
    }
}
