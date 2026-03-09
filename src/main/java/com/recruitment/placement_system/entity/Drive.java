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

    public Drive() {}

    public int getDriveId() {
        return driveId;
    }

    public void setDriveId(int driveId) {
        this.driveId = driveId;
    }

    public String getCompanyName() {
        return companyName;
    }

    public void setCompanyName(String companyName) {
        this.companyName = companyName;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }

    public double getPackageAmount() {
        return packageAmount;
    }

    public void setPackageAmount(double packageAmount) {
        this.packageAmount = packageAmount;
    }

    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
        this.location = location;
    }
}