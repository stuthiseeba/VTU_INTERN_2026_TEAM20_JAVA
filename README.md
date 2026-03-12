# Recruitment Drive Management System
### VTU Internship 2026 — Team 20 | Java Full Stack

A complete backend REST API system for managing campus recruitment drives, student applications, eligibility filtering, and conversion analytics — integrated across Team 1 (Auth), Team 2 (Recruitment), and Team 3 (Frontend/Analytics).

---

## Table of Contents

- [Project Overview](#project-overview)
- [Team Structure](#team-structure)
- [Tech Stack](#tech-stack)
- [Project Architecture](#project-architecture)
- [Prerequisites](#prerequisites)
- [Setup & Installation](#setup--installation)
- [API Reference](#api-reference)
- [Database Schema](#database-schema)
- [Project Structure](#project-structure)
- [Known Issues Fixed](#known-issues-fixed)

---

## Project Overview

The Recruitment Drive Management System is a Spring Boot backend application integrated with a React frontend that enables:

- Secure user registration and login via JWT tokens (Team 1)
- Creation, updating, and deletion of recruitment drives (Team 2)
- Eligibility Engine — filters students based on CGPA, branch, graduation year, and skills (Team 2)
- Student application workflow with stage tracking (Team 2)
- Conversion Ratio Metrics — applicants vs selected, round-wise percentages (Team 2)
- React frontend dashboard showing drives, applications, and user profile (Team 3)
- Role-based access control: STUDENT, ADMIN, RECRUITER, HR

---

## Team Structure

| Team | Module | Responsibility |
|------|--------|---------------|
| Team 1 | Authentication Module | Signup, Login, JWT, Password Reset, User Profile |
| Team 2 | Recruitment & Application | Drives CRUD, Eligibility Engine, Application Workflow, Stage Tracking, Conversion Metrics |
| Team 3 | Frontend & Analytics | React Dashboard, Drive Display, Application Display |

---

## Tech Stack

### Backend
| Layer | Technology |
|-------|-----------|
| Language | Java 21+ |
| Framework | Spring Boot 3.3.5 |
| Security | Spring Security + JWT (jjwt 0.12.5) |
| ORM | Spring Data JPA + Hibernate 6 |
| Database | MySQL 8+ |
| Build Tool | Maven |
| API Testing | Postman |
| IDE | Eclipse |

### Frontend (Team 3)
| Layer | Technology |
|-------|-----------|
| Framework | React 19 (Vite) |
| HTTP Client | Axios |
| Routing | React Router DOM v7 |
| Styling | Custom CSS |

---

## Project Architecture

```
Browser (React - port 5173)
        │
        ▼ HTTP via Vite Proxy
┌─────────────────────────────┐
│      Controller Layer       │
│  AuthController   (Team 1)  │
│  UserController   (Team 1)  │
│  DriveController  (Team 2)  │
│  ApplicationCtrl  (Team 2)  │
│  StudentController(Team 2)  │
└────────────┬────────────────┘
             │
┌────────────▼────────────────┐
│       Service Layer         │
│  AuthService      (Team 1)  │
│  DriveService     (Team 2)  │
│  ApplicationSvc   (Team 2)  │  ← Eligibility Engine + Metrics
│  StudentService   (Team 2)  │
└────────────┬────────────────┘
             │
┌────────────▼────────────────┐
│     Repository Layer        │
└────────────┬────────────────┘
             │
┌────────────▼────────────────┐
│   MySQL — recruitment_system│
│  users, drive,              │
│  student, application       │
└─────────────────────────────┘

Security:
Public:    /api/auth/**
Protected: all other endpoints → require Bearer JWT token
```

---

## Prerequisites

| Software | Version | Download |
|----------|---------|----------|
| JDK | 21+ | https://www.oracle.com/java/technologies/downloads/ |
| MySQL | 8.0+ | https://dev.mysql.com/downloads/ |
| Maven | 3.8+ | https://maven.apache.org/download.cgi |
| Eclipse IDE | 2023+ | https://www.eclipse.org/downloads/ |
| Node.js | 18+ | https://nodejs.org/en/download |
| Postman | Latest | https://www.postman.com/downloads/ |
| Git | Latest | https://git-scm.com/downloads |

---

## Setup & Installation

### Backend — Spring Boot

**Step 1 — Clone the Repository**
```bash
git clone https://github.com/stuthiseeba/VTU_INTERN_2026_TEAM20_JAVA.git
cd VTU_INTERN_2026_TEAM20_JAVA
```

**Step 2 — Create MySQL Database**
```sql
CREATE DATABASE recruitment_system;
```

**Step 3 — Configure application.properties**

Open `src/main/resources/application.properties`:
```properties
spring.datasource.url=jdbc:mysql://localhost:3306/recruitment_system
spring.datasource.username=root
spring.datasource.password=YOUR_MYSQL_PASSWORD

spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
spring.jpa.open-in-view=false

jwt.secret=R3cruitmentDriv3ManagementSyst3mVTU2026SecureK3y!
jwt.expiration=86400000

spring.autoconfigure.exclude=org.springframework.boot.autoconfigure.security.servlet.UserDetailsServiceAutoConfiguration
```
> ⚠️ Replace `YOUR_MYSQL_PASSWORD` with your actual MySQL root password.

**Step 4 — Import into Eclipse**
1. `File → Import → Maven → Existing Maven Projects`
2. Browse to project folder → Finish
3. Right-click project → `Maven → Update Project → Force Update → OK`

**Step 5 — Run**
Right-click `PlacementSystemApplication.java` → `Run As → Java Application`

Console should show:
```
Tomcat started on port 8080 (http)
Started PlacementSystemApplication in X seconds
```

---

### Frontend — React (Team 3)

**Step 1 — Go to frontend folder**
```cmd
cd PAT\pat-ui
```

**Step 2 — Install dependencies**
```cmd
npm install
```

**Step 3 — Run**
```cmd
npm run dev
```

Open browser: `http://localhost:5173`

> ⚠️ Spring Boot must be running on port 8080 before starting the frontend.

---

## API Reference

### Team 1 — Authentication APIs
> Public — no token required.

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/signup` | Register new user |
| POST | `/api/auth/login` | Login and get JWT token |
| POST | `/api/auth/forgot-password` | Request password reset |
| POST | `/api/auth/reset-password` | Reset password with token |

**Signup body:**
```json
{
  "fullName": "John Doe",
  "email": "john@example.com",
  "password": "123456",
  "phoneNumber": "9876543210",
  "role": "STUDENT"
}
```
Roles: `STUDENT`, `ADMIN`, `RECRUITER`, `HR`

**Login body:**
```json
{ "email": "john@example.com", "password": "123456" }
```
Returns: `{ token, id, email, fullName, role, isVerified }`

---

### Team 1 — User APIs
> Requires JWT Bearer token.

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/users/profile` | Get logged-in user profile |
| POST | `/api/users/verify/{userId}` | Verify a user (Admin only) |

---

### Team 2 — Drive APIs
> Requires JWT Bearer token.

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/drives` | Create a new drive |
| GET | `/drives` | Get all drives |
| GET | `/drives/{id}` | Get drive by ID |
| PUT | `/drives/{id}` | Update a drive |
| DELETE | `/drives/{id}` | Delete a drive |

**Create/Update Drive body:**
```json
{
  "companyName": "Google",
  "role": "SDE",
  "packageAmount": 25.5,
  "location": "Bangalore",
  "minCgpa": 8.0,
  "eligibleBranches": "CSE,ISE",
  "graduationYear": 2026,
  "requiredSkills": "Java,SQL"
}
```

---

### Team 2 — Application APIs
> Requires JWT Bearer token.

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/applications` | Apply for a drive (with eligibility check) |
| GET | `/applications` | Get all applications |
| GET | `/applications/drive/{driveId}` | Get applications by drive |
| PUT | `/applications/{id}?stage=X&status=Y` | Update stage and status |
| GET | `/applications/eligibility?studentId=1&driveId=1` | Check student eligibility |
| GET | `/applications/eligible-students/{driveId}` | List eligible students for a drive |
| GET | `/applications/metrics` | Overall conversion metrics |
| GET | `/applications/metrics/{driveId}` | Metrics for a specific drive |

**Stage Workflow:**
| Stage | Status Options |
|-------|---------------|
| `Applied` | `Pending` |
| `Shortlisted` | `In Progress` |
| `Technical` | `Scheduled`, `Completed` |
| `HR` | `Scheduled`, `Completed` |
| `Final` | `Selected`, `Rejected` |

---

### Team 2 — Student APIs
> Requires JWT Bearer token.

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/students` | Add a student |
| GET | `/students` | Get all students |

**Add Student body:**
```json
{
  "name": "John Doe",
  "email": "john@college.edu",
  "cgpa": 8.5,
  "branch": "CSE",
  "graduationYear": 2026,
  "skills": "Java,SQL,Python"
}
```

---

## Database Schema

```sql
-- Team 1
users (
  id, email, password, full_name, phone_number,
  role, is_verified, is_active,
  reset_token, reset_token_expiry, created_at, updated_at
)

-- Team 2
drive (
  drive_id, company_name, role, package_amount, location,
  min_cgpa, eligible_branches, graduation_year, required_skills
)

student (
  student_id, name, email, cgpa, branch,
  graduation_year, skills
)

application (
  application_id, student_id, drive_id, stage, status
)
```

---

## Project Structure

```
src/main/java/com/recruitment/placement_system/
├── PlacementSystemApplication.java
├── config/
│   └── SecurityConfig.java
├── controller/
│   ├── AuthController.java           ← Team 1
│   ├── UserController.java           ← Team 1
│   ├── DriveController.java          ← Team 2 (updated)
│   ├── ApplicationController.java    ← Team 2 (updated)
│   └── StudentController.java        ← Team 2
├── dto/
│   ├── SignupRequest.java
│   ├── LoginRequest.java
│   ├── AuthResponse.java
│   ├── ApiResponse.java
│   ├── ForgotPasswordRequest.java
│   ├── ResetPasswordRequest.java
│   └── ConversionMetrics.java        ← Team 2 (new)
├── entity/
│   ├── User.java
│   ├── Role.java
│   ├── Drive.java                    ← Team 2 (updated: eligibility fields)
│   ├── Student.java                  ← Team 2 (updated: graduationYear, skills)
│   └── Application.java
├── exception/
│   └── GlobalExceptionHandler.java
├── repository/
│   ├── UserRepository.java
│   ├── DriveRepository.java
│   ├── StudentRepository.java
│   └── ApplicationRepository.java   ← Team 2 (updated: findByDriveId)
├── security/
│   ├── JwtUtil.java
│   └── JwtAuthenticationFilter.java
└── service/
    ├── AuthService.java              ← Team 1
    ├── DriveService.java             ← Team 2 (updated: update/delete)
    ├── ApplicationService.java       ← Team 2 (updated: eligibility + metrics)
    └── StudentService.java

Frontend — PAT/pat-ui/src/
├── api.js                            ← Axios with JWT interceptor
├── App.jsx                           ← Routes
├── App.css                           ← Styles
└── pages/
    ├── Login.jsx                     ← Team 1 integration
    ├── Register.jsx                  ← Team 1 integration
    └── Dashboard.jsx                 ← Team 2 + Team 3 integration
```

---

## Known Issues Fixed

| # | File | Bug | Fix |
|---|------|-----|-----|
| 1 | `GlobalExceptionHandler.java` | Wrong import from Team 1 old package | Fixed import path |
| 2 | `AuthService.java` | Missing User import | Added import |
| 3 | `SecurityConfig.java` | Typo in csrf disable | Fixed typo |
| 4 | `application.properties` | JWT secret too short | Replaced with 48-char key |
| 5 | All DTOs/entities | Lombok not installed in Eclipse | Replaced with explicit getters/setters |
| 6 | `target/classes/` | Stale compiled class files | Fixed with mvn clean |
| 7 | `Drive.java` | Missing eligibility fields | Added minCgpa, eligibleBranches, graduationYear, requiredSkills |
| 8 | `Student.java` | Missing graduationYear and skills | Added both fields |
| 9 | `ApplicationService.java` | No eligibility check on apply | Added full eligibility engine |
| 10 | `ConversionMetrics.java` | File name case mismatch in Eclipse | Renamed to correct PascalCase |
| 11 | `api.js` | Frontend pointed to Node.js port 5001 | Updated to use Vite proxy → port 8080 |
| 12 | `Register.jsx` | Wrong field names and role values | Fixed fullName, phoneNumber, STUDENT/ADMIN roles |

---

## Authors

- **Team 20** — VTU Internship 2026
- Module: Java Full Stack — Recruitment Drive Management System
- Integration: Team 1 (Auth) + Team 2 (Recruitment) + Team 3 (Frontend)
