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
import com.recruitment.placement_system.entity.Role;
import com.recruitment.placement_system.entity.User;
import com.recruitment.placement_system.repository.StudentProfileRepository;
import com.recruitment.placement_system.repository.UserRepository;
import com.recruitment.placement_system.service.ApplicationService;
import com.recruitment.placement_system.service.AuthService;

import jakarta.validation.Valid;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class AuthController {

    @Autowired
    private AuthService authService;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private StudentProfileRepository studentProfileRepository;

    @Autowired
    private ApplicationService applicationService;

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

    @GetMapping("/students")
    public ResponseEntity<?> getStudents() {
        List<Map<String, Object>> students = userRepository.findAll().stream()
            .filter(user -> user.getRole() == Role.STUDENT)
            .map(this::toStudentSummary)
            .collect(Collectors.toList());

        return ResponseEntity.ok(students);
    }

    @DeleteMapping("/students/{id}")
    public ResponseEntity<?> deleteStudent(@PathVariable Long id) {
        User user = userRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Student not found"));

        if (user.getRole() != Role.STUDENT) {
            throw new RuntimeException("Only student accounts can be deleted from this endpoint");
        }

        studentProfileRepository.findByUserId(id)
            .ifPresent(studentProfileRepository::delete);

        applicationService.deleteApplicationsByStudent(Math.toIntExact(id), user.getEmail());
        userRepository.delete(user);

        return ResponseEntity.ok(new ApiResponse(true, "Student deleted successfully"));
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

    private Map<String, Object> toStudentSummary(User user) {
        Map<String, Object> student = new LinkedHashMap<>();
        student.put("id", user.getId());
        student.put("name", user.getFullName());
        student.put("email", user.getEmail());
        student.put("isVerified", user.getIsVerified());
        student.put("isActive", user.getIsActive());
        return student;
    }
}
