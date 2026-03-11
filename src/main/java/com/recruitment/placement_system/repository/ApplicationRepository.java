package com.recruitment.placement_system.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.recruitment.placement_system.entity.Application;

public interface ApplicationRepository extends JpaRepository<Application, Integer> {

    // ✅ NEW: Find all applications for a specific drive
    List<Application> findByDriveId(int driveId);

}