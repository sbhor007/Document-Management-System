package com.documentManagementSystem.server.responce;

public class ApiResponse<T> {
	
	private String status;
	private String message;
	private T data;
	public ApiResponse(String status, String message, T data) {
		super();
		this.status = status;
		this.message = message;
		this.data = data;
	}
	public ApiResponse(String status, String message) {
		super();
		this.status = status;
		this.message = message;
	}
	public String getStatus() {
		return status;
	}
	public void setStatus(String status) {
		this.status = status;
	}
	public String getMessage() {
		return message;
	}
	public void setMessage(String message) {
		this.message = message;
	}
	public T getData() {
		return data;
	}
	public void setData(T data) {
		this.data = data;
	}
	
	

}
