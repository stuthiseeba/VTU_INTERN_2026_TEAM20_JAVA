package com.recruitment.placement_system.controller;

import com.recruitment.placement_system.entity.ContentItem;
import com.recruitment.placement_system.repository.ContentItemRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

// ✅ Team 3 - Coordinator content management
@RestController
@RequestMapping("/api/content")
@CrossOrigin(origins = "*")
public class ContentController {

    @Autowired private ContentItemRepository contentItemRepository;

    @PostMapping
    public ResponseEntity<?> addItem(@RequestBody Map<String, String> body) {
        ContentItem item = new ContentItem();
        item.setType(body.get("type"));
        item.setTitle(body.get("title"));
        item.setBody(body.get("body"));
        item.setCoordinatorUserId(Long.parseLong(body.get("coordinatorUserId")));
        ContentItem saved = contentItemRepository.save(item);
        return ResponseEntity.ok(Map.of(
            "message", "Content saved",
            "id", saved.getId().toString()
        ));
    }

    @GetMapping("/{type}")
    public ResponseEntity<?> getByType(@PathVariable String type) {
        return ResponseEntity.ok(contentItemRepository.findByType(type));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteItem(@PathVariable Long id) {
        contentItemRepository.deleteById(id);
        return ResponseEntity.ok(Map.of("message", "Deleted"));
    }
}