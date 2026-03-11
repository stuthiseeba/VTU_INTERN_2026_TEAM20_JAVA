package com.recruitment.placement_system.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.recruitment.placement_system.entity.Drive;
import com.recruitment.placement_system.repository.DriveRepository;

@Service
public class DriveService {

    @Autowired
    private DriveRepository repository;

    // ✅ Create Drive
    public Drive createDrive(Drive drive) {
        return repository.save(drive);
    }

    // ✅ Get All Drives
    public List<Drive> getDrives() {
        return repository.findAll();
    }

    // ✅ NEW: Get Drive by ID
    public Drive getDriveById(int id) {
        return repository.findById(id)
            .orElseThrow(() -> new RuntimeException("Drive not found with id: " + id));
    }

    // ✅ NEW: Update Drive
    public Drive updateDrive(int id, Drive updatedDrive) {
        Drive existing = repository.findById(id)
            .orElseThrow(() -> new RuntimeException("Drive not found with id: " + id));

        existing.setCompanyName(updatedDrive.getCompanyName());
        existing.setRole(updatedDrive.getRole());
        existing.setPackageAmount(updatedDrive.getPackageAmount());
        existing.setLocation(updatedDrive.getLocation());
        existing.setMinCgpa(updatedDrive.getMinCgpa());
        existing.setEligibleBranches(updatedDrive.getEligibleBranches());
        existing.setGraduationYear(updatedDrive.getGraduationYear());
        existing.setRequiredSkills(updatedDrive.getRequiredSkills());

        return repository.save(existing);
    }

    // ✅ NEW: Delete Drive
    public String deleteDrive(int id) {
        repository.findById(id)
            .orElseThrow(() -> new RuntimeException("Drive not found with id: " + id));
        repository.deleteById(id);
        return "Drive deleted successfully";
    }
}