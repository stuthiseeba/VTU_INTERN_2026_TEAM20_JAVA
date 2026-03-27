package com.recruitment.placement_system.controller;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.Objects;
import java.util.Set;
import java.util.stream.Collectors;
import java.util.Arrays;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.recruitment.placement_system.entity.Application;
import com.recruitment.placement_system.entity.PatDrive;
import com.recruitment.placement_system.repository.PatDriveRepository;
import com.recruitment.placement_system.repository.StudentProfileRepository;
import com.recruitment.placement_system.service.ApplicationService;

@RestController
@RequestMapping("/applications")
@CrossOrigin(origins = "*")
public class ApplicationController {

    @Autowired
    private ApplicationService service;

    @Autowired
    private PatDriveRepository patDriveRepository;

    @Autowired
    private StudentProfileRepository studentProfileRepository; // ✅ NEW: Need this to check student department

    // ✅ Apply for a drive
    @PostMapping
    public Application apply(@RequestBody Application application) {
        return service.apply(application);
    }

    // ✅ Get all applications
    @GetMapping
    public List<Application> getApplications() {
        return service.getApplications();
    }

    // ✅ Get applications by drive
    @GetMapping("/drive/{driveId}")
    public List<Application> getApplicationsByDrive(@PathVariable Long driveId) {
        return service.getApplicationsByDrive(driveId);
    }

    // ✅ Update stage and status
    @PutMapping("/{id}")
    public Application updateStage(
            @PathVariable int id,
            @RequestParam String stage,
            @RequestParam String status) {
        return service.updateStage(id, stage, status);
    }

    // ✅ Get available drives for student (WITH DEPARTMENT FILTER)
    @GetMapping("/student/{studentId}/available")
    public List<PatDrive> getAvailableDrives(@PathVariable int studentId) {
        
        // 1. Fetch the student's department
        String studentDept = studentProfileRepository.findByUserId((long) studentId)
                .map(com.recruitment.placement_system.entity.StudentProfile::getDepartment)
                .orElse("");

        List<Application> studentApps = service.getApplicationsByStudent(studentId);
        Set<Long> appliedIds = studentApps.stream()
            .map(Application::getDriveId)
            .collect(Collectors.toSet());
            
        return patDriveRepository.findAll().stream()
            .filter(this::isVisibleToStudents)
            .filter(d -> !appliedIds.contains(d.getId()))
            .filter(d -> isDepartmentEligible(d, studentDept)) // ✅ 2. Filter drives by department
            .collect(Collectors.toList());
    }

    // ✅ Get applied drives for student
    @GetMapping("/student/{studentId}/applied")
    public List<Map<String, Object>> getAppliedDrives(@PathVariable int studentId) {
        return service.getApplicationsByStudent(studentId).stream()
            .map(application -> patDriveRepository.findById(application.getDriveId())
                .map(drive -> toAppliedDriveResponse(application, drive))
                .orElse(null))
            .filter(Objects::nonNull)
            .collect(Collectors.toList());
    }

    @DeleteMapping("/{id}")
    public Map<String, String> deleteApplication(@PathVariable int id) {
        service.deleteApplication(id);
        return Map.of("message", "Application deleted");
    }

    private Map<String, Object> toAppliedDriveResponse(Application application, PatDrive drive) {
        Map<String, Object> response = new LinkedHashMap<>();
        response.put("applicationId", application.getApplicationId());
        response.put("driveId", drive.getId());
        response.put("company", drive.getCompany());
        response.put("role", drive.getRole());
        response.put("driveDate", drive.getDriveDate());
        response.put("driveTime", drive.getDriveTime());
        response.put("venue", drive.getVenue());
        response.put("eligibility", drive.getEligibility());
        response.put("rounds", drive.getRounds());
        response.put("driveStatus", drive.getStatus());
        response.put("stage", application.getStage());
        response.put("status", application.getStatus());
        response.put("applicationStatus", application.getStatus());
        return response;
    }

    private boolean isVisibleToStudents(PatDrive drive) {
        String status = drive.getStatus();
        if (status == null || status.isBlank()) {
            return true;
        }

        String normalized = status.trim().toLowerCase(Locale.ROOT);
        return !Set.of("closed", "completed", "archived", "deleted", "cancelled", "canceled")
            .contains(normalized);
    }

    // ✅ Helper method to match student branch against allowed branches
    private boolean isDepartmentEligible(PatDrive drive, String studentDept) {
        String allowed = drive.getEligibleBranches();
        if (allowed == null || allowed.trim().isEmpty()) {
            return true; // If TPO didn't specify branches, it's open to all
        }
        if (studentDept == null || studentDept.trim().isEmpty()) {
            return false; // Drive requires branches, but student hasn't updated their profile yet
        }
        return Arrays.asList(allowed.split(",")).contains(studentDept);
    }
}