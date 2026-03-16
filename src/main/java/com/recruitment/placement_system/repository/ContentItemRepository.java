package com.recruitment.placement_system.repository;

import com.recruitment.placement_system.entity.ContentItem;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ContentItemRepository extends JpaRepository<ContentItem, Long> {
    List<ContentItem> findByType(String type);
}