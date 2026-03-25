package com.recruitment.placement_system.entity;

import jakarta.persistence.*;

@Entity
public class Drive {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int driveId;

    private String companyName;
    private String role;
    private double packageAmount;
    private String location;

    // ✅ NEW: Eligibility Criteria Fields
    private float minCgpa;                // Minimum CGPA required e.g. 7.5
    private String eligibleBranches;      // Comma-separated e.g. "CSE,ISE,ECE"
    private int graduationYear;           // Required graduation year e.g. 2026
    private String requiredSkills;        // Comma-separated e.g. "Java,SQL"

    public Drive() {}

    public int getDriveId() { return driveId; }
    public void setDriveId(int driveId) { this.driveId = driveId; }

    public String getCompanyName() { return companyName; }
    public void setCompanyName(String companyName) { this.companyName = companyName; }

    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }

    public double getPackageAmount() { return packageAmount; }
    public void setPackageAmount(double packageAmount) { this.packageAmount = packageAmount; }

    public String getLocation() { return location; }
    public void setLocation(String location) { this.location = location; }

    public float getMinCgpa() { return minCgpa; }
    public void setMinCgpa(float minCgpa) { this.minCgpa = minCgpa; }

    public String getEligibleBranches() { return eligibleBranches; }
    public void setEligibleBranches(String eligibleBranches) { this.eligibleBranches = eligibleBranches; }

    public int getGraduationYear() { return graduationYear; }
    public void setGraduationYear(int graduationYear) { this.graduationYear = graduationYear; }

    public String getRequiredSkills() { return requiredSkills; }
    public void setRequiredSkills(String requiredSkills) { this.requiredSkills = requiredSkills; }
}