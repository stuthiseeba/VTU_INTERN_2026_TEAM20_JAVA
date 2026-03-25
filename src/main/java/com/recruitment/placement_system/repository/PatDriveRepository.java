// ─── PatDriveRepository.java ───────────────────────────────────────────────
package com.recruitment.placement_system.repository;

import com.recruitment.placement_system.entity.PatDrive;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface PatDriveRepository extends JpaRepository<PatDrive, Long> {
    List<PatDrive> findByTpoUserId(Long tpoUserId);
    List<PatDrive> findByStatus(String status);
}