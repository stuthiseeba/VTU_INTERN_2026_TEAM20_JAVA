package com.recruitment.placement_system.repository;

import com.recruitment.placement_system.entity.DriveStudent;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface DriveStudentRepository extends JpaRepository<DriveStudent, Long> {
    List<DriveStudent> findByDriveId(Long driveId);
    List<DriveStudent> findByDriveIdAndStudentEmail(Long driveId, String studentEmail);
    List<DriveStudent> findByStudentEmail(String studentEmail);
}
