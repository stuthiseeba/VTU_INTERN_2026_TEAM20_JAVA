# Requirements

## System Requirements

| Tool | Version | Purpose |
|------|---------|---------|
| Java JDK | 17 or higher | Run Spring Boot backend |
| Node.js | 18 or higher | Run React frontend |
| npm | 9 or higher | Frontend package manager |
| Maven | 3.8 or higher | Backend build tool |
| MySQL | 8.0 or higher | Database |
| MySQL Workbench | Any | Optional — view/manage database visually |

---

## Backend Dependencies (Maven — pom.xml)

| Dependency | Version | Purpose |
|-----------|---------|---------|
| spring-boot-starter-web | 3.2.0 | REST API |
| spring-boot-starter-data-jpa | 3.2.0 | Database ORM |
| spring-boot-starter-security | 3.2.0 | BCrypt password hashing |
| mysql-connector-j | latest | MySQL JDBC driver |
| spring-boot-starter-test | 3.2.0 | Testing |

> These are auto-downloaded by Maven when you run `mvn spring-boot:run`

---

## Frontend Dependencies (npm — package.json)

| Dependency | Purpose |
|-----------|---------|
| react | UI framework |
| react-dom | React DOM rendering |
| vite | Dev server and build tool |

> These are auto-downloaded by npm when you run `npm install`

---

## Environment Setup

### MySQL Database
```sql
CREATE DATABASE patdatabase_db;
```

### Backend Config (backend/src/main/resources/application.properties)
```properties
spring.datasource.url=jdbc:mysql://localhost:3306/patdatabase_db
spring.datasource.username=root
spring.datasource.password=YOUR_MYSQL_PASSWORD
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
server.port=8080
```

### Frontend Config
No extra config needed. API base URL is `http://localhost:8080` — hardcoded in the React pages.
If you change the backend port, update all `fetch("http://localhost:8080/...")` calls in `src/pages/`.

---

## How to Verify Setup

After starting both servers:

1. Open `http://localhost:5173` — should show the homepage
2. Open `http://localhost:8080/api/auth/students` in browser — should return `[]`
3. Register a student account and login — should redirect to student dashboard
