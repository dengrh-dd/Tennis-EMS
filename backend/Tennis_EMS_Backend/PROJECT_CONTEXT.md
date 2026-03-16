# Tennis EMS Backend – Project Context

## Project Overview

Tennis EMS Backend is a Java Spring Boot application designed to support a tennis training and club management system.

The backend provides APIs for:

* User authentication
* Account provisioning
* Authorization
* Course management
* Training groups
* Match tracking
* Attendance and enrollment

The project follows a strict layered backend architecture and uses MySQL for persistence.

---

# Core Architecture

The system follows a layered structure:

Controller → Service → DAO → Entity → Database

Responsibilities:

Controller
Handles HTTP request/response only.

Service
Implements business logic and authorization checks.

DAO
Handles database access and persistence.

DTO
Represents request/response payloads.

Entity
Represents database models.

---

# Authentication Model

Authentication is session-based using HttpSession.

Session keys used:

EMS_USER_ID
EMS_ROLE

Login flow:

POST /auth/login
→ AuthController
→ AuthService.login()
→ writes session

Logout flow:

POST /auth/logout
→ session invalidated

Current user:

GET /auth/me
→ AuthService.currentUser()

---

# Authorization Model

Authorization is enforced in the Service layer.

Two shared services are used:

AuthContextService
Resolves the caller's userId and role from HttpSession.

AuthorizationService
Provides reusable authorization guards.

Examples:

requireAdmin()
requireAdminOrSelf()
requireAdminOrCoach()

Controllers must NOT implement authorization logic.

---

# Exception System

All business errors extend AppException.

AppException contains:

HttpStatus status
String code
message

Standard subclasses:

BadRequestException
UnauthorizedException
ForbiddenException
ConflictException
NotFoundException

Exceptions are handled by GlobalExceptionHandler which returns ErrorResponseDTO.

---

# Error Response Format

ErrorResponseDTO contains:

timestamp
status
error
code
message
path

---

# Database Access

All database operations must go through DAO classes.

Services must NOT perform direct SQL operations.

Entities represent database tables.

The project uses MySQL.

---

# Seed Data System

The project includes a development seed component used to populate test data.

Entry point:

SeedDataMain

Seed services include:

UserSeedService
CourseSeedService
MatchSeedService
TrainingGroupSeedService

Seed code:

* runs inside Spring context
* uses real DAO beans
* uses PasswordEncoder

Seed code must NOT call controllers.

---

# Cursor AI Development

The project uses Cursor IDE for AI-assisted development.

Cursor helps generate:

* module skeletons
* service logic
* DAO methods
* controller endpoints

Cursor reads the following project resources:

.cursor/rules.md
docs/cursor_prompt_templates.md

These files help AI understand the project architecture and coding rules.

---

# Development Workflow

Typical backend development flow:

1. Define module architecture
2. Generate skeleton using Cursor
3. Implement service logic
4. Implement DAO queries
5. Add controller endpoints
6. Test using Postman

Architecture decisions remain human-controlled while Cursor accelerates implementation.

---

# Current Project Structure

.cursor/
rules.md

docs/
cursor_prompt_templates.md

src/
main/java/com/Tennis_EMS

pom.xml

---

# Future Modules

Planned backend modules include:

Course
Section
Session
Enrollment
Attendance
TrainingGroup
Match
ScoringFormat
Assessment

These modules will follow the same layered architecture.

---

End of File
