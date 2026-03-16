# Tennis EMS

Tennis EMS (Education Management System) is a full-stack system designed to manage tennis coaching programs, including scheduling, enrollment, attendance tracking, training groups, and match scoring.

---

# Tech Stack

Backend
- Java
- Spring Boot
- Maven
- MySQL

Frontend
- React
- TypeScript
- Vite

Database
- MySQL relational schema

---

# System Architecture

The backend follows a layered architecture:

Controller → Service → DAO → Entity → Database

Key scheduling domain structure:

Course → Section → Session

This forms the backbone of the training workflow. :contentReference[oaicite:1]{index=1}

---

# Core Modules

Authentication  
User Management  
Course Scheduling  
Session Management  
Enrollment  
Attendance  
Training Groups  
Match Scoring

---

# Project Structure

---

# Backend Modules Implemented

- Authentication
- Account provisioning
- Authorization
- Error handling
- Course module
- Section module
- Session module

These modules form the first vertical workflow of the system:

Authentication → Course → Section → Session :contentReference[oaicite:2]{index=2}

---

# Local Development

## Backend

Backend runs on: https://localhost:8080

---

## Frontend

Frontend runs on: https://localhost:5173

---

# Database

The project uses MySQL.

Schema can be found in: database/schema.sql

The schema supports:

- course lifecycle
- session scheduling
- enrollment
- attendance
- match scoring

---

# Development Workflow

Development is accelerated using Cursor IDE.

Typical workflow:

1. Generate service / controller skeleton
2. Manual review
3. Postman testing
4. Update progress log

---

# Future Modules

Planned modules include:

- Enrollment
- Attendance
- Court conflict detection
- Advanced match tracking

---

# Author

Ruihe Deng
