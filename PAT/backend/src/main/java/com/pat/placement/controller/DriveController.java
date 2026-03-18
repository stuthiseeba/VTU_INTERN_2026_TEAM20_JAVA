package com.pat.placement.controller;

import com.pat.placement.model.Drive;
import com.pat.placement.model.DriveStudent;
import com.pat.placement.repository.DriveRepository;
import com.pat.placement.repository.DriveStudentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/tpo")
@CrossOrigin(origins = "*")
public class DriveController {

    @Autowired private DriveRepository driveRepository;
    @Autowired private DriveStudentRepository driveStudentRepository;

    @PostMapping("/drive")
    public ResponseEntity<?> createDrive(@RequestBody Map<String, String> body) {
        Drive drive = new Drive();
        drive.setTpoUserId(Long.parseLong(body.get("tpoUserId")));
        drive.setCompany(body.get("company"));
        drive.setRole(body.get("role"));
        drive.setDriveDate(body.get("driveDate"));
        drive.setDriveTime(body.get("driveTime"));
        drive.setVenue(body.get("venue"));
        drive.setEligibility(body.get("eligibility"));
        drive.setRounds(body.get("rounds"));
        drive.setStatus("Upcoming");
        Drive saved = driveRepository.save(drive);
        return ResponseEntity.ok(Map.of("message", "Drive created", "driveId", saved.getId().toString()));
    }

    @GetMapping("/drives/{tpoUserId}")
    public ResponseEntity<?> getDrives(@PathVariable Long tpoUserId) {
        return ResponseEntity.ok(driveRepository.findByTpoUserId(tpoUserId));
    }

    @GetMapping("/drives")
    public ResponseEntity<?> getAllDrives() {
        return ResponseEntity.ok(driveRepository.findAll());
    }

    @DeleteMapping("/drive/{driveId}")
    public ResponseEntity<?> deleteDrive(@PathVariable Long driveId) {
        driveRepository.deleteById(driveId);
        driveStudentRepository.findByDriveId(driveId).forEach(s -> driveStudentRepository.delete(s));
        return ResponseEntity.ok(Map.of("message", "Drive deleted"));
    }

    @PostMapping("/drive/student")
    public ResponseEntity<?> addStudent(@RequestBody Map<String, String> body) {
        DriveStudent s = new DriveStudent();
        s.setDriveId(Long.parseLong(body.get("driveId")));
        s.setStudentName(body.get("studentName"));
        s.setStudentEmail(body.get("studentEmail"));
        s.setRoundIndex(Integer.parseInt(body.get("roundIndex")));
        s.setStatus("Appeared");
        DriveStudent saved = driveStudentRepository.save(s);
        return ResponseEntity.ok(Map.of("message", "Student added", "studentId", saved.getId().toString()));
    }

    @PutMapping("/drive/student/{studentId}/status")
    public ResponseEntity<?> updateStatus(@PathVariable Long studentId, @RequestBody Map<String, String> body) {
        return driveStudentRepository.findById(studentId).map(s -> {
            s.setStatus(body.get("status"));
            driveStudentRepository.save(s);
            return ResponseEntity.ok(Map.of("message", "Status updated"));
        }).orElse(ResponseEntity.notFound().build());
    }

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
            return ResponseEntity.ok(Map.of("message", "Promoted", "newStudentId", saved.getId().toString()));
        }).orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/drive/{driveId}/students")
    public ResponseEntity<?> getStudents(@PathVariable Long driveId) {
        return ResponseEntity.ok(driveStudentRepository.findByDriveId(driveId));
    }

    // Student self-applies for a drive (status = "Applied", roundIndex = 0)
    @PostMapping("/drive/apply")
    public ResponseEntity<?> applyForDrive(@RequestBody Map<String, String> body) {
        Long driveId = Long.parseLong(body.get("driveId"));
        // Prevent duplicate applications by same email
        List<DriveStudent> existing = driveStudentRepository.findByDriveIdAndStatus(driveId, "Applied");
        boolean alreadyApplied = existing.stream()
            .anyMatch(s -> body.get("studentEmail") != null && body.get("studentEmail").equalsIgnoreCase(s.getStudentEmail()));
        if (alreadyApplied) {
            return ResponseEntity.badRequest().body(Map.of("message", "Already applied"));
        }
        DriveStudent s = new DriveStudent();
        s.setDriveId(driveId);
        s.setStudentName(body.get("studentName"));
        s.setStudentEmail(body.get("studentEmail"));
        s.setRoundIndex(0);
        s.setStatus("Applied");
        DriveStudent saved = driveStudentRepository.save(s);
        return ResponseEntity.ok(Map.of("message", "Application submitted", "applicationId", saved.getId().toString()));
    }

    // TPO views all students who self-applied for a specific drive
    @GetMapping("/drive/{driveId}/applicants")
    public ResponseEntity<?> getApplicants(@PathVariable Long driveId) {
        return ResponseEntity.ok(driveStudentRepository.findByDriveIdAndStatus(driveId, "Applied"));
    }

    // TPO deletes a student application (roundIndex = -1 self-applied)
    @DeleteMapping("/drive/applicant/{applicationId}")
    public ResponseEntity<?> deleteApplicant(@PathVariable Long applicationId) {
        return driveStudentRepository.findById(applicationId).map(s -> {
            driveStudentRepository.delete(s);
            return ResponseEntity.ok(Map.of(
                "message", "Application deleted",
                "driveId", s.getDriveId().toString(),
                "studentEmail", s.getStudentEmail() != null ? s.getStudentEmail() : ""
            ));
        }).orElse(ResponseEntity.notFound().build());
    }
}
