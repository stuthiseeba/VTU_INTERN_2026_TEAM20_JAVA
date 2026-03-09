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

    @PostMapping
    public Drive createDrive(@RequestBody Drive drive) {
        return service.createDrive(drive);
    }

    @GetMapping
    public List<Drive> getDrives() {
        return service.getDrives();
    }
}