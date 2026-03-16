package com.recruitment.placement_system.entity;

import jakarta.persistence.*;

// ✅ Team 3 - Drive funnel student tracking
@Entity
@Table(name = "drive_students")
public class DriveStudent {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long driveId;
    private String studentName;
    private String studentEmail;
    private int roundIndex;
    private String status; // Appeared, Selected, Rejected

    public Long getId() { return id; }
    public Long getDriveId() { return driveId; }
    public void setDriveId(Long driveId) { this.driveId = driveId; }
    public String getStudentName() { return studentName; }
    public void setStudentName(String studentName) { this.studentName = studentName; }
    public String getStudentEmail() { return studentEmail; }
    public void setStudentEmail(String studentEmail) { this.studentEmail = studentEmail; }
    public int getRoundIndex() { return roundIndex; }
    public void setRoundIndex(int roundIndex) { this.roundIndex = roundIndex; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
}