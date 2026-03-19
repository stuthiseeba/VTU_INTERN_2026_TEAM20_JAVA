package com.recruitment.placement_system.service;

import java.util.*;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.recruitment.placement_system.entity.Application;
import com.recruitment.placement_system.repository.ApplicationRepository;

@Service
public class ApplicationService {

    @Autowired
    private ApplicationRepository repository;

    // ✅ Apply for Drive — simplified, no eligibility check for now
    public Application apply(Application application) {
        return repository.save(application);
    }

    // ✅ Get all applications
    public List<Application> getApplications() {
        return repository.findAll();  // Assuming findAll(), adjust if custom method
    }

    // ✅ Get applications by drive
    public List<Application> getApplicationsByDrive(Long driveId) {
        return repository.findByDriveId(driveId);
    }

    // ✅ Update stage and status
    public Application updateStage(int id, String stage, String status) {
        Application app = repository.findById(id).orElseThrow(() -> new RuntimeException("Application not found"));
        app.setStage(stage);
        app.setStatus(status);
        return repository.save(app);
    }
}