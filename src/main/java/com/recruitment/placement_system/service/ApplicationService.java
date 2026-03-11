package com.recruitment.placement_system.service;

import java.util.*;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.recruitment.placement_system.dto.ConversionMetrics;
import com.recruitment.placement_system.dto.ConversionMetrics.RoundStats;
import com.recruitment.placement_system.entity.Application;
import com.recruitment.placement_system.entity.Drive;
import com.recruitment.placement_system.entity.Student;
import com.recruitment.placement_system.repository.ApplicationRepository;
import com.recruitment.placement_system.repository.DriveRepository;
import com.recruitment.placement_system.repository.StudentRepository;

@Service
public class ApplicationService {

    @Autowired
    private ApplicationRepository repository;

    @Autowired
    private DriveRepository driveRepository;

    @Autowired
    private StudentRepository studentRepository;

    // ✅ Apply for Drive — with Eligibility Check
    public Application apply(Application application) {

        // Fetch student and drive
        Student student = studentRepository.findById(application.getStudentId())
            .orElseThrow(() -> new RuntimeException("Student not found with id: " + application.getStudentId()));

        Drive drive = driveRepository.findById(application.getDriveId())
            .orElseThrow(() -> new RuntimeException("Drive not found with id: " + application.getDriveId()));

        // ✅ ELIGIBILITY ENGINE — Check all criteria
        List<String> failReasons = new ArrayList<>();

        // 1. CGPA check
        if (drive.getMinCgpa() > 0 && student.getCgpa() < drive.getMinCgpa()) {
            failReasons.add("CGPA " + student.getCgpa() + " is below required " + drive.getMinCgpa());
        }

        // 2. Branch check
        if (drive.getEligibleBranches() != null && !drive.getEligibleBranches().isEmpty()) {
            List<String> eligibleBranches = Arrays.asList(
                drive.getEligibleBranches().toUpperCase().split(",")
            );
            if (!eligibleBranches.contains(student.getBranch().toUpperCase())) {
                failReasons.add("Branch " + student.getBranch() + " is not eligible. Eligible: " + drive.getEligibleBranches());
            }
        }

        // 3. Graduation year check
        if (drive.getGraduationYear() > 0 && student.getGraduationYear() != drive.getGraduationYear()) {
            failReasons.add("Graduation year " + student.getGraduationYear() + " does not match required " + drive.getGraduationYear());
        }

        // 4. Skills check
        if (drive.getRequiredSkills() != null && !drive.getRequiredSkills().isEmpty()) {
            List<String> requiredSkills = Arrays.asList(
                drive.getRequiredSkills().toUpperCase().split(",")
            );
            List<String> studentSkills = student.getSkills() != null
                ? Arrays.asList(student.getSkills().toUpperCase().split(","))
                : new ArrayList<>();

            List<String> missingSkills = new ArrayList<>();
            for (String skill : requiredSkills) {
                if (!studentSkills.contains(skill.trim())) {
                    missingSkills.add(skill.trim());
                }
            }
            if (!missingSkills.isEmpty()) {
                failReasons.add("Missing required skills: " + missingSkills);
            }
        }

        // If any eligibility check failed — reject application
        if (!failReasons.isEmpty()) {
            throw new RuntimeException("Student not eligible: " + String.join("; ", failReasons));
        }

        // All checks passed — save application
        application.setStage("Applied");
        application.setStatus("Pending");
        return repository.save(application);
    }

    // ✅ Get All Applications
    public List<Application> getApplications() {
        return repository.findAll();
    }

    // ✅ Get Applications by Drive
    public List<Application> getApplicationsByDrive(int driveId) {
        return repository.findByDriveId(driveId);
    }

    // ✅ Update Stage and Status
    public Application updateStage(int id, String stage, String status) {
        Application app = repository.findById(id)
            .orElseThrow(() -> new RuntimeException("Application not found with id: " + id));
        app.setStage(stage);
        app.setStatus(status);
        return repository.save(app);
    }

    // ✅ NEW: Check if a student is eligible for a drive (without applying)
    public Map<String, Object> checkEligibility(int studentId, int driveId) {

        Student student = studentRepository.findById(studentId)
            .orElseThrow(() -> new RuntimeException("Student not found"));

        Drive drive = driveRepository.findById(driveId)
            .orElseThrow(() -> new RuntimeException("Drive not found"));

        List<String> failReasons = new ArrayList<>();

        if (drive.getMinCgpa() > 0 && student.getCgpa() < drive.getMinCgpa())
            failReasons.add("CGPA too low: " + student.getCgpa() + " < " + drive.getMinCgpa());

        if (drive.getEligibleBranches() != null && !drive.getEligibleBranches().isEmpty()) {
            List<String> branches = Arrays.asList(drive.getEligibleBranches().toUpperCase().split(","));
            if (!branches.contains(student.getBranch().toUpperCase()))
                failReasons.add("Branch not eligible: " + student.getBranch());
        }

        if (drive.getGraduationYear() > 0 && student.getGraduationYear() != drive.getGraduationYear())
            failReasons.add("Graduation year mismatch: " + student.getGraduationYear() + " != " + drive.getGraduationYear());

        if (drive.getRequiredSkills() != null && !drive.getRequiredSkills().isEmpty()) {
            List<String> required = Arrays.asList(drive.getRequiredSkills().toUpperCase().split(","));
            List<String> studentSkills = student.getSkills() != null
                ? Arrays.asList(student.getSkills().toUpperCase().split(","))
                : new ArrayList<>();
            List<String> missing = new ArrayList<>();
            for (String s : required)
                if (!studentSkills.contains(s.trim())) missing.add(s.trim());
            if (!missing.isEmpty())
                failReasons.add("Missing skills: " + missing);
        }

        Map<String, Object> result = new LinkedHashMap<>();
        result.put("studentId", studentId);
        result.put("driveId", driveId);
        result.put("studentName", student.getName());
        result.put("companyName", drive.getCompanyName());
        result.put("eligible", failReasons.isEmpty());
        result.put("reasons", failReasons.isEmpty() ? List.of("All criteria met") : failReasons);
        return result;
    }

    // ✅ NEW: Get Eligible Students for a Drive
    public List<Student> getEligibleStudents(int driveId) {

        Drive drive = driveRepository.findById(driveId)
            .orElseThrow(() -> new RuntimeException("Drive not found"));

        List<Student> allStudents = studentRepository.findAll();
        List<Student> eligible = new ArrayList<>();

        for (Student student : allStudents) {

            boolean pass = true;

            if (drive.getMinCgpa() > 0 && student.getCgpa() < drive.getMinCgpa())
                pass = false;

            if (pass && drive.getEligibleBranches() != null && !drive.getEligibleBranches().isEmpty()) {
                List<String> branches = Arrays.asList(drive.getEligibleBranches().toUpperCase().split(","));
                if (!branches.contains(student.getBranch().toUpperCase())) pass = false;
            }

            if (pass && drive.getGraduationYear() > 0 && student.getGraduationYear() != drive.getGraduationYear())
                pass = false;

            if (pass && drive.getRequiredSkills() != null && !drive.getRequiredSkills().isEmpty()) {
                List<String> required = Arrays.asList(drive.getRequiredSkills().toUpperCase().split(","));
                List<String> studentSkills = student.getSkills() != null
                    ? Arrays.asList(student.getSkills().toUpperCase().split(","))
                    : new ArrayList<>();
                for (String s : required)
                    if (!studentSkills.contains(s.trim())) { pass = false; break; }
            }

            if (pass) eligible.add(student);
        }

        return eligible;
    }

    // ✅ NEW: Conversion Ratio Metrics
    public ConversionMetrics getConversionMetrics(int driveId) {

        List<Application> apps = driveId == 0
            ? repository.findAll()
            : repository.findByDriveId(driveId);

        ConversionMetrics metrics = new ConversionMetrics();
        metrics.setTotalApplicants(apps.size());

        int selected = 0, rejected = 0, pending = 0;
        Map<String, RoundStats> roundMap = new LinkedHashMap<>();

        for (Application app : apps) {

            // Overall counts
            if ("Selected".equalsIgnoreCase(app.getStatus()))   selected++;
            else if ("Rejected".equalsIgnoreCase(app.getStatus())) rejected++;
            else pending++;

            // Round-wise counts
            String stage = app.getStage() != null ? app.getStage() : "Unknown";
            RoundStats rs = roundMap.getOrDefault(stage, new RoundStats());
            rs.setTotal(rs.getTotal() + 1);
            if ("Selected".equalsIgnoreCase(app.getStatus()))      rs.setSelected(rs.getSelected() + 1);
            else if ("Rejected".equalsIgnoreCase(app.getStatus())) rs.setRejected(rs.getRejected() + 1);
            else                                                     rs.setPending(rs.getPending() + 1);

            // Round conversion rate
            double rate = rs.getTotal() > 0
                ? Math.round((rs.getSelected() * 100.0 / rs.getTotal()) * 100.0) / 100.0
                : 0.0;
            rs.setConversionRate(rate);
            roundMap.put(stage, rs);
        }

        metrics.setTotalSelected(selected);
        metrics.setTotalRejected(rejected);
        metrics.setTotalPending(pending);
        metrics.setOverallConversionRate(
            apps.size() > 0
                ? Math.round((selected * 100.0 / apps.size()) * 100.0) / 100.0
                : 0.0
        );
        metrics.setRoundWiseStats(roundMap);

        return metrics;
    }
}