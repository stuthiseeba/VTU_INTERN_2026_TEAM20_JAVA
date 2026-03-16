# Placement Automation Tool (PAT)

A full-stack campus placement management platform built with React (frontend) and Spring Boot (backend), connected to a MySQL database.

---

## Project Overview

PAT is a web application that streamlines the entire campus placement process for students, coordinators, TPOs, and HR teams. It provides role-based dashboards, drive management, student profile tracking, and public-facing content management.

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, Vite, CSS |
| Backend | Spring Boot 3.2, Java 17 |
| Database | MySQL 8 |
| ORM | Spring Data JPA / Hibernate |
| Security | Spring Security, BCrypt password hashing |
| Build Tools | Maven (backend), npm (frontend) |

---

## Features Implemented

### Public Homepage
- Sticky navbar with role-based login dropdown
- Hero section with campus background
- "What We Offer" cards: Announcements, About Companies, Drive Schedules, Partnerships, Global Footprints
- Each card fetches and displays content posted by the Coordinator

### Authentication
- User registration with role selection (Student, Coordinator, TPO, Admin, HR)
- Login with role-based dashboard redirect
- Passwords stored as BCrypt hashes (encrypted) in the database

### Student Dashboard
- Overview with stats
- My Profile — personal info, phone, LinkedIn, address, graduation year
- Academic Records — CGPA, 10th, 12th, Degree details
- Identification — Aadhaar number
- Skills & Certificates — add/remove soft and technical skills
- Applied Drives — placeholder for future drive applications
- All profile data saved to and loaded from the backend

### Coordinator Dashboard
- Overview with student stats
- Students tab — view all registered students, view profile details, delete students
- Content management tabs: Announcements, About Companies, Drive Schedules, Partnerships, Global Footprints
- All content posted here appears on the public homepage cards

### TPO Dashboard
- Create Drive — company, role, date, time, venue, eligibility, rounds
- All Drives — view and delete drives
- Drive Funnel — manage students through each round (add, select, reject, promote to next round)
- Finally Selected Students section per drive

---

## Project Structure

```
PAT/
├── backend/                        # Spring Boot backend
│   ├── src/main/java/com/pat/placement/
│   │   ├── controller/             # REST API controllers
│   │   │   ├── AuthController.java
│   │   │   ├── ContentController.java
│   │   │   ├── DriveController.java
│   │   │   └── StudentProfileController.java
│   │   ├── model/                  # JPA entity models
│   │   │   ├── User.java
│   │   │   ├── StudentProfile.java
│   │   │   ├── ContentItem.java
│   │   │   ├── Drive.java
│   │   │   └── DriveStudent.java
│   │   ├── repository/             # Spring Data JPA repositories
│   │   ├── SecurityConfig.java     # BCrypt + Spring Security config
│   │   └── PlacementApplication.java
│   ├── src/main/resources/
│   │   └── application.properties  # DB config (update with your credentials)
│   └── pom.xml
│
├── src/                            # React frontend
│   ├── pages/
│   │   ├── HomePage.jsx
│   │   ├── InfoPage.jsx
│   │   ├── LoginPage.jsx
│   │   ├── SignupPage.jsx
│   │   ├── StudentDashboard.jsx
│   │   ├── CoordinatorDashboard.jsx
│   │   └── TpoDashboard.jsx
│   ├── App.jsx                     # Main app with page routing
│   ├── App.css                     # Global styles (orange theme)
│   └── main.jsx                    # React entry point
│
├── index.html                      # Vite HTML entry
├── package.json                    # Frontend dependencies
├── .gitignore
└── README.md
```

---

## Database Tables

| Table | Description |
|-------|-------------|
| `users` | All registered users with role and BCrypt hashed password |
| `student_profile` | Extended student profile data |
| `content_items` | Homepage content posted by coordinators |
| `drives` | Placement drives created by TPO |
| `drive_students` | Students in each round of a drive |

---

## API Endpoints

### Auth — `/api/auth`
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/register` | Register a new user |
| POST | `/login` | Login and get role + userId |
| GET | `/students` | Get all students |
| DELETE | `/students/{id}` | Delete a student |

### Student Profile — `/api/student`
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/profile` | Save student profile |
| GET | `/profile/{userId}` | Get student profile |

### Content — `/api/content`
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/` | Add content item |
| GET | `/{type}` | Get content by type |
| DELETE | `/{id}` | Delete content item |

### TPO / Drives — `/api/tpo`
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/drive` | Create a drive |
| GET | `/drives/{tpoUserId}` | Get drives by TPO |
| DELETE | `/drive/{driveId}` | Delete a drive |
| POST | `/drive/student` | Add student to a round |
| PUT | `/drive/student/{id}/status` | Update student status |
| POST | `/drive/student/promote` | Promote student to next round |
| GET | `/drive/{driveId}/students` | Get all students in a drive |

---

## Setup Instructions

### Prerequisites
- Java 17+
- Node.js 18+
- MySQL 8
- Maven

### 1. Database Setup
Create a MySQL database:
```sql
CREATE DATABASE patdatabase_db;
```

### 2. Backend Setup
Update `backend/src/main/resources/application.properties` with your MySQL credentials:
```properties
spring.datasource.url=jdbc:mysql://localhost:3306/patdatabase_db
spring.datasource.username=root
spring.datasource.password=YOUR_PASSWORD
```

Start the backend:
```bash
cd backend
mvn spring-boot:run
```
Backend runs on `http://localhost:8080`

### 3. Frontend Setup
```bash
npm install
npm run dev
```
Frontend runs on `http://localhost:5173`

### 4. Every Time You Start
1. Start MySQL service
2. Run `mvn spring-boot:run` in the `backend/` folder
3. Run `npm run dev` in the project root

---

## Default Roles
Register accounts with these roles via the signup page:
- `STUDENT`
- `COORDINATOR`
- `TPO`
- `ADMIN`
- `HR`

---

## Notes
- Passwords are BCrypt encrypted — never stored as plain text
- Tables are auto-created by Hibernate on first run
- CORS is enabled for all origins (development mode)
- The old `index.html` in the root is the original single-file version kept as backup
