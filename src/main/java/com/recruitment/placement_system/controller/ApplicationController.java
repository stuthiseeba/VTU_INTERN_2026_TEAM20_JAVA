package com.recruitment.placement_system.controller;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.recruitment.placement_system.dto.ConversionMetrics;
import com.recruitment.placement_system.entity.Application;
import com.recruitment.placement_system.entity.Student;
import com.recruitment.placement_system.service.ApplicationService;

@RestController
@RequestMapping("/applications")
public class ApplicationController {

    @Autowired
    private ApplicationService service;

    // ✅ Apply for a drive (with eligibility check)
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
    public List<Application> getApplicationsByDrive(@PathVariable int driveId) {
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

    // ✅ NEW: Check if a student is eligible for a drive
    // GET /applications/eligibility?studentId=1&driveId=2
    @GetMapping("/eligibility")
    public Map<String, Object> checkEligibility(
            @RequestParam int studentId,
            @RequestParam int driveId) {
        return service.checkEligibility(studentId, driveId);
    }

    // ✅ NEW: Get all eligible students for a drive
    // GET /applications/eligible-students/{driveId}
    @GetMapping("/eligible-students/{driveId}")
    public List<Student> getEligibleStudents(@PathVariable int driveId) {
        return service.getEligibleStudents(driveId);
    }

    // ✅ NEW: Get conversion metrics for a specific drive
    // GET /applications/metrics/{driveId}
    @GetMapping("/metrics/{driveId}")
    public ConversionMetrics getMetricsByDrive(@PathVariable int driveId) {
        return service.getConversionMetrics(driveId);
    }

    // ✅ NEW: Get overall conversion metrics across all drives
    // GET /applications/metrics
    @GetMapping("/metrics")
    public ConversionMetrics getOverallMetrics() {
        return service.getConversionMetrics(0);
    }
}