package com.documentManagementSystem.server.DTO;

import lombok.Data;

@Data
public class UpdatePassword {
	private String email;
	private String newPassword;
}
