package com.recruitment.placement_system.controller;

import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.recruitment.placement_system.entity.Application;
import com.recruitment.placement_system.entity.PatDrive;
import com.recruitment.placement_system.repository.PatDriveRepository;
import com.recruitment.placement_system.service.ApplicationService;

@RestController
@RequestMapping("/applications")
public class ApplicationController {

    @Autowired
    private ApplicationService service;

    @Autowired
    private PatDriveRepository patDriveRepository;

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

    // ✅ Get available drives for student
    @GetMapping("/student/{studentId}/available")
    public List<PatDrive> getAvailableDrives(@PathVariable int studentId) {
        List<PatDrive> allUpcoming = patDriveRepository.findByStatus("Upcoming");
        List<Application> studentApps = service.getApplications().stream()
            .filter(a -> a.getStudentId() == studentId)
            .collect(Collectors.toList());
        Set<Long> appliedIds = studentApps.stream()
            .map(Application::getDriveId)
            .collect(Collectors.toSet());
        return allUpcoming.stream()
            .filter(d -> !appliedIds.contains(d.getId()))
            .collect(Collectors.toList());
    }

    // ✅ Get applied drives for student
    @GetMapping("/student/{studentId}/applied")
    public List<PatDrive> getAppliedDrives(@PathVariable int studentId) {
        List<Application> studentApps = service.getApplications().stream()
            .filter(a -> a.getStudentId() == studentId)
            .collect(Collectors.toList());
        Set<Long> appliedIds = studentApps.stream()
            .map(Application::getDriveId)
            .collect(Collectors.toSet());
        return patDriveRepository.findAllById(appliedIds);
    }
}