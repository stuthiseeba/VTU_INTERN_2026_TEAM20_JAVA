package com.recruitment.placement_system.controller;

import com.recruitment.placement_system.entity.DriveStudent;
import com.recruitment.placement_system.entity.PatDrive;
import com.recruitment.placement_system.repository.ApplicationRepository;
import com.recruitment.placement_system.repository.DriveStudentRepository;
import com.recruitment.placement_system.repository.PatDriveRepository;
import com.recruitment.placement_system.service.ApplicationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

// ✅ Team 3 - TPO drive management and student funnel tracking
@RestController
@RequestMapping("/api/tpo")
@CrossOrigin(origins = "*")
public class TpoDriveController {

    @Autowired private PatDriveRepository driveRepository;
    @Autowired private DriveStudentRepository driveStudentRepository;
    @Autowired private ApplicationRepository applicationRepository;
    @Autowired private ApplicationService applicationService;

    // ── Create Drive ──────────────────────────────────────────────────────────
    @PostMapping("/drive")
    public ResponseEntity<?> createDrive(@RequestBody Map<String, String> body) {
        PatDrive drive = new PatDrive();
        drive.setTpoUserId(Long.parseLong(body.get("tpoUserId")));
        drive.setCompany(body.get("company"));
        drive.setRole(body.get("role"));
        drive.setDriveDate(body.get("driveDate"));
        drive.setDriveTime(body.get("driveTime"));
        drive.setVenue(body.get("venue"));
        drive.setEligibility(body.get("eligibility"));
        drive.setRounds(body.get("rounds"));
        drive.setStatus("Upcoming");
        PatDrive saved = driveRepository.save(drive);
        return ResponseEntity.ok(Map.of(
            "message", "Drive created",
            "driveId", saved.getId().toString()
        ));
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
        s.setRoundIndex(Integer.parseInt(body.get("roundIndex")));
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
        Long sourceId = Long.parseLong(body.get("studentId"));
        return driveStudentRepository.findById(sourceId).map(s -> {
            s.setStatus("Selected");
            driveStudentRepository.save(s);

            DriveStudent next = new DriveStudent();
            next.setDriveId(s.getDriveId());
            next.setStudentName(s.getStudentName());
            next.setStudentEmail(s.getStudentEmail());
            next.setRoundIndex(s.getRoundIndex() + 1);
            next.setStatus("Appeared");
            DriveStudent saved = driveStudentRepository.save(next);
            applicationService.syncDriveStudentProgress(
                saved.getDriveId(),
                saved.getStudentEmail(),
                saved.getRoundIndex(),
                saved.getStatus()
            );

            return ResponseEntity.ok(Map.of(
                "message", "Promoted",
                "newStudentId", saved.getId().toString()
            ));
        }).orElse(ResponseEntity.notFound().build());
    }

    // ── Get Students for a Drive ──────────────────────────────────────────────
    @GetMapping("/drive/{driveId}/students")
    public ResponseEntity<?> getStudents(@PathVariable Long driveId) {
        return ResponseEntity.ok(driveStudentRepository.findByDriveId(driveId));
    }
}
