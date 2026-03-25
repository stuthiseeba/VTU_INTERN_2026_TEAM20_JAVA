package com.recruitment.placement_system.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.recruitment.placement_system.entity.Drive;
import com.recruitment.placement_system.service.DriveService;

@RestController
@RequestMapping("/drives")
public class DriveController {

    @Autowired
    private DriveService service;

    // ✅ Create Drive
    @PostMapping
    public Drive createDrive(@RequestBody Drive drive) {
        return service.createDrive(drive);
    }

    // ✅ Get All Drives
    @GetMapping
    public List<Drive> getDrives() {
        return service.getDrives();
    }

    // ✅ NEW: Get Drive by ID
    @GetMapping("/{id}")
    public Drive getDriveById(@PathVariable int id) {
        return service.getDriveById(id);
    }

    // ✅ NEW: Update Drive
    @PutMapping("/{id}")
    public Drive updateDrive(@PathVariable int id, @RequestBody Drive drive) {
        return service.updateDrive(id, drive);
    }

    // ✅ NEW: Delete Drive
    @DeleteMapping("/{id}")
    public String deleteDrive(@PathVariable int id) {
        return service.deleteDrive(id);
    }
}