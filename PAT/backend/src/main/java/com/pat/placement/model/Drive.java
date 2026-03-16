package com.pat.placement.model;

import jakarta.persistence.*;

@Entity
@Table(name = "drives")
public class Drive {

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
}
