package com.documentManagementSystem.server.enums;

public enum OTPValidationResponse {
	VALID_OTP("OTP validated successfully"),
    INVALID_OTP("Invalid OTP"),
    EXPIRED_OTP("OTP has expired");

    private final String message;

    OTPValidationResponse(String message) {
        this.message = message;
    }

    public String getMessage() {
        return message;
    }
}
