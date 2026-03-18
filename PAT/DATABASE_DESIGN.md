# Database Design — PAT (Placement Automation Tool)

## Tables Overview

| Table | Description |
|-------|-------------|
| `users` | All registered users with role and BCrypt hashed password |
| `student_profile` | Extended student profile data linked to a user |
| `content_items` | Homepage content posted by coordinators |
| `drives` | Placement drives created by TPO |
| `drive_students` | Students participating in each round of a drive |

---

## Table Schemas

### 1. `users`
| Column | Type | Constraints |
|--------|------|-------------|
| id | BIGINT | PK, AUTO_INCREMENT |
| name | VARCHAR(255) | NOT NULL |
| email | VARCHAR(255) | UNIQUE, NOT NULL |
| password | VARCHAR(255) | NOT NULL (BCrypt hashed) |
| role | VARCHAR(50) | ENUM: STUDENT, COORDINATOR, TPO, ADMIN, HR |

---

### 2. `student_profile`
| Column | Type | Description |
|--------|------|-------------|
| id | BIGINT | PK, AUTO_INCREMENT |
| user_id | BIGINT | FK → users.id |
| phone | VARCHAR(255) | Contact number |
| linkedin | VARCHAR(255) | LinkedIn URL |
| address | VARCHAR(255) | Home address |
| grad_year | VARCHAR(255) | Graduation year |
| cgpa | VARCHAR(255) | Current CGPA |
| department | VARCHAR(255) | Department name |
| college | VARCHAR(255) | College name |
| school10 | VARCHAR(255) | 10th school name |
| score10 | VARCHAR(255) | 10th percentage/score |
| year10 | VARCHAR(255) | 10th passing year |
| school12 | VARCHAR(255) | 12th school name |
| score12 | VARCHAR(255) | 12th percentage/score |
| year12 | VARCHAR(255) | 12th passing year |
| degree_name | VARCHAR(255) | Degree name |
| specialization | VARCHAR(255) | Degree specialization |
| year_degree | VARCHAR(255) | Degree passing year |
| aadhar_number | VARCHAR(255) | Aadhaar number |
| soft_skills | VARCHAR(255) | Comma-separated soft skills |
| tech_skills | VARCHAR(255) | Comma-separated tech skills |

---

### 3. `content_items`
| Column | Type | Description |
|--------|------|-------------|
| id | BIGINT | PK, AUTO_INCREMENT |
| type | VARCHAR(255) | announcements / companies / drives / partnerships / global |
| title | VARCHAR(255) | Content title |
| body | TEXT | Content body |
| coordinator_user_id | BIGINT | FK → users.id (coordinator who posted) |

---

### 4. `drives`
| Column | Type | Description |
|--------|------|-------------|
| id | BIGINT | PK, AUTO_INCREMENT |
| tpo_user_id | BIGINT | FK → users.id (TPO who created) |
| company | VARCHAR(255) | Company name |
| role | VARCHAR(255) | Job role/position |
| drive_date | VARCHAR(255) | Date of drive |
| drive_time | VARCHAR(255) | Time of drive |
| venue | VARCHAR(255) | Drive venue |
| eligibility | VARCHAR(255) | Eligibility criteria |
| rounds | VARCHAR(255) | Number/names of rounds |
| status | VARCHAR(255) | Drive status |

---

### 5. `drive_students`
| Column | Type | Description |
|--------|------|-------------|
| id | BIGINT | PK, AUTO_INCREMENT |
| drive_id | BIGINT | FK → drives.id |
| student_name | VARCHAR(255) | Student's name |
| student_email | VARCHAR(255) | Student's email |
| round_index | INT | Current round number (0-based) |
| status | VARCHAR(255) | Appeared / Selected / Rejected |

---

## Relationships

```
users (1) ──────── (N) student_profile     [one user → one profile]
users (1) ──────── (N) content_items       [coordinator posts content]
users (1) ──────── (N) drives              [TPO creates drives]
drives (1) ─────── (N) drive_students      [drive has many student entries]
```

---

## ER Diagram (Text)

```
+----------+       +------------------+
|  users   |──1:1──| student_profile  |
+----------+       +------------------+
     |
     |──1:N──+---------------+
     |       | content_items |
     |       +---------------+
     |
     |──1:N──+--------+       +----------------+
             | drives |──1:N──| drive_students |
             +--------+       +----------------+
```

---

## Notes
- Hibernate auto-creates all tables on first run (`spring.jpa.hibernate.ddl-auto=update`)
- `drive_students` tracks each student's progress per round within a drive
- Skills are stored as comma-separated strings in `student_profile`
- Passwords are BCrypt hashed — never stored as plain text
