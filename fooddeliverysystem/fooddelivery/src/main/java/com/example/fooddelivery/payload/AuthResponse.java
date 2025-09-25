package com.example.fooddelivery.payload;

public class AuthResponse {
    private String token;
    private String phone;
    private String message;
    private boolean newUser;

    // Constructors
    public AuthResponse() {}
    public AuthResponse(String token, String phone, String message, boolean newUser) {
        this.token = token;
        this.phone = phone;
        this.message = message;
        this.newUser = newUser;
    }

    // Getters and Setters
    public String getToken() { return token; }
    public void setToken(String token) { this.token = token; }
    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }
    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }
    public boolean isNewUser() { return newUser; }
    public void setNewUser(boolean newUser) { this.newUser = newUser; }
}