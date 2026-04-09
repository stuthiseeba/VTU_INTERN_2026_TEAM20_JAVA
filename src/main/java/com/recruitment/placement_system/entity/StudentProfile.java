package com.recruitment.placement_system.entity;

import jakarta.persistence.*;

// ✅ Team 3 - Detailed student profile
@Entity
@Table(name = "student_profile")
public class StudentProfile {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long userId;

    // Personal Info
    private String phone;
    private String linkedin;
    private String address;
    @Column(name = "resume_link")
    private String resumeLink;

    // Academic
    private String cgpa;
    private String department;
    private String college;

    // 10th
    private String school10;
    private String score10;
    private String year10;

    // 12th
    private String school12;
    private String score12;
    private String year12;

    // Degree
    private String degreeName;
    private String specialization;
    private String yearDegree;

    // Identification
    private String aadharNumber;

    // Skills (comma-separated)
    private String softSkills;
    private String techSkills;

    public Long getId() { return id; }
    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }
    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }
    public String getLinkedin() { return linkedin; }
    public void setLinkedin(String linkedin) { this.linkedin = linkedin; }
    public String getAddress() { return address; }
    public void setAddress(String address) { this.address = address; }
    public String getResumeLink() { return resumeLink; }
    public void setResumeLink(String resumeLink) { this.resumeLink = resumeLink; }
    public String getCgpa() { return cgpa; }
    public void setCgpa(String cgpa) { this.cgpa = cgpa; }
    public String getDepartment() { return department; }
    public void setDepartment(String department) { this.department = department; }
    public String getCollege() { return college; }
    public void setCollege(String college) { this.college = college; }
    public String getSchool10() { return school10; }
    public void setSchool10(String school10) { this.school10 = school10; }
    public String getScore10() { return score10; }
    public void setScore10(String score10) { this.score10 = score10; }
    public String getYear10() { return year10; }
    public void setYear10(String year10) { this.year10 = year10; }
    public String getSchool12() { return school12; }
    public void setSchool12(String school12) { this.school12 = school12; }
    public String getScore12() { return score12; }
    public void setScore12(String score12) { this.score12 = score12; }
    public String getYear12() { return year12; }
    public void setYear12(String year12) { this.year12 = year12; }
    public String getDegreeName() { return degreeName; }
    public void setDegreeName(String degreeName) { this.degreeName = degreeName; }
    public String getSpecialization() { return specialization; }
    public void setSpecialization(String specialization) { this.specialization = specialization; }
    public String getYearDegree() { return yearDegree; }
    public void setYearDegree(String yearDegree) { this.yearDegree = yearDegree; }
    public String getAadharNumber() { return aadharNumber; }
    public void setAadharNumber(String aadharNumber) { this.aadharNumber = aadharNumber; }
    public String getSoftSkills() { return softSkills; }
    public void setSoftSkills(String softSkills) { this.softSkills = softSkills; }
    public String getTechSkills() { return techSkills; }
    public void setTechSkills(String techSkills) { this.techSkills = techSkills; }
}