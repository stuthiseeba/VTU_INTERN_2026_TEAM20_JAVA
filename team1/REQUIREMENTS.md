# Project Requirements

## Prerequisites

### Required Software
- **Java Development Kit (JDK)**: Version 11 or higher
- **Maven**: Version 3.6 or higher
- **MySQL**: Version 8.0 or higher
- **Git**: For version control

### Optional Tools
- **Postman**: For API testing (collection included in `/postman` folder)
- **IDE**: IntelliJ IDEA, Eclipse, or VS Code with Java extensions

## Dependencies

All project dependencies are managed through Maven and defined in `pom.xml`:

### Core Dependencies
- **Spring Boot Starter Web**: REST API development
- **Spring Boot Starter Data JPA**: Database operations
- **Spring Boot Starter Security**: Authentication and authorization
- **MySQL Connector**: Database connectivity
- **JWT (JSON Web Token)**: Token-based authentication
- **Lombok**: Reduce boilerplate code
- **Spring Boot Starter Validation**: Input validation

## Database Setup

1. Install and start MySQL server
2. Create database (auto-created on first run):
   ```sql
   CREATE DATABASE auth_system_db;
   ```
3. Update credentials in `src/main/resources/application.properties` if needed:
   - Default username: `root`
   - Default password: `root`
   - Default port: `3306`

## Installation Steps

1. Clone the repository
2. Navigate to project directory
3. Run the application:
   ```bash
   mvn spring-boot:run
   ```
4. Application will start on `http://localhost:8080`

## API Endpoints

Import the Postman collection from `/postman/Auth_System_API.postman_collection.json` for complete API documentation.

### Main Endpoints
- `POST /api/auth/signup` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/forgot-password` - Request password reset
- `POST /api/auth/reset-password` - Reset password with token
- `GET /api/users/profile` - Get user profile (authenticated)

## Environment Variables

Configure the following in `application.properties`:
- `server.port`: Application port (default: 8080)
- `spring.datasource.url`: Database URL
- `spring.datasource.username`: Database username
- `spring.datasource.password`: Database password
- `jwt.secret`: JWT secret key
- `jwt.expiration`: Token expiration time in milliseconds
