package com.recruitment.placement_system.controller;

import com.recruitment.placement_system.entity.StudentProfile;
import com.recruitment.placement_system.repository.StudentProfileRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.Optional;

// ✅ Team 3 - Student profile CRUD
@RestController
@RequestMapping("/api/student")
@CrossOrigin(origins = "*")
public class StudentProfileController {

    @Autowired
    private StudentProfileRepository profileRepository;

    @PostMapping("/profile")
    public ResponseEntity<?> saveProfile(@RequestBody Map<String, String> body) {
        Long userId = Long.parseLong(body.get("userId"));

        StudentProfile profile = profileRepository.findByUserId(userId)
            .orElse(new StudentProfile());

        profile.setUserId(userId);
        profile.setPhone(body.get("phone"));
        profile.setLinkedin(body.get("linkedin"));
        profile.setAddress(body.get("address"));
        profile.setResumeLink(body.get("resumeLink"));
        profile.setCgpa(body.get("cgpa"));
        profile.setDepartment(body.get("department"));
        profile.setCollege(body.get("college"));
        profile.setSchool10(body.get("school10"));
        profile.setScore10(body.get("score10"));
        profile.setYear10(body.get("year10"));
        profile.setSchool12(body.get("school12"));
        profile.setScore12(body.get("score12"));
        profile.setYear12(body.get("year12"));
        profile.setDegreeName(body.get("degreeName"));
        profile.setSpecialization(body.get("specialization"));
        profile.setYearDegree(body.get("yearDegree"));
        profile.setAadharNumber(body.get("aadharNumber"));
        profile.setSoftSkills(body.get("softSkills"));
        profile.setTechSkills(body.get("techSkills"));

        profileRepository.save(profile);
        return ResponseEntity.ok(Map.of("message", "Profile saved successfully"));
    }

    @GetMapping("/profile/{userId}")
    public ResponseEntity<?> getProfile(@PathVariable Long userId) {
        Optional<StudentProfile> profile = profileRepository.findByUserId(userId);
        if (profile.isPresent()) {
            return ResponseEntity.ok(profile.get());
        }
        return ResponseEntity.ok(Map.of("message", "No profile found"));
    }
}