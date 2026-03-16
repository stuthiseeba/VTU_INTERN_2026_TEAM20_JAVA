package com.pat.placement.repository;

import com.pat.placement.model.Drive;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface DriveRepository extends JpaRepository<Drive, Long> {
    List<Drive> findByTpoUserId(Long tpoUserId);
}
