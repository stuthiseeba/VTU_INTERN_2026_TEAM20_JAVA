package com.pat.placement.repository;

import com.pat.placement.model.DriveStudent;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface DriveStudentRepository extends JpaRepository<DriveStudent, Long> {
    List<DriveStudent> findByDriveId(Long driveId);
}
