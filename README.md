# Recruitment Drive Management System
### VTU Internship 2026 — Team 20 | Java Full Stack

A complete backend REST API system for managing campus recruitment drives, student applications, eligibility filtering, and conversion analytics — integrated across Team 1 (Auth), Team 2 (Recruitment), and Team 3 (Frontend/Analytics).

---

## Table of Contents

- [Project Overview](#project-overview)
- [Tech Stack](#tech-stack)
- [Project Architecture](#project-architecture)
- [Prerequisites](#prerequisites)
- [Setup & Installation](#setup--installation)
- [API Reference](#api-reference)
- [Database Schema](#database-schema)
- [Project Structure](#project-structure)

---

## Project Overview

The Recruitment Drive Management System is a Spring Boot backend application integrated with a React frontend that enables:

- Secure user registration with **OTP-based email verification** and login via JWT tokens (Team 1)
- Creation, updating, and deletion of recruitment drives (Team 2)
- Eligibility Engine — filters students based on CGPA, branch, graduation year, and skills (Team 2)
- Student application workflow with stage tracking (Team 2)
- Conversion Ratio Metrics — applicants vs selected, round-wise percentages (Team 2)
- React frontend with **React Router** — dedicated URLs per page (Team 3)
- **Dark / Light theme toggle** — charcoal grey dark mode, persisted across sessions (Team 3)
- Role-based access control: STUDENT, COORDINATOR, TPO, ADMIN, HR

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
| Email | Spring Mail + Gmail SMTP (OTP delivery) |
| API Testing | Postman |
| IDE | Eclipse |

### Frontend (Team 3)
| Layer | Technology |
|-------|-----------|
| Framework | React 19 (Vite) |
| Routing | React Router DOM v6 |
| HTTP Client | Fetch API via Vite proxy |
| Styling | Custom CSS with CSS variables (light/dark themes) |

---

## Project Architecture

```
Browser (React - port 5173)
        │
        ▼ HTTP via Vite Proxy (/api → 8080)
┌──────────────────────────────────────┐
│         Controller Layer             │
│  AuthController                      │
│  UserController                      │
│  ContentController                   │
│  DriveController                     │
│  TpoDriveController                  │ 
│  ApplicationController               │
│  StudentController                   │
│  StudentProfileController            │
└───────────────┬──────────────────────┘
                │
┌───────────────▼──────────────────────┐
│            Service Layer             │
│  AuthService                         │ ← OTP + Email Verification
│  EmailService                        │ ← Gmail SMTP
│  DriveService                        │
│  ApplicationService                  │ ← Eligibility Engine + Metrics
│  StudentService                      │
└───────────────┬──────────────────────┘
                │
┌───────────────▼──────────────────────┐
│          Repository Layer            │
│  UserRepository                      │
│  DriveRepository                     │
│  StudentRepository                   │
│  StudentProfileRepository            │
│  ApplicationRepository               │
│  ContentItemRepository               │
│  DriveStudentRepository              │
│  PatDriveRepository                  │
└───────────────┬──────────────────────┘
                │
┌───────────────▼──────────────────────┐
│             Database (MySQL)         │
│  users                               │
│  roles                               │
│  drives                              │
│  students                            │
│  student_profiles                    │
│  applications                        │ 
│  content_items                       │
│  drive_students                      │
│  pat_drives                          │
└──────────────────────────────────────┘
```

🔐 Security Layer (Cross-Cutting)
--------------------------------
- JwtAuthenticationFilter
- JwtUtil
- SecurityConfig

Public Endpoints:
  /api/auth/**

Protected Endpoints:
  All other APIs → require Bearer JWT token
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

**Step 3 — Fix role column if needed**

If you get a `Data truncated for column 'role'` error, run this once:
```sql
ALTER TABLE users MODIFY COLUMN role VARCHAR(20) NOT NULL;
```

**Step 4 — Configure application.properties**

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

# Gmail SMTP — for OTP emails (optional but recommended)
# Generate an App Password at myaccount.google.com/apppasswords
spring.mail.host=smtp.gmail.com
spring.mail.port=587
spring.mail.username=YOUR_GMAIL@gmail.com
spring.mail.password=YOUR_16_CHAR_APP_PASSWORD
spring.mail.properties.mail.smtp.auth=true
spring.mail.properties.mail.smtp.starttls.enable=true
```

> ⚠️ Replace `YOUR_MYSQL_PASSWORD` with your actual MySQL root password.  
> ⚠️ Recommended: use a Google App Password, not your normal Gmail password.  
> ⚠️ If Gmail SMTP is not configured, OTPs are printed to the console unless `app.mail.strict-delivery=true`.

**Recommended Google App Password setup**
```properties
GOOGLE_APP_EMAIL=yourgmail@gmail.com
GOOGLE_APP_PASSWORD=your16characterapppassword
APP_MAIL_STRICT_DELIVERY=true
```

Sample file:
`src/main/resources/application-gmail.properties.example`

**Step 5 — Import into Eclipse**
1. `File → Import → Maven → Existing Maven Projects`
2. Browse to project folder → Finish
3. Right-click project → `Maven → Update Project → Force Update → OK`

**Step 6 — Run**  
Right-click `PlacementSystemApplication.java` → `Run As → Java Application`

Console should show:
```
Tomcat started on port 8080 (http)
Started PlacementSystemApplication in X seconds
```

---

### Frontend — React 

**Step 1 — Go to frontend folder**
```cmd
cd PAT
```

**Step 2 — Install dependencies**
```cmd
npm install
```

> ⚠️ Run `npm install` once after cloning, and again whenever `package.json` changes (e.g. after pulling updates that added `react-router-dom`).

**Step 3 — Run**
```cmd
npm run dev
```

Open browser: `http://localhost:5173`

> ⚠️ Spring Boot must be running on port 8080 before starting the frontend.

---

### Frontend Pages & URLs

| URL | Page | Access |
|-----|------|--------|
| `localhost:5173/` | Home Page | Public |
| `localhost:5173/login` | Login | Public |
| `localhost:5173/signup` | Sign Up | Public |
| `localhost:5173/student` | Student Dashboard | Login required |
| `localhost:5173/tpo` | TPO Dashboard | Login required |
| `localhost:5173/coordinator` | Coordinator Dashboard | Login required |
| `localhost:5173/info/:key` | Info Pages | Public |

> Protected routes redirect to `/login` if not authenticated.  
> Login session persists across page refreshes via `localStorage`.

---

### Theme Toggle

A 🌙 / ☀️ floating button appears in the bottom-right corner on every page. Click it to switch between:
- **Light mode** — warm grey (`#f4f0ec`) background, high-contrast cards and borders
- **Dark mode** — charcoal grey (`#1a1a1a`) background, clean `#242424` cards

Theme preference is saved to `localStorage` and persists across sessions.

---

## API Reference

### Team 1 — Authentication APIs
> Public — no token required.

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/signup` | Register new user, sends OTP to email |
| POST | `/api/auth/verify-otp` | Verify OTP and activate account |
| POST | `/api/auth/resend-otp` | Resend OTP to email |
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
Roles: `STUDENT`, `COORDINATOR`, `TPO`, `ADMIN`, `HR`

> ⚠️ Field must be `fullName` (not `name`). Role must be uppercase.

**Signup flow:**
1. POST `/api/auth/signup` → OTP sent to email (or printed to Eclipse console if email not configured)
2. POST `/api/auth/verify-otp` with `{ "email": "...", "otp": "123456" }` → account activated
3. POST `/api/auth/login` → returns JWT token

**Login body:**
```json
{ "email": "john@example.com", "password": "123456" }
```
Returns: `{ token, id, email, fullName, role, isVerified }`

> ⚠️ Login is blocked until OTP is verified.

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
will add at the end

## Project Structure

```
BACKEND

src/main/java/com/recruitment/placement_system/
├── PlacementSystemApplication.java
├── config/
│   └── SecurityConfig.java
├── controller/
│   ├── AuthController.java           
|   ├── ContentController.java
│   ├── UserController.java           
│   ├── DriveController.java          
│   ├── ApplicationController.java    
│   ├── StudentController.java        
│   ├── StudentProfileController.java
│   └── TpoDriveController.java
├── dto/
│   ├── SignupRequest.java            
│   ├── LoginRequest.java
│   ├── AuthResponse.java
│   ├── ApiResponse.java
│   ├── ForgotPasswordRequest.java
│   ├── ResetPasswordRequest.java
│   └── ConversionMetrics.java        
├── entity/
│   ├── User.java                     ← includes otp, otpExpiry fields
│   ├── Role.java                     ← STUDENT, COORDINATOR, TPO, ADMIN, HR
│   ├── Drive.java                    ← includes eligibility fields
│   ├── Student.java                  ← includes graduationYear, skills
│   ├── Application.java
│   ├── ContentItem.java
│   ├── DriveStudent.java
│   ├── PatDrive.java
│   └── StudentProfile.java
├── exception/
│   └── GlobalExceptionHandler.java
├── repository/
│   ├── UserRepository.java
│   ├── DriveRepository.java
│   ├── DriveStudentRepository.java
│   ├── PatDriveRepository.java
│   ├── StudentRepository.java
│   ├── StudentProfileRepository.java
│   ├── ContentItemRepository.java
│   └── ApplicationRepository.java
├── security/
│   ├── JwtUtil.java
│   └── JwtAuthenticationFilter.java
└── service/
    ├── AuthService.java              ← OTP generation + email verification
    ├── EmailService.java             ← Gmail SMTP OTP delivery
    ├── DriveService.java             
    ├── ApplicationService.java       ← Eligibility Engine + Metrics
    └── StudentService.java


src/main/resources
├── ├── application-gmail.properties.example
    └── application.properties
```


```
FRONTEND

PAT
├── src/
    ├── App.jsx                           ← React Router + theme toggle + localStorage auth
    ├── App.css                           ← CSS variables (light/dark themes)
    └── pages/
        ├── HomePage.jsx
        ├── LoginPage.jsx                 ← JWT login
        ├── SignupPage.jsx                ← OTP signup flow
        ├── InfoPage.jsx
        ├── StudentDashboard.jsx          
        ├── TpoDashboard.jsx              
        └── CoordinatorDashboard.jsx
├── App.css
├── App.jsx
├── index.css
└── main.jsx     
```



---


