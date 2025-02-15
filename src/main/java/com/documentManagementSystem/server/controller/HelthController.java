package com.documentManagementSystem.server.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class HelthController {
	@GetMapping("/helth")
	public String helth() {
		return "Helth Checked";
	}
}
