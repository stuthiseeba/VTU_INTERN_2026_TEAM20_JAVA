# Authentication & Authorization System

A secure JWT-based authentication system with Role-Based Access Control built using Spring Boot.

## Technology Stack

- Java 17
- Spring Boot 3.2.0
- Spring Security + JWT
- MySQL 8.0
- Maven

## Features

- User Registration and Login
- JWT Token Authentication
- Password Reset Functionality
- Role-Based Access Control (STUDENT, ADMIN, RECRUITER, HR)
- Profile Verification System
- BCrypt Password Encryption

## Prerequisites

- JDK 17 or higher
- MySQL 8.0 or higher
- Maven 3.6+

## Setup

1. Clone the repository
```bash
git clone <repository-url>
cd auth-system
```

2. Create database
```sql
CREATE DATABASE auth_system_db;
```

3. Configure database credentials in `src/main/resources/application.properties`
```properties
spring.datasource.username=your_username
spring.datasource.password=your_password
```

4. Build and run
```bash
mvn clean install
mvn spring-boot:run
```

Application runs on: `http://localhost:8080`

## API Endpoints

### Authentication

**Signup**
```
POST /api/auth/signup
```

**Login**
```
POST /api/auth/login
```

**Forgot Password**
```
POST /api/auth/forgot-password
```

**Reset Password**
```
POST /api/auth/reset-password
```

### User Management

**Get Profile** (Protected)
```
GET /api/users/profile
Authorization: Bearer <token>
```

**Verify Profile** (Admin Only)
```
POST /api/users/verify/{userId}
Authorization: Bearer <token>
```

## Testing

Import Postman collection from `postman/Auth_System_API.postman_collection.json`

## Project Structure

```
src/main/java/com/internship/authsystem/
├── config/          # Security configuration
├── controller/      # REST endpoints
├── dto/             # Request/Response objects
├── entity/          # Database models
├── repository/      # Data access
├── security/        # JWT implementation
├── service/         # Business logic
└── exception/       # Error handling
```
