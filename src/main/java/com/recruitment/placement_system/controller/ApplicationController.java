package com.recruitment.placement_system.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.recruitment.placement_system.entity.Application;
import com.recruitment.placement_system.service.ApplicationService;

@RestController
@RequestMapping("/applications")
public class ApplicationController {

    @Autowired
    private ApplicationService service;

    @PostMapping
    public Application apply(@RequestBody Application application) {
        return service.apply(application);
    }

    @GetMapping
    public List<Application> getApplications() {
        return service.getApplications();
    }

    @PutMapping("/{id}")
    public Application updateStage(
            @PathVariable int id,
            @RequestParam String stage,
            @RequestParam String status) {
        return service.updateStage(id, stage, status);
    }
}