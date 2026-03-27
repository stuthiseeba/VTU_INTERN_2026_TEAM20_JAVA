package com.recruitment.placement_system.entity;

import jakarta.persistence.*;

// ✅ Team 3 - TPO Drive management
// Table name is pat_drives to avoid conflict with Team 2's drive table
@Entity
@Table(name = "pat_drives")
public class PatDrive {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long tpoUserId;
    private String company;
    private String role;
    private String driveDate;
    private String driveTime;
    private String venue;
    private String eligibility;
    private String rounds;
    private String status;
    private String eligibleBranches; // ✅ NEW: Stores allowed departments (e.g. "CSE,ISE")

    public Long getId() { return id; }
    public Long getTpoUserId() { return tpoUserId; }
    public void setTpoUserId(Long tpoUserId) { this.tpoUserId = tpoUserId; }
    public String getCompany() { return company; }
    public void setCompany(String company) { this.company = company; }
    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }
    public String getDriveDate() { return driveDate; }
    public void setDriveDate(String driveDate) { this.driveDate = driveDate; }
    public String getDriveTime() { return driveTime; }
    public void setDriveTime(String driveTime) { this.driveTime = driveTime; }
    public String getVenue() { return venue; }
    public void setVenue(String venue) { this.venue = venue; }
    public String getEligibility() { return eligibility; }
    public void setEligibility(String eligibility) { this.eligibility = eligibility; }
    public String getRounds() { return rounds; }
    public void setRounds(String rounds) { this.rounds = rounds; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    public String getEligibleBranches() { return eligibleBranches; }
    public void setEligibleBranches(String eligibleBranches) { this.eligibleBranches = eligibleBranches; }
}