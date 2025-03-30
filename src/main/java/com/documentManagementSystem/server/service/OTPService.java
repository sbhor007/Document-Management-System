package com.documentManagementSystem.server.service;

import java.security.SecureRandom;
import java.util.HashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import com.documentManagementSystem.server.enums.OTPValidationResponse;

import lombok.extern.slf4j.Slf4j;

@Service
@Slf4j
public class OTPService {
	
	@Autowired
    private EmailService emailService;

    private final SecureRandom secureRandom = new SecureRandom();

    // Reuse BCryptPasswordEncoder across the class
    private final BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();

    // Maps to store OTP and timestamps
    private final Map<String, String> otpCache = new HashMap<>();
    private final Map<String, Long> timestampCache = new HashMap<>();

    private static final long OTP_EXPIRY_TIME = 60 * 5000; // 1 minute in milliseconds

    // Send OTP email
    public boolean sendOtp(String to, String subject, String message) {
        try {
            String otp = generateOtp(); // Generate OTP
            emailService.sendEmail(to, subject, message + " : " + otp); // Send email
            storeOtp(to, encodeOtp(otp)); // Store OTP in cache
            return true; // Success
        } catch (Exception e) {
            System.err.println("Error sending OTP to " + to + ": " + e.getMessage());
            return false; // Failure
        }
    }


    // Generate a 6-digit OTP
    public String generateOtp() {
        try {
            int otp = 100000 + secureRandom.nextInt(900000);
            return String.valueOf(otp);
        } catch (Exception e) {
            // Handle exception (if any) during OTP generation
            System.err.println("Error generating OTP: " + e.getMessage());
            throw new RuntimeException("Error generating OTP", e);
        }
    }

    // Encode OTP using BCrypt
    public String encodeOtp(String otp) {
        try {
            return encoder.encode(otp);
        } catch (Exception e) {
            // Handle exception (if any) during OTP encoding
            System.err.println("Error encoding OTP: " + e.getMessage());
            throw new RuntimeException("Error encoding OTP", e);
        }
    }

    // Store OTP and its timestamp in cache
    public void storeOtp(String email, String otp) {
        try {
            long timestamp = System.currentTimeMillis();
            otpCache.put(email, otp);
            timestampCache.put(email, timestamp);
        } catch (Exception e) {
            // Handle exception (if any) during OTP storage
            System.err.println("Error storing OTP for " + email + ": " + e.getMessage());
            throw new RuntimeException("Error storing OTP", e);
        }
    }

    // Validate the OTP
    public OTPValidationResponse validateOtp(String email, String otp) {
        try {
            String cachedOtp = otpCache.get(email);
            Long timestamp = timestampCache.get(email);

            if (cachedOtp == null || timestamp == null) {
                return OTPValidationResponse.INVALID_OTP; // OTP not found
            }

            long currentTime = System.currentTimeMillis();

            // Check if OTP has expired
            if (currentTime - timestamp > OTP_EXPIRY_TIME) {
                otpCache.remove(email);
                timestampCache.remove(email);
                return OTPValidationResponse.EXPIRED_OTP; // OTP expired
            }
            log.info("otpcaches {} otp {}",cachedOtp,otp);
            // Validate the OTP using BCrypt
            boolean isMatch = encoder.matches(otp, cachedOtp);
            log.info("is matched : {}",isMatch);
            return isMatch ? OTPValidationResponse.VALID_OTP : OTPValidationResponse.INVALID_OTP;
        } catch (Exception e) {
            // Handle exception during OTP validation
            System.err.println("Error validating OTP for " + email + ": " + e.getMessage());
            throw new RuntimeException("Error validating OTP", e);
        }
    }

    // Scheduled method to clear the cache every 10 minutes
    @Scheduled(fixedRate = 10 * 60 * 1000) // 10 minutes in milliseconds
    public void clearCache() {
        try {
            otpCache.clear();
            timestampCache.clear();
        } catch (Exception e) {
            // Handle exception during cache clearing
            System.err.println("Error clearing cache: " + e.getMessage());
            throw new RuntimeException("Error clearing cache", e);
        }
    }

}
