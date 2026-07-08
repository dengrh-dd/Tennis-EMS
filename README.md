# Tennis EMS

Tennis EMS is a full-stack Tennis Education Management System for managing tennis training programs, users, courses, sections, sessions, enrollments, attendance, training groups, courts, and match-related records.

## Tech Stack

### Backend
- Java 17
- Spring Boot
- Spring JDBC
- MySQL
- Maven

### Frontend
- React
- TypeScript
- Vite
- React Router

## Project Structure

```text
Tennis-EMS/
├── backend/
│   └── Tennis_EMS_Backend/          # Spring Boot backend
│       ├── src/main/java/com/Tennis_EMS/
│       │   ├── Config/              # Security and backend configuration
│       │   ├── Controller/          # REST controllers
│       │   ├── DAO/                 # DAO interfaces and JDBC implementations
│       │   ├── DTO/                 # Request/response DTOs
│       │   ├── Entity/              # Domain entities
│       │   └── Service/             # Business logic services
│       └── src/main/resources/      # Application configuration
├── frontend/
│   └── Tennis_EMS_Frontend/         # React + Vite frontend
│       ├── src/api/                 # API clients
│       ├── src/auth/                # Auth gate and role logic
│       ├── src/components/          # Shared layout and UI components
│       ├── src/features/            # Feature-based pages, hooks, routes, and components
│       ├── src/pages/               # Top-level pages
│       ├── src/routes/              # Route configuration
│       └── src/types/               # Shared TypeScript types
├── database/                        # Schema and database documentation
└── docs/                            # Project notes and progress logs
```

## Current Update Summary

This version expands the original Tennis EMS project into a more complete full-stack system.

### Backend updates
- Added additional REST controllers for accounts, users, courts, enrollments, sessions, attendance, training groups, and match modules.
- Added service and DAO layers for the expanded management workflow.
- Added DTOs and models to support structured request/response handling.
- Added JDBC-based database access for the main EMS entities.

### Frontend updates
- Reorganized the frontend with a feature-based structure.
- Added shared layout, sidebar, page shell, panel, form, modal, and feedback components.
- Added API clients for backend modules.
- Added pages and controllers for course management, enrollment, attendance, groups, people, matches, and dashboards.
- Added role-based dashboard/navigation structure for admin, coach, and student workflows.

## Database Setup

The database folder contains both the executable schema and a human-readable database background document. The schema currently covers users, role profiles, courses, sections, courts, sessions, enrollment, attendance, training groups, session notes, assessments, training matches, match participants, match summaries, and match segments.


1. Create a local MySQL database:

```sql
CREATE DATABASE tennis_ems CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

2. Run the schema file:

```text
database/schema.sql
```

## Backend Setup

From the backend folder:

```bash
cd backend/Tennis_EMS_Backend
```

Set your local database credentials through environment variables:

```bash
# macOS / Linux
export DB_URL="jdbc:mysql://127.0.0.1:3306/tennis_ems?useSSL=false&allowPublicKeyRetrieval=true&serverTimezone=UTC&characterEncoding=utf8"
export DB_USERNAME="root"
export DB_PASSWORD="your_mysql_password"
```

For Windows PowerShell:

```powershell
$env:DB_URL="jdbc:mysql://127.0.0.1:3306/tennis_ems?useSSL=false&allowPublicKeyRetrieval=true&serverTimezone=UTC&characterEncoding=utf8"
$env:DB_USERNAME="root"
$env:DB_PASSWORD="your_mysql_password"
```

Run the backend:

```bash
./mvnw spring-boot:run
```

On Windows CMD or PowerShell, use:

```bash
mvnw.cmd spring-boot:run
```

The backend will run on the default Spring Boot port unless configured otherwise.

## Frontend Setup

From the frontend folder:

```bash
cd frontend/Tennis_EMS_Frontend
npm install
npm run dev
```

Common frontend commands:

```bash
npm run dev      # Start local development server
npm run build    # Build production frontend
npm run lint     # Run ESLint
npm run preview  # Preview production build locally
```

## GitHub Upload / Update Workflow

After replacing or updating files locally:

```bash
git status
git add .
git commit -m "Update Tennis EMS frontend and backend"
git push origin main
```

If your branch is named `master` instead of `main`, use:

```bash
git push origin master
```

## Notes

- Do not commit real database passwords, API keys, `.env` files, `node_modules`, Maven `target` folders, or IDE folders.
- Local database credentials should be configured through environment variables or local ignored config files.
- Even for test-only databases, avoid committing reusable local credentials because they can reveal your password habits and may be reused across tools.
- The `database/` and `docs/` folders are safe to keep in the repository if they describe the project setup and progress.
