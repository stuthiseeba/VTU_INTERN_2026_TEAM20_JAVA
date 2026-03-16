package com.recruitment.placement_system.entity;

import jakarta.persistence.*;

// ✅ Team 3 - Coordinator content management (announcements, companies etc.)
@Entity
@Table(name = "content_items")
public class ContentItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String type; // announcements, companies, drives, partnerships, global
    private String title;

    @Column(columnDefinition = "TEXT")
    private String body;

    private Long coordinatorUserId;

    public Long getId() { return id; }
    public String getType() { return type; }
    public void setType(String type) { this.type = type; }
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    public String getBody() { return body; }
    public void setBody(String body) { this.body = body; }
    public Long getCoordinatorUserId() { return coordinatorUserId; }
    public void setCoordinatorUserId(Long coordinatorUserId) { this.coordinatorUserId = coordinatorUserId; }
}