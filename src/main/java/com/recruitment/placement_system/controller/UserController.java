package com.recruitment.placement_system.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import com.recruitment.placement_system.dto.ApiResponse;
import com.recruitment.placement_system.entity.User;
import com.recruitment.placement_system.repository.UserRepository;
import com.recruitment.placement_system.security.JwtUtil;
import com.recruitment.placement_system.service.AuthService;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "*")
public class UserController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private AuthService authService;

    @GetMapping("/profile")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<?> getProfile(@RequestHeader("Authorization") String token) {
        String jwt = token.substring(7);
        String email = jwtUtil.getEmailFromToken(jwt);

        User user = userRepository.findByEmail(email)
            .orElseThrow(() -> new RuntimeException("User not found"));

        user.setPassword(null); // hide password before returning
        return ResponseEntity.ok(user);
    }

    @PostMapping("/verify/{userId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> verifyProfile(@PathVariable Long userId) {
        ApiResponse response = authService.verifyProfile(userId);
        return ResponseEntity.ok(response);
    }
}