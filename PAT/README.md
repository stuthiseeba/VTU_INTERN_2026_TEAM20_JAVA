Placement Automation Tool (PAT)
Identity & User Management Service – Team 1
This project is part of the Placement Automation Tool (PAT) built using a microservices architecture.

The current implementation includes the Identity & User Management Service, which handles:

User Registration

User Login

JWT Authentication

Role-based access (Student, Coordinator, TPO, Genesis, HR)

Basic Dashboard UI

Verification badge display

The system uses React for the frontend, Node.js + Express for the backend, and MySQL for the database.

Project Structure
PAT/
│
├── identity-service/     # Backend (Node.js + Express + MySQL)
│
└── pat-ui/               # Frontend (React + Vite)
Requirements
Make sure the following are installed:

Node.js (v18 or later recommended)

npm

MySQL Server

Git

Database Setup
Open MySQL.

Create the database:

CREATE DATABASE pat_identity;
USE pat_identity;
Create the users table:

CREATE TABLE users (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(100),
  email VARCHAR(100) UNIQUE,
  password VARCHAR(255),
  role ENUM('Student','Coordinator','TPO','Genesis','HR') DEFAULT 'Student',
  isVerified BOOLEAN DEFAULT FALSE,
  resetToken VARCHAR(255),
  resetTokenExpiry BIGINT
);
Backend Setup (Identity Service)
Navigate to the backend folder:

cd identity-service
Install dependencies:

npm install
Replace the .env file:

DB_HOST=localhost
DB_USER=root
DB_PASS=your_mysql_password(your password)
DB_NAME=pat_identity
JWT_SECRET=supersecretkey
Run the backend server:

node server.js
The backend will start at:

http://localhost:5001
Frontend Setup (React UI)
Open a new terminal and navigate to the frontend:

cd pat-ui
Install dependencies:

npm install
Run the React application:

npm run dev
Frontend will run at:

http://localhost:5173
How to Use
Open the frontend in the browser.

Register a new user.

Login using the registered credentials.

After login, you will be redirected to the dashboard.

The dashboard shows:

User name

User role

Verification badge

Current Features Implemented
JWT-based authentication

User registration

User login

Protected profile route

Basic React UI

Dashboard page

Role selection during registration