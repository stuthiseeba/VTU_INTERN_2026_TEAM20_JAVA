package com.recruitment.placement_system.controller;

import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.recruitment.placement_system.entity.DriveStudent;
import com.recruitment.placement_system.entity.PatDrive;
import com.recruitment.placement_system.entity.StudentProfile;
import com.recruitment.placement_system.entity.User;
import com.recruitment.placement_system.repository.ApplicationRepository;
import com.recruitment.placement_system.repository.DriveStudentRepository;
import com.recruitment.placement_system.repository.PatDriveRepository;
import com.recruitment.placement_system.repository.StudentProfileRepository;
import com.recruitment.placement_system.repository.UserRepository;
import com.recruitment.placement_system.service.ApplicationService;
import com.recruitment.placement_system.service.EmailService;

// ✅ Team 3 - TPO drive management and student funnel tracking
@RestController
@RequestMapping("/api/tpo")
@CrossOrigin(origins = "*")
public class TpoDriveController {

    @Autowired private PatDriveRepository driveRepository;
    @Autowired private DriveStudentRepository driveStudentRepository;
    @Autowired private ApplicationRepository applicationRepository;
    @Autowired private ApplicationService applicationService;
    
    // Dependencies for Email Automation
    @Autowired private EmailService emailService;
    @Autowired private StudentProfileRepository studentProfileRepository;
    @Autowired private UserRepository userRepository;

    // ── Create Drive & Send Emails ────────────────────────────────────────────
    @PostMapping("/drive")
    public ResponseEntity<?> createDrive(@RequestBody PatDrive drive) {
        
        if (drive.getStatus() == null || drive.getStatus().isEmpty()) {
            drive.setStatus("Open");
        }

        PatDrive saved = driveRepository.save(drive);

        // ✅ If TPO checked "Send Email Alert", trigger email automation
        if (Boolean.TRUE.equals(drive.getSendEmailAlert())) {
            
            // Run email sending in a background thread so the UI doesn't freeze
            new Thread(() -> {
                List<StudentProfile> allStudents = studentProfileRepository.findAll();
                
                for (StudentProfile profile : allStudents) {
                    if (isEligible(profile, saved)) {
                        Optional<User> userOpt = userRepository.findById(profile.getUserId());
                        if (userOpt.isPresent()) {
                            User u = userOpt.get();
                            emailService.sendDriveNotificationEmail(
                                u.getEmail(), 
                                u.getFullName(), 
                                saved.getCompany(), 
                                saved.getRole(), 
                                saved.getDriveDate(), 
                                saved.getRegistrationDeadline()
                            );
                        }
                    }
                }
            }).start();
        }

        return ResponseEntity.ok(Map.of(
            "message", "Drive created successfully",
            "driveId", saved.getId().toString()
        ));
    }

    // ── Helper to check if a student is eligible for the email alert ─────────
    private boolean isEligible(StudentProfile profile, PatDrive drive) {
        // 1. Check Branches
        if (drive.getEligibleBranches() != null && !drive.getEligibleBranches().trim().isEmpty()) {
            if (profile.getDepartment() == null || profile.getDepartment().trim().isEmpty()) {
                return false; // Student hasn't set department yet
            }
            if (!drive.getEligibleBranches().contains(profile.getDepartment())) {
                return false; // Student department not in allowed list
            }
        }

        // 2. Check Min CGPA
        if (drive.getMinCgpa() != null && drive.getMinCgpa() > 0) {
            if (profile.getCgpa() == null || profile.getCgpa().trim().isEmpty()) {
                return false; // Student hasn't set CGPA yet
            }
            try {
                double studentCgpa = Double.parseDouble(profile.getCgpa());
                if (studentCgpa < drive.getMinCgpa()) {
                    return false; // Student CGPA is too low
                }
            } catch (NumberFormatException e) {
                return false;
            }
        }

        return true; // Student passed all checks
    }

    // ── Get Drives for a TPO ──────────────────────────────────────────────────
    @GetMapping("/drives/{tpoUserId}")
    public ResponseEntity<?> getDrives(@PathVariable Long tpoUserId) {
        return ResponseEntity.ok(driveRepository.findByTpoUserId(tpoUserId));
    }

    // ── Delete Drive ──────────────────────────────────────────────────────────
    @DeleteMapping("/drive/{driveId}")
    public ResponseEntity<?> deleteDrive(@PathVariable Long driveId) {
        List<DriveStudent> driveStudents = driveStudentRepository.findByDriveId(driveId);
        if (!driveStudents.isEmpty()) {
            driveStudentRepository.deleteAll(driveStudents);
        }
        applicationRepository.deleteAll(applicationRepository.findByDriveId(driveId));
        driveRepository.deleteById(driveId);
        return ResponseEntity.ok(Map.of("message", "Drive deleted"));
    }

    // ── Add Student to Drive Round ────────────────────────────────────────────
    @PostMapping("/drive/student")
    public ResponseEntity<?> addStudent(@RequestBody Map<String, String> body) {
        DriveStudent s = new DriveStudent();

s.setDriveId(Long.parseLong(body.get("driveId")));
s.setStudentName(body.get("studentName"));
s.setStudentEmail(body.get("studentEmail"));



// ✅ Validate against max rounds
PatDrive drive = driveRepository.findById(s.getDriveId()).orElse(null);

int maxRounds = (drive != null && drive.getRounds() != null && !drive.getRounds().isEmpty())
        ? drive.getRounds().split(",").length
        : 0;



s.setRoundIndex(0);
s.setStatus("Appeared");

DriveStudent saved = driveStudentRepository.save(s);
        return ResponseEntity.ok(Map.of(
            "message", "Student added",
            "studentId", saved.getId().toString()
        ));
    }

    // ── Update Student Status ─────────────────────────────────────────────────
    @PutMapping("/drive/student/{studentId}/status")
    public ResponseEntity<?> updateStatus(
            @PathVariable Long studentId,
            @RequestBody Map<String, String> body) {
        return driveStudentRepository.findById(studentId).map(s -> {
            s.setStatus(body.get("status"));
            driveStudentRepository.save(s);
            applicationService.syncDriveStudentProgress(
                s.getDriveId(),
                s.getStudentEmail(),
                s.getRoundIndex(),
                s.getStatus()
            );
            return ResponseEntity.ok(Map.of("message", "Status updated"));
        }).orElse(ResponseEntity.notFound().build());
    }

    // ── Promote Student to Next Round ─────────────────────────────────────────
@PostMapping("/drive/student/promote")
public ResponseEntity<?> promoteStudent(@RequestBody Map<String, String> body) {

    Long studentId = Long.parseLong(body.get("studentId"));

    return driveStudentRepository.findById(studentId).map(s -> {

        int currentRound = s.getRoundIndex();

        PatDrive drive = driveRepository.findById(s.getDriveId())
                .orElse(null);

        if (drive == null) {
            return ResponseEntity.badRequest()
                    .body(Map.of("message", "Drive not found"));
        }

        List<String> rounds = List.of(drive.getRounds().split(","));
        int maxRounds = rounds.size();

        // ✅ FINAL ROUND
        if (currentRound == maxRounds - 1) {

            s.setStatus("Selected");
            driveStudentRepository.save(s);

            applicationService.syncDriveStudentProgress(
                    s.getDriveId(),
                    s.getStudentEmail(),
                    currentRound,
                    "Selected"
            );

            return ResponseEntity.ok(Map.of(
                    "message", "Final round completed",
                    "status", "Selected"
            ));
        }

        // ✅ MOVE TO NEXT ROUND (NO NEW ROW)
        s.setRoundIndex(currentRound + 1);
        s.setStatus("Appeared");

        driveStudentRepository.save(s);

        applicationService.syncDriveStudentProgress(
                s.getDriveId(),
                s.getStudentEmail(),
                s.getRoundIndex(),
                "Advance"
        );

        return ResponseEntity.ok(Map.of(
                "message", "Promoted"
        ));

    }).orElse(ResponseEntity.notFound().build());
}

    // ── Get Students for a Drive ──────────────────────────────────────────────
    @GetMapping("/drive/{driveId}/students")
    public ResponseEntity<?> getStudents(@PathVariable Long driveId) {
        return ResponseEntity.ok(driveStudentRepository.findByDriveId(driveId));
    }
}