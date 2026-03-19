package com.recruitment.placement_system.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.recruitment.placement_system.dto.ApiResponse;
import com.recruitment.placement_system.dto.AuthResponse;
import com.recruitment.placement_system.dto.ForgotPasswordRequest;
import com.recruitment.placement_system.dto.LoginRequest;
import com.recruitment.placement_system.dto.ResetPasswordRequest;
import com.recruitment.placement_system.dto.SignupRequest;
import com.recruitment.placement_system.service.AuthService;

import jakarta.validation.Valid;

import java.util.Map;

import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class AuthController {

    @Autowired
    private AuthService authService;

    // ── Signup → sends OTP to email ───────────────────────────────────────────
    @PostMapping("/signup")
    public ResponseEntity<?> signup(@Valid @RequestBody SignupRequest request) {
        try {
            ApiResponse response = authService.signup(request);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(new ApiResponse(false, e.getMessage()));
        }
    }

    // ✅ NEW: Verify OTP — activates account
    // POST /api/auth/verify-otp
    // Body: { "email": "user@example.com", "otp": "123456" }
    @PostMapping("/verify-otp")
    public ResponseEntity<?> verifyOtp(@RequestBody Map<String, String> body) {
        try {
            String email = body.get("email");
            String otp   = body.get("otp");
            if (email == null || otp == null) {
                return ResponseEntity.badRequest()
                    .body(new ApiResponse(false, "Email and OTP are required"));
            }
            ApiResponse response = authService.verifyOtp(email, otp);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(new ApiResponse(false, e.getMessage()));
        }
    }

    // ✅ NEW: Resend OTP
    // POST /api/auth/resend-otp
    // Body: { "email": "user@example.com" }
    @PostMapping("/resend-otp")
    public ResponseEntity<?> resendOtp(@RequestBody Map<String, String> body) {
        try {
            String email = body.get("email");
            if (email == null) {
                return ResponseEntity.badRequest()
                    .body(new ApiResponse(false, "Email is required"));
            }
            ApiResponse response = authService.resendOtp(email);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(new ApiResponse(false, e.getMessage()));
        }
    }

    // ── Login ─────────────────────────────────────────────────────────────────
    @PostMapping("/login")
    public ResponseEntity<?> login(@Valid @RequestBody LoginRequest request) {
        try {
            AuthResponse response = authService.login(request);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body(new ApiResponse(false, e.getMessage()));
        }
    }

    // ── Forgot Password ───────────────────────────────────────────────────────
    @PostMapping("/forgot-password")
    public ResponseEntity<?> forgotPassword(@Valid @RequestBody ForgotPasswordRequest request) {
        try {
            ApiResponse response = authService.forgotPassword(request);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(new ApiResponse(false, e.getMessage()));
        }
    }

    // ── Reset Password ────────────────────────────────────────────────────────
    @PostMapping("/reset-password")
    public ResponseEntity<?> resetPassword(@Valid @RequestBody ResetPasswordRequest request) {
        try {
            ApiResponse response = authService.resetPassword(request);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(new ApiResponse(false, e.getMessage()));
        }
    }

    // ── Handle validation errors (e.g., password too short) ───────────────────
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<?> handleValidationExceptions(MethodArgumentNotValidException ex) {
        StringBuilder errors = new StringBuilder();
        for (FieldError error : ex.getBindingResult().getFieldErrors()) {
            errors.append(error.getDefaultMessage()).append(". ");
        }
        return ResponseEntity.badRequest()
            .body(new ApiResponse(false, errors.toString().trim()));
    }
}