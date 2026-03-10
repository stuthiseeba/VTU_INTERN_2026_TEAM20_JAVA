# Recruitment Drive Management System

This project is a backend system for managing recruitment drives and student applications.

## Modules

* Team 1 – Recruitment Drive Management
* Team 2 – Student Application Workflow
* Team 3 – Analytics / UI / Integration

## Technologies Used

* Java
* Spring Boot
* Spring Data JPA
* MySQL
* Maven
* Postman (for API testing)

## Project Architecture

Controller → Service → Repository → Database

## APIs Implemented

### Recruitment Drive APIs

Create Drive
POST /drives

View Drives
GET /drives

### Application APIs

Apply for Drive
POST /applications

View Applications
GET /applications

Update Recruitment Stage
PUT /applications/{id}

Example body:
{
"stage": "Technical",
"status": "Selected"
}

## Database

MySQL database name:

recruitment_system

Configure database in:

src/main/resources/application.properties

Example:

spring.datasource.url=jdbc:mysql://localhost:3306/recruitment_system
spring.datasource.username=root
spring.datasource.password=yourpassword

## How to Run the Project

1. Install Java 17 or above
2. Install MySQL
3. Create database:

CREATE DATABASE recruitment_system;

4. Open project in Eclipse or IntelliJ
5. Run:

PlacementSystemApplication.java

6. Server runs at:

http://localhost:8080

## Testing APIs

Use Postman.

Example:

Create Drive
POST http://localhost:8080/drives

Apply for Drive
POST http://localhost:8080/applications

Update Stage
PUT http://localhost:8080/applications/1

## Completed Features

* Recruitment drive creation
* Drive viewing
* Student application system
* Recruitment stage tracking
* Selection / rejection updates

## Future Improvements

* Eligibility filtering (CGPA, branch, skills)
* Conversion ratio analytics
* Student eligibility engine
