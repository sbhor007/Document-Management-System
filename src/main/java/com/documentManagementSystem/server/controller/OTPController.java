package com.documentManagementSystem.server.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.documentManagementSystem.server.enums.OTPValidationResponse;
import com.documentManagementSystem.server.responce.ApiResponce;
import com.documentManagementSystem.server.service.OTPService;


@RestController
@RequestMapping("/api/email")
public class OTPController {
	@Autowired
    private OTPService otpService;

	@PostMapping("/sendOtp")
	public ResponseEntity<ApiResponce<String>> sendOtp(@RequestBody String to) {
	    boolean isOtpSent = otpService.sendOtp(to, "OTP", "Verification OTP: ");

	    if (isOtpSent) {
	        // If OTP is successfully sent, send a success response
	        return ResponseEntity.ok(new ApiResponce<>("success", "OTP sent successfully", null));
	    } else {
	        // If OTP sending failed, send an error response
	        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
	                .body(new ApiResponce<>("error", "Failed to send OTP", null));
	    }
	}



    // Endpoint to validate OTP
    @PostMapping("/validateOtp/{email}/{otp}")
    public ResponseEntity<ApiResponce<String>> validateOtp(@PathVariable String email, @PathVariable String otp) {
        OTPValidationResponse response = otpService.validateOtp(email, otp);
        
        switch (response) {
            case VALID_OTP:
                return ResponseEntity.ok(new ApiResponce<>("success", "OTP validated successfully", null));
            case INVALID_OTP:
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new ApiResponce<>("error", "Invalid OTP", null));
            case EXPIRED_OTP:
                return ResponseEntity.status(HttpStatus.GONE).body(new ApiResponce<>("error", "OTP has expired", null));
            default:
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(new ApiResponce<>("error", "Unexpected error occurred", null));
        }
    }
}
