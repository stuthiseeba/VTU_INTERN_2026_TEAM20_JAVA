package com.recruitment.placement_system.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    @Autowired
    private JavaMailSender mailSender;

    @Value("${spring.mail.username}")
    private String fromEmail;

    // ── Send OTP Email ────────────────────────────────────────────────────────
    public void sendOtpEmail(String toEmail, String otp, String fullName) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom(fromEmail);
            message.setTo(toEmail);
            message.setSubject("PAT - Email Verification OTP");
            message.setText(
                "Hello " + fullName + ",\n\n" +
                "Your OTP for email verification is:\n\n" +
                "     " + otp + "\n\n" +
                "This OTP is valid for 5 minutes.\n" +
                "Do not share this OTP with anyone.\n\n" +
                "If you did not register on Placement Automation Tool, " +
                "please ignore this email.\n\n" +
                "Regards,\n" +
                "Team 20 - VTU Internship 2026"
            );
            mailSender.send(message);
            System.out.println("✅ OTP email sent to: " + toEmail);
        } catch (Exception e) {
            // Fallback: print OTP to console if email fails
            System.err.println("❌ Email sending failed: " + e.getMessage());
            System.out.println("======================================");
            System.out.println("📧 OTP for " + toEmail + " : " + otp);
            System.out.println("======================================");
        }
    }

    // ── Send Welcome Email after verification ─────────────────────────────────
    public void sendWelcomeEmail(String toEmail, String fullName) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom(fromEmail);
            message.setTo(toEmail);
            message.setSubject("Welcome to PAT - Account Verified!");
            message.setText(
                "Hello " + fullName + ",\n\n" +
                "Your account has been successfully verified!\n\n" +
                "You can now login to the Placement Automation Tool.\n\n" +
                "Regards,\n" +
                "Team 20 - VTU Internship 2026"
            );
            mailSender.send(message);
        } catch (Exception e) {
            System.err.println("Welcome email failed: " + e.getMessage());
        }
    }
}