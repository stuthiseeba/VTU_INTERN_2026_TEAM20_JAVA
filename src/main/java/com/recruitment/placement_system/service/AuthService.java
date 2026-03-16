package com.recruitment.placement_system.service;

import com.recruitment.placement_system.dto.ApiResponse;
import com.recruitment.placement_system.dto.LoginRequest;
import com.recruitment.placement_system.dto.ForgotPasswordRequest;
import com.recruitment.placement_system.dto.ResetPasswordRequest;
import com.recruitment.placement_system.dto.SignupRequest;
import com.recruitment.placement_system.entity.User;
import com.recruitment.placement_system.repository.UserRepository;
import com.recruitment.placement_system.security.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;

@Service
public class AuthService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private BCryptPasswordEncoder passwordEncoder;

    @Autowired
    private JwtUtil jwtUtil;

    // ── Signup ────────────────────────────────────────────────────────────────
    public ResponseEntity<?> signup(SignupRequest request) {
        if (userRepository.findByEmail(request.getEmail()).isPresent()) {
            return ResponseEntity.status(409)
                .body(new ApiResponse(false, "Email already registered"));
        }

        User user = new User();
        user.setFullName(request.getFullName());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setPhoneNumber(request.getPhoneNumber());

        // ✅ FIXED: getRole() already returns Role enum — no toUpperCase() needed
        user.setRole(request.getRole());

        user.setIsVerified(false);
        user.setIsActive(true);
        // ✅ FIXED: removed setCreatedAt/setUpdatedAt — Hibernate handles these
        // automatically via @CreationTimestamp and @UpdateTimestamp on User entity

        userRepository.save(user);
        return ResponseEntity.ok(new ApiResponse(true, "User registered successfully"));
    }

    // ── Login ─────────────────────────────────────────────────────────────────
    public ResponseEntity<?> login(LoginRequest request) {
        Optional<User> userOpt = userRepository.findByEmail(request.getEmail());

        if (userOpt.isEmpty() ||
            !passwordEncoder.matches(request.getPassword(), userOpt.get().getPassword())) {
            return ResponseEntity.status(401)
                .body(new ApiResponse(false, "Invalid email or password"));
        }

        User user = userOpt.get();

        // ✅ generateToken(String email, Long userId, String role)
        String token = jwtUtil.generateToken(
            user.getEmail(),
            user.getId(),
            user.getRole().toString()
        );

        // Combined response for Team 1/2 (token) and Team 3 (userId, name)
        Map<String, Object> response = new HashMap<>();
        response.put("token",      token);
        response.put("userId",     user.getId().toString());
        response.put("name",       user.getFullName());
        response.put("fullName",   user.getFullName());
        response.put("email",      user.getEmail());
        response.put("role",       user.getRole().toString());
        response.put("isVerified", user.getIsVerified());
        response.put("isActive",   user.getIsActive());
        response.put("message",    "Login successful");

        return ResponseEntity.ok(response);
    }

    // ── Forgot Password ───────────────────────────────────────────────────────
    public ResponseEntity<?> forgotPassword(ForgotPasswordRequest request) {
        Optional<User> userOpt = userRepository.findByEmail(request.getEmail());
        if (userOpt.isEmpty()) {
            return ResponseEntity.status(404)
                .body(new ApiResponse(false, "Email not found"));
        }

        String token = UUID.randomUUID().toString();
        User user = userOpt.get();
        user.setResetToken(token);
        user.setResetTokenExpiry(LocalDateTime.now().plusMinutes(15));
        userRepository.save(user);

        return ResponseEntity.ok(
            new ApiResponse(true, "Password reset token generated: " + token));
    }

    // ── Reset Password ────────────────────────────────────────────────────────
    public ResponseEntity<?> resetPassword(ResetPasswordRequest request) {
        Optional<User> userOpt = userRepository.findByResetToken(request.getToken());
        if (userOpt.isEmpty()) {
            return ResponseEntity.status(400)
                .body(new ApiResponse(false, "Invalid or expired reset token"));
        }

        User user = userOpt.get();
        if (user.getResetTokenExpiry().isBefore(LocalDateTime.now())) {
            return ResponseEntity.status(400)
                .body(new ApiResponse(false, "Reset token has expired"));
        }

        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        user.setResetToken(null);
        user.setResetTokenExpiry(null);
        userRepository.save(user);

        return ResponseEntity.ok(new ApiResponse(true, "Password reset successfully"));
    }
    public ApiResponse verifyProfile(Long userId) {
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new RuntimeException("User not found with id: " + userId));

        user.setIsVerified(true);
        userRepository.save(user);

        return new ApiResponse(true, "User profile verified successfully");
    }
}