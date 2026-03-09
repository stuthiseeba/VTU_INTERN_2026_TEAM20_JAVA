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

    public Drive createDrive(Drive drive) {
        return repository.save(drive);
    }

    public List<Drive> getDrives() {
        return repository.findAll();
    }
}