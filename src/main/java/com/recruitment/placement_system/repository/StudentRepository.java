package com.recruitment.placement_system.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.recruitment.placement_system.entity.Student;

public interface StudentRepository extends JpaRepository<Student, Integer> {
}