package com.recruitment.placement_system.service;

import java.time.LocalDateTime;
import java.util.Random;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.recruitment.placement_system.dto.ApiResponse;
import com.recruitment.placement_system.dto.AuthResponse;
import com.recruitment.placement_system.dto.ForgotPasswordRequest;
import com.recruitment.placement_system.dto.LoginRequest;
import com.recruitment.placement_system.dto.ResetPasswordRequest;
import com.recruitment.placement_system.dto.SignupRequest;
import com.recruitment.placement_system.entity.User;
import com.recruitment.placement_system.repository.UserRepository;
import com.recruitment.placement_system.security.JwtUtil;

@Service
public class AuthService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private EmailService emailService;

    // ✅ 5-digit OTP
    private String generateOtp() {
        return String.format("%05d", new Random().nextInt(100000));
    }

    // ── Signup ───────────────────────────────────────────────────────────────
    public ApiResponse signup(SignupRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            User existing = userRepository.findByEmail(request.getEmail()).get();

            if (existing.getIsVerified()) {
                throw new RuntimeException("Email already registered. Please login.");
            }

            String otp = generateOtp();

            existing.setPassword(passwordEncoder.encode(request.getPassword()));
            existing.setFullName(request.getFullName());
            existing.setPhoneNumber(request.getPhoneNumber());
            existing.setRole(request.getRole());
            existing.setIsActive(false);
            existing.setOtp(otp);
            existing.setOtpExpiry(LocalDateTime.now().plusMinutes(5));

            userRepository.save(existing);

            emailService.sendOtpEmail(request.getEmail(), otp, existing.getFullName());

            return new ApiResponse(true,
                "OTP sent to " + request.getEmail() + ". Please verify your email.");
        }

        String otp = generateOtp();

        User user = new User();
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setFullName(request.getFullName());
        user.setPhoneNumber(request.getPhoneNumber());
        user.setRole(request.getRole());
        user.setIsVerified(false);
        user.setIsActive(false);
        user.setOtp(otp);
        user.setOtpExpiry(LocalDateTime.now().plusMinutes(5));

        userRepository.save(user);

        emailService.sendOtpEmail(request.getEmail(), otp, request.getFullName());

        return new ApiResponse(true,
            "Registration successful! OTP sent to " + request.getEmail());
    }

    // ── Verify OTP ───────────────────────────────────────────────────────────
    public ApiResponse verifyOtp(String email, String otp) {
        User user = userRepository.findByEmail(email)
            .orElseThrow(() -> new RuntimeException("User not found"));

        if (user.getIsVerified()) {
            return new ApiResponse(true, "Account already verified");
        }

        if (user.getOtp() == null || !user.getOtp().equals(otp)) {
            throw new RuntimeException("Invalid OTP");
        }

        if (user.getOtpExpiry() == null || user.getOtpExpiry().isBefore(LocalDateTime.now())) {
            throw new RuntimeException("OTP expired");
        }

        user.setIsVerified(true);
        user.setIsActive(true);
        user.setOtp(null);
        user.setOtpExpiry(null);

        userRepository.save(user);

        emailService.sendWelcomeEmail(email, user.getFullName());

        return new ApiResponse(true, "Email verified successfully");
    }

    // ── Login ────────────────────────────────────────────────────────────────
    public AuthResponse login(LoginRequest request) {
        User user = userRepository.findByEmail(request.getEmail())
            .orElseThrow(() -> new RuntimeException("Invalid credentials"));

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new RuntimeException("Invalid credentials");
        }

        if (!user.getIsVerified()) {
            throw new RuntimeException("Account not verified");
        }

        if (!user.getIsActive()) {
            throw new RuntimeException("Account inactive");
        }

        String token = jwtUtil.generateToken(
            user.getEmail(),
            user.getId(),
            user.getRole().name()
        );

        return new AuthResponse(
            token,
            user.getId(),
            user.getEmail(),
            user.getFullName(),
            user.getRole(),
            user.getIsVerified()
        );
    }

    // ── Forgot Password (OTP) ────────────────────────────────────────────────
    public ApiResponse forgotPassword(ForgotPasswordRequest request) {
        User user = userRepository.findByEmail(request.getEmail())
            .orElseThrow(() -> new RuntimeException("User not found"));

        String otp = generateOtp();

        user.setOtp(otp);
        user.setOtpExpiry(LocalDateTime.now().plusMinutes(5));

        userRepository.save(user);

        emailService.sendOtpEmail(
            user.getEmail(),
            otp,
            user.getFullName()
        );

        return new ApiResponse(true, "OTP sent to your email");
    }

    // ── Reset Password using OTP ─────────────────────────────────────────────
    public ApiResponse resetPassword(ResetPasswordRequest request) {
        User user = userRepository.findByEmail(request.getEmail())
            .orElseThrow(() -> new RuntimeException("User not found"));

        if (user.getOtp() == null || !user.getOtp().equals(request.getOtp())) {
            throw new RuntimeException("Invalid OTP");
        }

        if (user.getOtpExpiry() == null || user.getOtpExpiry().isBefore(LocalDateTime.now())) {
            throw new RuntimeException("OTP expired");
        }

        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        user.setOtp(null);
        user.setOtpExpiry(null);

        userRepository.save(user);

        return new ApiResponse(true, "Password reset successful");
    }

    public ApiResponse resendOtp(String email) {
        User user = userRepository.findByEmail(email)
            .orElseThrow(() -> new RuntimeException("User not found"));

        if (user.getIsVerified()) {
            return new ApiResponse(true, "Account already verified. Please login.");
        }

        String otp = generateOtp();

        user.setOtp(otp);
        user.setOtpExpiry(LocalDateTime.now().plusMinutes(5));
        userRepository.save(user);

        emailService.sendOtpEmail(email, otp, user.getFullName());

        return new ApiResponse(true, "New OTP sent to " + email);
    }

    public ApiResponse verifyProfile(Long userId) {
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new RuntimeException("User not found"));

        user.setIsVerified(true);
        userRepository.save(user);

        return new ApiResponse(true, "Profile verified successfully");
    }
}