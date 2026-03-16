package com.recruitment.placement_system.controller;

import com.recruitment.placement_system.dto.ApiResponse;
import com.recruitment.placement_system.dto.ForgotPasswordRequest;
import com.recruitment.placement_system.dto.LoginRequest;
import com.recruitment.placement_system.dto.ResetPasswordRequest;
import com.recruitment.placement_system.dto.SignupRequest;
import com.recruitment.placement_system.entity.Role;
import com.recruitment.placement_system.repository.UserRepository;
import com.recruitment.placement_system.service.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class AuthController {

    @Autowired
    private AuthService authService;

    @Autowired
    private UserRepository userRepository;

    // ── Team 1: Signup ────────────────────────────────────────────────────────
    @PostMapping("/signup")
    public ResponseEntity<?> signup(@RequestBody SignupRequest request) {
        return authService.signup(request);
    }

    // ✅ Team 3: /register alias — sends { name, email, password, role }
    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody Map<String, String> body) {
        SignupRequest request = new SignupRequest();
        // Team 3 sends "name" — map to fullName
        String name = body.get("name") != null ? body.get("name") : body.getOrDefault("fullName", "");
        request.setFullName(name);
        request.setEmail(body.get("email"));
        request.setPassword(body.get("password"));
        request.setPhoneNumber(body.getOrDefault("phoneNumber", ""));

        // ✅ FIXED: convert String role to Role enum
        String roleStr = body.getOrDefault("role", "STUDENT").toUpperCase();
        try {
            request.setRole(Role.valueOf(roleStr));
        } catch (IllegalArgumentException e) {
            request.setRole(Role.STUDENT);
        }

        return authService.signup(request);
    }

    // ── Team 1: Login ─────────────────────────────────────────────────────────
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {
        return authService.login(request);
    }

    // ── Team 1: Forgot Password ───────────────────────────────────────────────
    @PostMapping("/forgot-password")
    public ResponseEntity<?> forgotPassword(@RequestBody ForgotPasswordRequest request) {
        return authService.forgotPassword(request);
    }

    // ── Team 1: Reset Password ────────────────────────────────────────────────
    @PostMapping("/reset-password")
    public ResponseEntity<?> resetPassword(@RequestBody ResetPasswordRequest request) {
        return authService.resetPassword(request);
    }

    // ✅ Team 3: Get all students
    @GetMapping("/students")
    public ResponseEntity<?> getAllStudents() {
        List<Map<String, String>> students = userRepository.findAll().stream()
            .filter(u -> u.getRole() == Role.STUDENT)
            .map(u -> Map.of(
                "id",    u.getId().toString(),
                "name",  u.getFullName() != null ? u.getFullName() : "",
                "email", u.getEmail()
            ))
            .collect(Collectors.toList());
        return ResponseEntity.ok(students);
    }

    // ✅ Team 3: Delete student
    @DeleteMapping("/students/{id}")
    public ResponseEntity<?> deleteStudent(@PathVariable Long id) {
        userRepository.deleteById(id);
        return ResponseEntity.ok(new ApiResponse(true, "Student deleted"));
    }
}