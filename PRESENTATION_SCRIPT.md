# Presentation Script — Frontend Demo
## Recruitment Drive Management System
### VTU Internship 2026 — Team 20

---

## BEFORE YOU START — CHECKLIST

- [ ] Spring Boot is running (Eclipse console shows port 8080)
- [ ] Frontend is running (npm run dev — browser at localhost:5173)
- [ ] MySQL is running
- [ ] Browser is open at http://localhost:5173
- [ ] Postman is open (in case you need to show APIs)
- [ ] Screen is mirrored/projected properly

---

## OPENING (30 seconds)

> "Good morning/afternoon everyone. I am [YOUR NAME] from Team 20.
> Today I will be presenting the Frontend of our
> Recruitment Drive Management System — built as part of
> the VTU Internship 2026 Java Full Stack project.
>
> Our system is a complete end-to-end placement automation tool
> that integrates three modules —
> Team 1 handles Authentication,
> Team 2 handles Recruitment and Applications — which is my module,
> and Team 3 handles the Frontend and Analytics.
>
> Let me now walk you through the working system."

---

## PART 1 — SHOW THE TECH STACK (1 minute)

> "Before the demo, a quick overview of what we used."

SAY:
> "The backend is built using Spring Boot 3.3.5 with Java 21,
> secured using JWT authentication, with MySQL as the database
> and Spring Data JPA for all database operations.
>
> The frontend is built using React 19 with Vite,
> Axios for API calls, and React Router for navigation.
>
> The frontend runs on port 5173 and communicates with
> the Spring Boot backend on port 8080 through a Vite proxy —
> which handles all the CORS configuration automatically."

---

## PART 2 — REGISTRATION PAGE (1.5 minutes)

OPEN BROWSER → http://localhost:5173

> "This is the Login page — the entry point of our application.
> The design uses a gradient background and a clean card layout."

CLICK → Register link

> "This is the Registration page.
> A new user can register by entering their Full Name, Email,
> Password, Phone Number, and selecting their Role.
>
> Our system supports four roles —
> Student, Admin, Recruiter, and HR —
> which are directly mapped to our Spring Boot Role enum."

FILL IN the form:
- Full Name: Demo User
- Email: demo@example.com
- Password: 123456
- Phone: 9876543210
- Role: STUDENT

CLICK → Register

> "On successful registration, the user is redirected to
> the Login page. The data is saved in the MySQL database
> with a BCrypt hashed password for security."

---

## PART 3 — LOGIN PAGE (1 minute)

> "Now let me log in with our registered account."

FILL IN:
- Email: demo@example.com (or your test email)
- Password: 123456

CLICK → Login

> "When the user logs in, the backend validates the credentials,
> generates a JWT token, and sends it back to the frontend.
>
> The frontend stores this token in localStorage and
> attaches it automatically to every subsequent API request
> using an Axios interceptor — so the user never has to
> manually add the token."

---

## PART 4 — DASHBOARD (3 minutes)

> "This is the Dashboard — the main screen of the application.
> It has three sections."

POINT TO — Profile Card

> "The first section is the User Profile Card.
> It shows the user's full name, email, role, phone number,
> verification status, and account status —
> all fetched in real time from the backend using
> GET /api/users/profile with the JWT token."

---

SCROLL DOWN → Recruitment Drives table

> "The second section is the Recruitment Drives table.
> This fetches all active drives from Team 2's backend module
> using GET /drives.
>
> Each drive shows the Company Name, Role, Package in LPA,
> and Location.
>
> Notice how the drives also have eligibility criteria stored
> in the backend — minimum CGPA, eligible branches,
> graduation year, and required skills — which our
> Eligibility Engine uses to filter students automatically."

---

SCROLL DOWN → Applications table

> "The third section is the Applications table.
> This fetches all applications from GET /applications
> and displays the Application ID, Student ID, Drive ID,
> Stage, and Status.
>
> The status is color coded —
> Green for Selected,
> Red for Rejected,
> Yellow for Pending,
> Blue for In Progress —
> giving a clear visual view of the recruitment funnel."

---

POINT TO → Logout button

> "The Logout button clears the JWT token from localStorage
> and redirects the user back to the Login page —
> ending the session securely."

---

## PART 5 — BACKEND INTEGRATION HIGHLIGHT (1.5 minutes)

OPEN POSTMAN → show GET /applications/metrics

> "One of the key features of Team 2's module is the
> Conversion Ratio Metrics API.
>
> When we call GET /applications/metrics,
> the system calculates —
> Total applicants, Total selected, Total rejected,
> Overall conversion rate as a percentage, and
> a Round-wise breakdown showing how many students
> passed or were rejected at each stage —
> Applied, Shortlisted, Technical, HR, and Final."

SHOW THE JSON RESPONSE

> "This data is available for Team 3 to plug into
> charts and analytics dashboards."

---

OPEN POSTMAN → show GET /applications/eligibility?studentId=1&driveId=1

> "Another key feature is the Eligibility Engine.
> When a student tries to apply for a drive,
> our backend automatically checks —
> Is their CGPA above the minimum?
> Is their branch in the eligible list?
> Is their graduation year correct?
> Do they have the required skills?
>
> If any condition fails, the application is rejected
> with a clear error message explaining which criteria
> the student did not meet."

---

## PART 6 — FULL WORKFLOW SUMMARY (30 seconds)

> "So to summarize the complete workflow:
>
> 1. User registers and logs in — Team 1 Auth module
> 2. JWT token is issued and stored in the frontend
> 3. Dashboard loads drives and applications — Team 2 module
> 4. Student applies for a drive — eligibility is checked automatically
> 5. Admin updates the application stage — Applied → Shortlisted → Technical → HR → Final
> 6. Conversion metrics are computed at every stage
> 7. Frontend displays everything in real time — Team 3 module"

---

## PART 7 — CLOSING (30 seconds)

> "To conclude —
>
> Our frontend successfully integrates with
> Team 1's authentication module and Team 2's recruitment module.
>
> The system is fully functional with working APIs,
> a clean user interface, JWT-secured endpoints,
> an eligibility filtering engine, and conversion analytics.
>
> The code is pushed to GitHub under the branch
> integration-team1-team2-team3.
>
> Thank you. I am happy to take any questions."

---

## LIKELY QUESTIONS & ANSWERS

Q: Why did you use JWT instead of sessions?
A: "JWT is stateless — the server doesn't need to store
   session data. The token itself contains the user's role
   and ID, which makes it scalable and suitable for REST APIs."

Q: How does the eligibility engine work?
A: "When a student applies, the ApplicationService fetches
   the student and drive from the database and checks four
   conditions — CGPA, branch, graduation year, and skills.
   If any one fails, the application is rejected with a
   specific error message."

Q: What happens if the JWT token expires?
A: "The backend returns a 401 Unauthorized response.
   The frontend catches this and redirects the user
   back to the Login page to get a new token."

Q: How is the frontend connected to the backend?
A: "The React frontend runs on port 5173.
   The Vite configuration has a proxy that forwards all
   API calls — /api, /drives, /applications, /students —
   to the Spring Boot backend on port 8080.
   This avoids CORS issues without any extra configuration."

Q: What is the database used?
A: "MySQL 8 with four tables — users, drive, student,
   and application. Tables are auto-created by Hibernate
   using ddl-auto=update when the app starts."

Q: What roles does the system support?
A: "Four roles — STUDENT, ADMIN, RECRUITER, and HR.
   All endpoints except signup and login require a
   valid JWT token. Role-based access can be added
   using Spring Security's @PreAuthorize annotation."

---

## TIMING GUIDE

| Section | Time |
|---------|------|
| Opening + Tech Stack | 1.5 min |
| Registration Demo | 1.5 min |
| Login Demo | 1 min |
| Dashboard Walkthrough | 3 min |
| Backend Integration | 1.5 min |
| Workflow Summary | 0.5 min |
| Closing | 0.5 min |
| TOTAL | ~10 min |

---

## TIPS

- Speak slowly and clearly — panels appreciate clarity over speed
- Point to the screen while explaining each section
- If something breaks — stay calm, open Postman to show APIs directly
- If asked something you don't know — say "That's a great question,
  that feature is planned for the next sprint" and move on
- Make eye contact with the panel, not just the screen
