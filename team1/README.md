# Authentication & Authorization System

JWT-based authentication system with Role-Based Access Control (RBAC) for student recruitment platform.

## 📋 Table of Contents
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Quick Start](#quick-start)
- [API Endpoints](#api-endpoints)
- [Project Structure](#project-structure)
- [Testing](#testing)
- [Documentation](#documentation)
- [Team Information](#team-information)

## ✨ Features

- ✅ User Registration/Signup with validation
- ✅ User Login with JWT token generation
- ✅ Password Reset functionality (forgot + reset)
- ✅ Role-Based Access Control (RBAC)
- ✅ Profile Verification Badge Logic
- ✅ Secure password storage with BCrypt
- ✅ JWT token validation on every request
- ✅ Global exception handling
- ✅ Input validation
- ✅ CORS enabled for frontend integration

## 🛠 Tech Stack

- **Backend Framework**: Spring Boot 3.2.0
- **Language**: Java 17
- **Security**: Spring Security + JWT
- **Database**: MySQL 8.0
- **ORM**: Spring Data JPA (Hibernate)
- **Build Tool**: Maven
- **Password Encryption**: BCrypt
- **Validation**: Jakarta Validation
- **API Testing**: Postman

## 📦 Prerequisites

Before running this application, ensure you have:

- **JDK 17** or higher - [Download](https://www.oracle.com/java/technologies/downloads/#java17)
- **MySQL 8.0** or higher - [Download](https://dev.mysql.com/downloads/mysql/)
- **Maven 3.6+** - [Download](https://maven.apache.org/download.cgi)
- **Postman** (optional) - [Download](https://www.postman.com/downloads/)

See `requirements.txt` for detailed installation instructions.

## 🚀 Quick Start

### 1. Clone the Repository
```bash
git clone <repository-url>
cd auth-system
```

### 2. Setup Database
Open MySQL and create database:
```sql
CREATE DATABASE auth_system_db;
```

### 3. Configure Application
Update `src/main/resources/application.properties`:
```properties
spring.datasource.username=YOUR_MYSQL_USERNAME
spring.datasource.password=YOUR_MYSQL_PASSWORD
```

### 4. Build the Project
```bash
mvn clean install
```

### 5. Run the Application
```bash
mvn spring-boot:run
```

The application will start on `http://localhost:8080`

### 6. Verify Installation
```bash
curl http://localhost:8080/api/auth/signup
```

## 📡 API Endpoints

### Authentication Endpoints (Public)

#### 1. User Signup
```http
POST /api/auth/signup
Content-Type: application/json

{
  "email": "student@example.com",
  "password": "password123",
  "fullName": "John Doe",
  "phoneNumber": "1234567890",
  "role": "STUDENT"
}
```

**Response:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "type": "Bearer",
  "id": 1,
  "email": "student@example.com",
  "fullName": "John Doe",
  "role": "STUDENT",
  "isVerified": false
}
```

#### 2. User Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "student@example.com",
  "password": "password123"
}
```

#### 3. Forgot Password
```http
POST /api/auth/forgot-password
Content-Type: application/json

{
  "email": "student@example.com"
}
```

#### 4. Reset Password
```http
POST /api/auth/reset-password
Content-Type: application/json

{
  "token": "reset-token-here",
  "newPassword": "newpassword123"
}
```

### User Endpoints (Protected)

#### 5. Get User Profile
```http
GET /api/users/profile
Authorization: Bearer YOUR_JWT_TOKEN
```

#### 6. Verify Profile (Admin Only)
```http
POST /api/users/verify/{userId}
Authorization: Bearer ADMIN_JWT_TOKEN
```

## 📁 Project Structure

```
auth-system/
├── src/
│   └── main/
│       ├── java/com/internship/authsystem/
│       │   ├── AuthSystemApplication.java    # Main entry point
│       │   ├── config/
│       │   │   └── SecurityConfig.java       # Security configuration
│       │   ├── controller/
│       │   │   ├── AuthController.java       # Auth endpoints
│       │   │   └── UserController.java       # User endpoints
│       │   ├── dto/
│       │   │   ├── SignupRequest.java        # Signup request DTO
│       │   │   ├── LoginRequest.java         # Login request DTO
│       │   │   ├── AuthResponse.java         # Auth response DTO
│       │   │   ├── ForgotPasswordRequest.java
│       │   │   ├── ResetPasswordRequest.java
│       │   │   └── ApiResponse.java          # Generic response
│       │   ├── entity/
│       │   │   ├── User.java                 # User entity
│       │   │   └── Role.java                 # Role enum
│       │   ├── repository/
│       │   │   └── UserRepository.java       # Data access layer
│       │   ├── security/
│       │   │   ├── JwtUtil.java              # JWT utilities
│       │   │   └── JwtAuthenticationFilter.java
│       │   ├── service/
│       │   │   └── AuthService.java          # Business logic
│       │   └── exception/
│       │       └── GlobalExceptionHandler.java
│       └── resources/
│           └── application.properties         # Configuration
├── postman/
│   └── Auth_System_API.postman_collection.json
├── pom.xml                                    # Maven dependencies
├── README.md                                  # This file
├── SETUP_GUIDE.md                            # Detailed setup guide
├── DOCUMENTATION.md                          # Complete documentation
├── CODE_REVIEW.md                            # Code review report
├── requirements.txt                          # System requirements
└── .gitignore

```

## 🧪 Testing

### Using Postman

1. Import collection from `postman/Auth_System_API.postman_collection.json`
2. Test endpoints in this order:
   - Signup → Login → Get Profile → Forgot Password → Reset Password

### Using cURL

**Test Signup:**
```bash
curl -X POST http://localhost:8080/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123","fullName":"Test User","role":"STUDENT"}'
```

**Test Login:**
```bash
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'
```

**Test Protected Endpoint:**
```bash
curl -X GET http://localhost:8080/api/users/profile \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

## 📚 Documentation

- **SETUP_GUIDE.md** - Step-by-step setup instructions
- **DOCUMENTATION.md** - Complete technical documentation
- **CODE_REVIEW.md** - Line-by-line code review
- **requirements.txt** - System requirements and dependencies

## 🔐 Security Features

- **Password Encryption**: BCrypt hashing with automatic salt
- **JWT Authentication**: Stateless token-based authentication
- **Role-Based Access Control**: 4 roles (STUDENT, ADMIN, RECRUITER, HR)
- **Token Expiration**: 24-hour token validity
- **Input Validation**: Jakarta Validation annotations
- **CORS Configuration**: Configurable cross-origin requests

## 🎯 Team Information

### Team 1 - Signup and Authorization
**Deliverables:**
- ✅ User Signup/Registration API
- ✅ User Login/Authentication API
- ✅ Password Reset functionality
- ✅ Role-Based Access Control (RBAC)
- ✅ Profile Verification Badge Logic
- ✅ Secure password storage and validation
- ✅ JWT token generation and validation
- ✅ API testing with Postman
- ✅ Complete documentation

## 🐛 Troubleshooting

### Port 8080 already in use
```properties
# Change port in application.properties
server.port=8081
```

### MySQL connection failed
- Verify MySQL is running
- Check username/password in application.properties
- Ensure database `auth_system_db` exists

### Maven build failed
```bash
mvn clean install -U
```

## 📝 License

This project is part of an internship assignment.

## 🤝 Contributing

This is an internship project. For questions or issues, contact the team lead.

## 📞 Support

For detailed setup help, see:
1. `SETUP_GUIDE.md` - Installation guide
2. `DOCUMENTATION.md` - Technical details
3. `CODE_REVIEW.md` - Code verification

---

**Built with ❤️ by Team 1 - Authentication & Authorization**
