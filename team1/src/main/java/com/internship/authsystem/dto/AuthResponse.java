package com.internship.authsystem.dto;

import com.internship.authsystem.entity.Role;
import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class AuthResponse {
    private String token;
    private String type = "Bearer";
    private Long id;
    private String email;
    private String fullName;
    private Role role;
    private Boolean isVerified;
    
    public AuthResponse(String token, Long id, String email, String fullName, Role role, Boolean isVerified) {
        this.token = token;
        this.id = id;
        this.email = email;
        this.fullName = fullName;
        this.role = role;
        this.isVerified = isVerified;
    }
}
