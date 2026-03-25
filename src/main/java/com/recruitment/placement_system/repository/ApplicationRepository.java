package com.recruitment.placement_system.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.recruitment.placement_system.entity.Application;

public interface ApplicationRepository extends JpaRepository<Application, Integer> {

    // ✅ Find all applications for a specific drive
    List<Application> findByDriveId(Long driveId);
    List<Application> findByStudentId(int studentId);
    Optional<Application> findByStudentIdAndDriveId(int studentId, Long driveId);

}
