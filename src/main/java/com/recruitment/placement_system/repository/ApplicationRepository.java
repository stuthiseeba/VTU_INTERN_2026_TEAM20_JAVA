package com.recruitment.placement_system.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.recruitment.placement_system.entity.Application;

public interface ApplicationRepository extends JpaRepository<Application, Integer> {

}