package com.recruitment.placement_system.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "pat_drives")
public class PatDrive {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private Long tpoUserId;

    // --- Section 1: Basic Info & Salary ---
    private String company;
    private String role;
    private String jobType;         // Full-time, Internship, Internship + PPO
    private Double ctc;             // in LPA
    private Double stipend;         // Monthly stipend
    private String location;
    private String companyType;     // Product-based, Service-based, Startup

    // --- Section 2: Drive Details ---
    private String driveDate;
    private String driveTime;
    private String venue;
    private String driveMode;       // Online, Offline, Hybrid

    // --- Section 3: Eligibility ---
    private Double minCgpa;
    private Integer maxBacklogs;
    private Double tenthPercent;
    private Double twelfthPercent;
    private Integer gapYears;
    private String eligibleBranches; // Comma-separated (e.g. "CSE,ISE")
    private Integer graduationYear;  // e.g., 2024, 2025
    private String yearAllowed;      // 3rd year, 4th year

    // --- Section 4: Process ---
    private String rounds;           // Comma-separated (e.g. "Aptitude,Technical,HR")

    // --- Section 5: Deadlines ---
    private String registrationDeadline;
    private String resultDate;

    // --- Section 6: Attachments & Links ---
    private String jdLink;           // Link to JD
    private String applyLink;        // External Apply link
    private String companyWebsite;
    private String bondDetails;      // e.g., "Yes - 2 Years", "No"

    // --- Section 7: Smart Automation & Tracking ---
    private Boolean autoShortlist;
    private Boolean sendEmailAlert;
    private String status;           // Open, Closed, Completed
    private Integer numberOfPositions;


    // ==========================================
    // GETTERS AND SETTERS
    // ==========================================

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getTpoUserId() { return tpoUserId; }
    public void setTpoUserId(Long tpoUserId) { this.tpoUserId = tpoUserId; }

    public String getCompany() { return company; }
    public void setCompany(String company) { this.company = company; }

    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }

    public String getJobType() { return jobType; }
    public void setJobType(String jobType) { this.jobType = jobType; }

    public Double getCtc() { return ctc; }
    public void setCtc(Double ctc) { this.ctc = ctc; }

    public Double getStipend() { return stipend; }
    public void setStipend(Double stipend) { this.stipend = stipend; }

    public String getLocation() { return location; }
    public void setLocation(String location) { this.location = location; }

    public String getCompanyType() { return companyType; }
    public void setCompanyType(String companyType) { this.companyType = companyType; }

    public String getDriveDate() { return driveDate; }
    public void setDriveDate(String driveDate) { this.driveDate = driveDate; }

    public String getDriveTime() { return driveTime; }
    public void setDriveTime(String driveTime) { this.driveTime = driveTime; }

    public String getVenue() { return venue; }
    public void setVenue(String venue) { this.venue = venue; }

    public String getDriveMode() { return driveMode; }
    public void setDriveMode(String driveMode) { this.driveMode = driveMode; }

    public Double getMinCgpa() { return minCgpa; }
    public void setMinCgpa(Double minCgpa) { this.minCgpa = minCgpa; }

    public Integer getMaxBacklogs() { return maxBacklogs; }
    public void setMaxBacklogs(Integer maxBacklogs) { this.maxBacklogs = maxBacklogs; }

    public Double getTenthPercent() { return tenthPercent; }
    public void setTenthPercent(Double tenthPercent) { this.tenthPercent = tenthPercent; }

    public Double getTwelfthPercent() { return twelfthPercent; }
    public void setTwelfthPercent(Double twelfthPercent) { this.twelfthPercent = twelfthPercent; }

    public Integer getGapYears() { return gapYears; }
    public void setGapYears(Integer gapYears) { this.gapYears = gapYears; }

    public String getEligibleBranches() { return eligibleBranches; }
    public void setEligibleBranches(String eligibleBranches) { this.eligibleBranches = eligibleBranches; }

    public Integer getGraduationYear() { return graduationYear; }
    public void setGraduationYear(Integer graduationYear) { this.graduationYear = graduationYear; }

    public String getYearAllowed() { return yearAllowed; }
    public void setYearAllowed(String yearAllowed) { this.yearAllowed = yearAllowed; }

    public String getRounds() { return rounds; }
    public void setRounds(String rounds) { this.rounds = rounds; }

    public String getRegistrationDeadline() { return registrationDeadline; }
    public void setRegistrationDeadline(String registrationDeadline) { this.registrationDeadline = registrationDeadline; }

    public String getResultDate() { return resultDate; }
    public void setResultDate(String resultDate) { this.resultDate = resultDate; }

    public String getJdLink() { return jdLink; }
    public void setJdLink(String jdLink) { this.jdLink = jdLink; }

    public String getApplyLink() { return applyLink; }
    public void setApplyLink(String applyLink) { this.applyLink = applyLink; }

    public String getCompanyWebsite() { return companyWebsite; }
    public void setCompanyWebsite(String companyWebsite) { this.companyWebsite = companyWebsite; }

    public String getBondDetails() { return bondDetails; }
    public void setBondDetails(String bondDetails) { this.bondDetails = bondDetails; }

    public Boolean getAutoShortlist() { return autoShortlist; }
    public void setAutoShortlist(Boolean autoShortlist) { this.autoShortlist = autoShortlist; }

    public Boolean getSendEmailAlert() { return sendEmailAlert; }
    public void setSendEmailAlert(Boolean sendEmailAlert) { this.sendEmailAlert = sendEmailAlert; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public Integer getNumberOfPositions() { return numberOfPositions; }
    public void setNumberOfPositions(Integer numberOfPositions) { this.numberOfPositions = numberOfPositions; }
}