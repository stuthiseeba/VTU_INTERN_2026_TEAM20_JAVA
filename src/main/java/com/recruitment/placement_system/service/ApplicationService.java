package com.recruitment.placement_system.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.recruitment.placement_system.entity.Application;
import com.recruitment.placement_system.repository.ApplicationRepository;

@Service
public class ApplicationService {

    @Autowired
    private ApplicationRepository repository;

    public Application apply(Application application) {
        application.setStage("Applied");
        application.setStatus("Pending");
        return repository.save(application);
    }

    public List<Application> getApplications() {
        return repository.findAll();
    }

    public Application updateStage(int id, String stage, String status) {
        Application app = repository.findById(id)
            .orElseThrow(() -> new RuntimeException("Application not found with id: " + id));
        app.setStage(stage);
        app.setStatus(status);
        return repository.save(app);
    }
}