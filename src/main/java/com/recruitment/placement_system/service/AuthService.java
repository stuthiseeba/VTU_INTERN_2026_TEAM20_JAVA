package com.recruitment.placement_system.service;

import java.time.LocalDateTime;
import java.util.Random;
import java.util.UUID;

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

    // ── Generate 6-digit OTP ──────────────────────────────────────────────────
    private String generateOtp() {
        return String.format("%06d", new Random().nextInt(999999));
    }

    // ── Signup — saves user as inactive and sends OTP ─────────────────────────
    public ApiResponse signup(SignupRequest request) {
    	if (userRepository.existsByEmail(request.getEmail())) {
    	    User existing = userRepository.findByEmail(request.getEmail()).get();
    	    if (existing.getIsVerified()) {
    	        throw new RuntimeException("Email already registered. Please login.");
    	    }
    	    // Unverified — just resend OTP and update details
    	    String otp = generateOtp();
    	    existing.setOtp(otp);
    	    existing.setOtpExpiry(LocalDateTime.now().plusMinutes(5));
    	    userRepository.save(existing);
    	    emailService.sendOtpEmail(request.getEmail(), otp, existing.getFullName());
    	    return new ApiResponse(true, "OTP:" + otp);
    	}

        String otp = generateOtp();

        User user = new User();
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setFullName(request.getFullName());
        user.setPhoneNumber(request.getPhoneNumber());
        user.setRole(request.getRole());
        user.setIsVerified(false);  // ← not verified until OTP confirmed
        user.setIsActive(false);    // ← not active until OTP confirmed
        user.setOtp(otp);
        user.setOtpExpiry(LocalDateTime.now().plusMinutes(5));

        userRepository.save(user);

        // Send OTP email (prints to console if email fails)
        emailService.sendOtpEmail(request.getEmail(), otp, request.getFullName());

        return new ApiResponse(true,
            "Registration successful! OTP sent to " + request.getEmail() +
            ". Please verify your email to activate your account.");
    }

    // ── Verify OTP — activates account ───────────────────────────────────────
    public ApiResponse verifyOtp(String email, String otp) {
        User user = userRepository.findByEmail(email)
            .orElseThrow(() -> new RuntimeException("User not found"));

        if (user.getIsVerified()) {
            return new ApiResponse(true, "Account already verified. Please login.");
        }

        if (user.getOtp() == null || !user.getOtp().equals(otp)) {
            throw new RuntimeException("Invalid OTP");
        }

        if (user.getOtpExpiry() == null || user.getOtpExpiry().isBefore(LocalDateTime.now())) {
            throw new RuntimeException("OTP has expired. Please request a new one.");
        }

        // Activate account
        user.setIsVerified(true);
        user.setIsActive(true);
        user.setOtp(null);
        user.setOtpExpiry(null);
        userRepository.save(user);

        // Send welcome email
        emailService.sendWelcomeEmail(email, user.getFullName());

        return new ApiResponse(true, "Email verified successfully! You can now login.");
    }

    // ── Resend OTP ────────────────────────────────────────────────────────────
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

    // ── Login — only allows verified and active accounts ──────────────────────
    public AuthResponse login(LoginRequest request) {
        User user = userRepository.findByEmail(request.getEmail())
            .orElseThrow(() -> new RuntimeException("Invalid email or password"));

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new RuntimeException("Invalid email or password");
        }

        // ✅ Block login if not verified
        if (!user.getIsVerified()) {
            throw new RuntimeException(
                "Account not verified. Please check your email for the OTP.");
        }

        if (!user.getIsActive()) {
            throw new RuntimeException("Account is deactivated");
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

    // ── Forgot Password ───────────────────────────────────────────────────────
    public ApiResponse forgotPassword(ForgotPasswordRequest request) {
        User user = userRepository.findByEmail(request.getEmail())
            .orElseThrow(() -> new RuntimeException("User not found with this email"));

        String resetToken = UUID.randomUUID().toString();
        user.setResetToken(resetToken);
        user.setResetTokenExpiry(LocalDateTime.now().plusHours(1));
        userRepository.save(user);

        return new ApiResponse(true, "Password reset token generated: " + resetToken);
    }

    // ── Reset Password ────────────────────────────────────────────────────────
    public ApiResponse resetPassword(ResetPasswordRequest request) {
        User user = userRepository.findByResetToken(request.getToken())
            .orElseThrow(() -> new RuntimeException("Invalid reset token"));

        if (user.getResetTokenExpiry().isBefore(LocalDateTime.now())) {
            throw new RuntimeException("Reset token has expired");
        }

        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        user.setResetToken(null);
        user.setResetTokenExpiry(null);
        userRepository.save(user);

        return new ApiResponse(true, "Password reset successfully");
    }

    // ── Verify Profile (Admin) ────────────────────────────────────────────────
    public ApiResponse verifyProfile(Long userId) {
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new RuntimeException("User not found"));

        user.setIsVerified(true);
        userRepository.save(user);

        return new ApiResponse(true, "Profile verified successfully");
    }
}