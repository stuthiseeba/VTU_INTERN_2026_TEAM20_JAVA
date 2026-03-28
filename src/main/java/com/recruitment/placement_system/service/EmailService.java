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

    @Value("${spring.mail.username:}")
    private String fromEmail;

    @Value("${spring.mail.password:}")
    private String mailPassword;

    @Value("${app.mail.strict-delivery:false}")
    private boolean strictDelivery;

    public void sendOtpEmail(String toEmail, String otp, String fullName) {
        try {
            ensureMailConfigured();

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
            System.out.println("OTP email sent to: " + toEmail);
        } catch (Exception e) {
            handleDeliveryFailure("OTP email", toEmail, otp, e);
        }
    }

    public void sendWelcomeEmail(String toEmail, String fullName) {
        try {
            ensureMailConfigured();

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
            handleDeliveryFailure("Welcome email", toEmail, null, e);
        }
    }

    public void sendPasswordResetEmail(String toEmail, String fullName, String resetToken) {
        try {
            ensureMailConfigured();

            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom(fromEmail);
            message.setTo(toEmail);
            message.setSubject("PAT - Password Reset Token");
            message.setText(
                "Hello " + fullName + ",\n\n" +
                "We received a request to reset your password.\n\n" +
                "Your password reset token is:\n\n" +
                "     " + resetToken + "\n\n" +
                "This token is valid for 1 hour.\n" +
                "If you did not request a password reset, please ignore this email.\n\n" +
                "Regards,\n" +
                "Team 20 - VTU Internship 2026"
            );
            mailSender.send(message);
            System.out.println("Password reset email sent to: " + toEmail);
        } catch (Exception e) {
            handleDeliveryFailure("Password reset email", toEmail, resetToken, e);
        }
    }
    // ✅ NEW: Method to send Drive Notifications
    public void sendDriveNotificationEmail(String toEmail, String studentName, String company, String role, String date, String deadline) {
        try {
            ensureMailConfigured();

            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom(fromEmail);
            message.setTo(toEmail);
            message.setSubject("🚀 New Placement Drive: " + company);
            message.setText(
                "Hello " + studentName + ",\n\n" +
                "Great news! A new placement drive matching your profile has just been announced.\n\n" +
                "🏢 Company: " + company + "\n" +
                "💼 Role: " + role + "\n" +
                "📅 Drive Date: " + (date != null ? date : "TBA") + "\n" +
                "⏳ Apply Deadline: " + (deadline != null ? deadline : "TBA") + "\n\n" +
                "Log in to the Placement Portal now to view more details and submit your application!\n\n" +
                "Best of luck,\n" +
                "Placement Cell (Team 20)"
            );
            mailSender.send(message);
            System.out.println("Drive alert email sent to: " + toEmail);
        } catch (Exception e) {
            System.err.println("Failed to send drive email to " + toEmail + ": " + e.getMessage());
        }
    }

    private void ensureMailConfigured() {
        if (fromEmail == null || fromEmail.isBlank() || mailPassword == null || mailPassword.isBlank()) {
            throw new IllegalStateException(
                "Google App Password is not configured. Set GOOGLE_APP_EMAIL and GOOGLE_APP_PASSWORD."
            );
        }
    }

    private void handleDeliveryFailure(String emailType, String toEmail, String otp, Exception e) {
        if (strictDelivery) {
            throw new RuntimeException(emailType + " failed: " + e.getMessage(), e);
        }

        System.err.println(emailType + " failed: " + e.getMessage());
        if (otp != null) {
            System.out.println("======================================");
            System.out.println("OTP for " + toEmail + " : " + otp);
            System.out.println("======================================");
        }
    }
}
