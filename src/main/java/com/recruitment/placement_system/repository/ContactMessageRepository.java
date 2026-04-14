package com.recruitment.placement_system.repository;

import com.recruitment.placement_system.entity.ContactMessage;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ContactMessageRepository extends JpaRepository<ContactMessage, Long> {
}