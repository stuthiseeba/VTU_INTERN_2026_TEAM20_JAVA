# How to Use — Recruitment Drive Management System
### VTU Internship 2026 — Team 20
### Integration: Team 1 (Auth) + Team 2 (Recruitment) + Team 3 (Frontend)

---

## Starting the System

### Step 1 — Start MySQL
Make sure MySQL service is running. Open MySQL Workbench and verify you can connect.

### Step 2 — Start Spring Boot Backend
- Open Eclipse
- Right-click `PlacementSystemApplication.java` → `Run As → Java Application`
- Wait for console:
```
Tomcat started on port 8080 (http)
Started PlacementSystemApplication in X seconds
```

### Step 3 — Start React Frontend (Team 3)
Open Command Prompt:
```cmd
cd PAT\pat-ui
npm run dev
```
Open browser: `http://localhost:5173`

---

## Using the Frontend (Team 3)

### Register
1. Open `http://localhost:5173`
2. Click **Register**
3. Fill in Full Name, Email, Password, Phone Number
4. Select Role (STUDENT / ADMIN / RECRUITER / HR)
5. Click **Register** → redirected to Login

### Login
1. Enter Email and Password
2. Click **Login** → redirected to Dashboard

### Dashboard
Shows three sections:
- **Profile Card** — your name, email, role, phone, verification status
- **Recruitment Drives** — all active drives with company, role, package, location
- **Applications** — all applications with stage and color-coded status
- **Logout** button (red) — clears session and returns to login

---

## Using Postman (API Testing)

### Setup
1. Open Postman
2. For every request: click **Headers** tab → add `Content-Type: application/json`
3. For protected requests: click **Authorization** tab → select **Bearer Token** → paste token

---

## Team 1 — Auth API Flows

### Flow 1: Register a New User
```
Method:  POST
URL:     http://localhost:8080/api/auth/signup
Headers: Content-Type: application/json
Body (raw JSON):
{
  "fullName": "Eknath Revankar",
  "email": "eknath@example.com",
  "password": "123456",
  "phoneNumber": "9876543210",
  "role": "STUDENT"
}
```
Expected: `200 OK` with `{ message: "User registered successfully" }`

---

### Flow 2: Login
```
Method:  POST
URL:     http://localhost:8080/api/auth/login
Headers: Content-Type: application/json
Body:
{
  "email": "eknath@example.com",
  "password": "123456"
}
```
Expected: `200 OK` with token
```json
{
  "token": "eyJhbGciOiJIUzI1NiJ9...",
  "email": "eknath@example.com",
  "fullName": "Eknath Revankar",
  "role": "STUDENT"
}
```
**Copy the token — you need it for all other requests.**

---

### Flow 3: Get Profile
```
Method:        GET
URL:           http://localhost:8080/api/users/profile
Authorization: Bearer Token → paste your token
```
Expected: `200 OK` with user details

---

## Team 2 — Drive Management API Flows

### Flow 4: Create a Drive with Eligibility Criteria
```
Method:        POST
URL:           http://localhost:8080/drives
Authorization: Bearer Token → paste your token
Headers:       Content-Type: application/json
Body:
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
Expected: `200 OK` with created drive including `driveId`

---

### Flow 5: Get All Drives
```
Method:        GET
URL:           http://localhost:8080/drives
Authorization: Bearer Token
```

---

### Flow 6: Update a Drive
```
Method:        PUT
URL:           http://localhost:8080/drives/1
Authorization: Bearer Token
Headers:       Content-Type: application/json
Body:          (same as create drive — include all fields)
```

---

### Flow 7: Delete a Drive
```
Method:        DELETE
URL:           http://localhost:8080/drives/1
Authorization: Bearer Token
```

---

## Team 2 — Student API Flows

### Flow 8: Add a Student
```
Method:        POST
URL:           http://localhost:8080/students
Authorization: Bearer Token
Headers:       Content-Type: application/json
Body:
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

### Flow 9: Get All Students
```
Method:        GET
URL:           http://localhost:8080/students
Authorization: Bearer Token
```

---

## Team 2 — Eligibility Engine API Flows

### Flow 10: Check if a Student is Eligible for a Drive
```
Method:        GET
URL:           http://localhost:8080/applications/eligibility?studentId=1&driveId=1
Authorization: Bearer Token
```
Expected response (eligible):
```json
{
  "studentId": 1,
  "driveId": 1,
  "studentName": "John Doe",
  "companyName": "Google",
  "eligible": true,
  "reasons": ["All criteria met"]
}
```
Expected response (not eligible):
```json
{
  "eligible": false,
  "reasons": ["CGPA 6.5 is below required 8.0", "Branch MECH is not eligible"]
}
```

---

### Flow 11: Get All Eligible Students for a Drive
```
Method:        GET
URL:           http://localhost:8080/applications/eligible-students/1
Authorization: Bearer Token
```
Returns list of students who meet all eligibility criteria for drive ID 1.

---

## Team 2 — Application Workflow API Flows

### Flow 12: Apply for a Drive
```
Method:        POST
URL:           http://localhost:8080/applications
Authorization: Bearer Token
Headers:       Content-Type: application/json
Body:
{
  "studentId": 1,
  "driveId": 1
}
```
Auto-checks eligibility — if student doesn't qualify, returns error.
If eligible: `stage = "Applied"`, `status = "Pending"` automatically.

---

### Flow 13: Move Application Through Stages
```
Method:        PUT
URL:           http://localhost:8080/applications/1?stage=Shortlisted&status=In Progress
Authorization: Bearer Token
```

Full recruitment workflow:
```
POST /applications                              → stage: Applied,      status: Pending
PUT  /applications/1?stage=Shortlisted&status=In Progress
PUT  /applications/1?stage=Technical&status=Scheduled
PUT  /applications/1?stage=Technical&status=Completed
PUT  /applications/1?stage=HR&status=Scheduled
PUT  /applications/1?stage=HR&status=Completed
PUT  /applications/1?stage=Final&status=Selected   ← or Rejected
```

---

### Flow 14: Get Applications by Drive
```
Method:        GET
URL:           http://localhost:8080/applications/drive/1
Authorization: Bearer Token
```

---

## Team 2 — Conversion Metrics API Flows

### Flow 15: Overall Conversion Metrics
```
Method:        GET
URL:           http://localhost:8080/applications/metrics
Authorization: Bearer Token
```
Expected response:
```json
{
  "totalApplicants": 8,
  "totalSelected": 2,
  "totalRejected": 1,
  "totalPending": 5,
  "overallConversionRate": 25.0,
  "roundWiseStats": {
    "Applied": {
      "total": 3, "selected": 0, "rejected": 0,
      "pending": 3, "conversionRate": 0.0
    },
    "Final": {
      "total": 3, "selected": 2, "rejected": 1,
      "pending": 0, "conversionRate": 66.67
    }
  }
}
```

---

### Flow 16: Metrics for a Specific Drive
```
Method:        GET
URL:           http://localhost:8080/applications/metrics/1
Authorization: Bearer Token
```
Returns same format but filtered for drive ID 1 only.

---

## Common Errors & Fixes

| Error | Cause | Fix |
|-------|-------|-----|
| `403 Forbidden` | No token sent | Add Bearer Token in Authorization tab |
| `401 Unauthorized` | Token expired | Login again and get new token |
| `Student not eligible` | Eligibility check failed | Check student's CGPA/branch/skills vs drive requirements |
| `Student not found` | Wrong studentId | Check `/students` to get correct IDs |
| `Drive not found` | Wrong driveId | Check `/drives` to get correct IDs |
| `Invalid credentials` | Wrong email/password | Re-check credentials |
| `Using generated security password` in console | JWT secret issue or compilation error | Run `mvn clean`, check application.properties |

---

## Complete Endpoint Summary

| Method | Endpoint | Team | Auth Required |
|--------|----------|------|--------------|
| POST | `/api/auth/signup` | Team 1 | No |
| POST | `/api/auth/login` | Team 1 | No |
| POST | `/api/auth/forgot-password` | Team 1 | No |
| POST | `/api/auth/reset-password` | Team 1 | No |
| GET | `/api/users/profile` | Team 1 | Yes |
| POST | `/api/users/verify/{id}` | Team 1 | Yes (Admin) |
| POST | `/drives` | Team 2 | Yes |
| GET | `/drives` | Team 2 | Yes |
| GET | `/drives/{id}` | Team 2 | Yes |
| PUT | `/drives/{id}` | Team 2 | Yes |
| DELETE | `/drives/{id}` | Team 2 | Yes |
| POST | `/students` | Team 2 | Yes |
| GET | `/students` | Team 2 | Yes |
| POST | `/applications` | Team 2 | Yes |
| GET | `/applications` | Team 2 | Yes |
| GET | `/applications/drive/{driveId}` | Team 2 | Yes |
| PUT | `/applications/{id}` | Team 2 | Yes |
| GET | `/applications/eligibility` | Team 2 | Yes |
| GET | `/applications/eligible-students/{driveId}` | Team 2 | Yes |
| GET | `/applications/metrics` | Team 2 | Yes |
| GET | `/applications/metrics/{driveId}` | Team 2 | Yes |
