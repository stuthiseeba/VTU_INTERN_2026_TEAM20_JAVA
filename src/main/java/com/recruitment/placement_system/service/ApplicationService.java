package com.recruitment.placement_system.service;

import java.util.*;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.recruitment.placement_system.entity.Application;
import com.recruitment.placement_system.entity.DriveStudent;
import com.recruitment.placement_system.entity.User;
import com.recruitment.placement_system.repository.ApplicationRepository;
import com.recruitment.placement_system.repository.DriveStudentRepository;
import com.recruitment.placement_system.repository.UserRepository;

@Service
public class ApplicationService {

    @Autowired
    private ApplicationRepository repository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private DriveStudentRepository driveStudentRepository;

    // ✅ Apply for Drive — simplified, no eligibility check for now
    @Transactional
    public Application apply(Application application) {
        if (repository.findByStudentIdAndDriveId(application.getStudentId(), application.getDriveId()).isPresent()) {
            throw new RuntimeException("You have already applied for this drive");
        }

        if (application.getStage() == null || application.getStage().isBlank()) {
            application.setStage("Applied");
        }

        if (application.getStatus() == null || application.getStatus().isBlank()) {
            application.setStatus("Pending");
        }

        User student = userRepository.findById((long) application.getStudentId())
            .orElseThrow(() -> new RuntimeException("Student not found"));

        Application saved = repository.save(application);

        if (driveStudentRepository.findByDriveIdAndStudentEmail(saved.getDriveId(), student.getEmail()).isEmpty()) {
            DriveStudent driveStudent = new DriveStudent();
            driveStudent.setDriveId(saved.getDriveId());
            driveStudent.setStudentName(student.getFullName());
            driveStudent.setStudentEmail(student.getEmail());
            driveStudent.setRoundIndex(1);
            driveStudent.setStatus(saved.getStatus());
            driveStudentRepository.save(driveStudent);
        }

        return saved;
    }

    // ✅ Get all applications
    public List<Application> getApplications() {
        return repository.findAll();  // Assuming findAll(), adjust if custom method
    }

    // ✅ Get applications by drive
    public List<Application> getApplicationsByDrive(Long driveId) {
        return repository.findByDriveId(driveId);
    }

    public List<Application> getApplicationsByStudent(int studentId) {
        return repository.findByStudentId(studentId);
    }

    // ✅ Update stage and status
    public Application updateStage(int id, String stage, String status) {
        Application app = repository.findById(id).orElseThrow(() -> new RuntimeException("Application not found"));
        app.setStage(stage);
        app.setStatus(status);
        return repository.save(app);
    }

    @Transactional
    public void syncDriveStudentProgress(Long driveId, String studentEmail, int roundIndex, String status) {
        if (studentEmail == null || studentEmail.isBlank()) {
            return;
        }

        userRepository.findByEmail(studentEmail)
            .flatMap(user -> repository.findByStudentIdAndDriveId(Math.toIntExact(user.getId()), driveId))
            .ifPresent(application -> {
                application.setStage(resolveStage(roundIndex, status));
                application.setStatus(resolveStatus(status));
                repository.save(application);
            });
    }

    @Transactional
    public void deleteApplication(int id) {
        Application application = repository.findById(id)
            .orElseThrow(() -> new RuntimeException("Application not found"));

        repository.delete(application);

        userRepository.findById((long) application.getStudentId())
            .map(User::getEmail)
            .ifPresent(studentEmail -> {
                List<DriveStudent> linkedEntries =
                    driveStudentRepository.findByDriveIdAndStudentEmail(application.getDriveId(), studentEmail);
                if (!linkedEntries.isEmpty()) {
                    driveStudentRepository.deleteAll(linkedEntries);
                }
            });
    }

    @Transactional
    public void deleteApplicationsByStudent(int studentId, String studentEmail) {
        List<Application> studentApplications = repository.findByStudentId(studentId);
        if (!studentApplications.isEmpty()) {
            repository.deleteAll(studentApplications);
        }

        if (studentEmail != null && !studentEmail.isBlank()) {
            List<DriveStudent> driveStudents = driveStudentRepository.findByStudentEmail(studentEmail);
            if (!driveStudents.isEmpty()) {
                driveStudentRepository.deleteAll(driveStudents);
            }
        }
    }

    private String resolveStage(int roundIndex, String status) {
        if (roundIndex <= 0) {
            return "Applied";
        }

        if ("Rejected".equalsIgnoreCase(status)) {
            return "Rejected in Round " + roundIndex;
        }

        if ("Selected".equalsIgnoreCase(status)) {
            return "Round " + roundIndex + " Cleared";
        }

        return "Round " + roundIndex;
    }

    private String resolveStatus(String status) {
        if (status == null || status.isBlank()) {
            return "Pending";
        }
        return status;
    }
}
