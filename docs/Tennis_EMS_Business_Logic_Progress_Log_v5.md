# Tennis EMS – Business Logic Progress Log (Backend) v5
## Scope: Authentication + Account Provisioning + Authorization + Error Handling + Course / Section / Session Modules

> **Purpose of this log**
> - This file is the updated single source of truth for the current backend implementation status.
> - It is intended to help future collaborators, teammates, or AI tools quickly understand:
>   - current backend architecture
>   - completed modules and endpoints
>   - service-layer responsibilities
>   - current DAO assumptions
>   - current testing status
>   - known follow-up items

---

# 1) Current Backend Status (High-Level)

## 1.1 Foundational Modules Completed
The following backend foundation is already in place:
- Authentication
- Account Provisioning
- Authorization
- Error Handling
- Security configuration

These foundation modules remain unchanged and are still the base for all new business modules.

## 1.2 Newly Implemented Business Modules
The following business modules have now been implemented at the **controller + service + DTO** level:
- Course
- Section
- Session

These three modules now form the first complete business chain of the teaching workflow:

**Course → Section → Session**

This matches the current schema design and is now the main structural backbone for scheduling-related logic.

---

# 2) Core Architecture Decisions

The project continues to follow the same layered backend structure:

**Controller → Service → DAO → DTO → Entity**

## Controller responsibilities
- accept HTTP requests
- bind request DTOs
- call service methods
- return `ResponseEntity`
- remain thin

## Service responsibilities
- business logic
- authorization enforcement
- validation
- relationship checks across modules
- DTO mapping / aggregation

## DAO responsibilities
- data access only
- existing CRUD-style interfaces remain the primary persistence layer

## Authentication model
- `HttpSession` based
- session keys:
  - `EMS_USER_ID`
  - `EMS_ROLE`

## Authorization model
Authorization is still enforced in the **Service layer**, not in controllers.

This remains a key project rule and is now consistently applied in the Course / Section / Session services.

---

# 3) Foundational Modules (Still Active)

## 3.1 Authentication Module
- `AuthController` exposes:
  - `POST /auth/login`
  - `POST /auth/logout`
  - `GET /auth/me`
- `AuthService` handles:
  - credential validation
  - active/inactive account checks
  - session creation / invalidation
  - current-user resolution

## 3.2 Account Provisioning Module
- `AccountController` exposes:
  - `POST /api/accounts`
- `AccountCreationService` creates user + role profile records transactionally.

## 3.3 Authorization Module
- `AuthContextService` resolves caller context from `HttpSession`
- `AuthorizationService` provides reusable role guards
- current pattern used by business services:
  - require caller context
  - enforce role guard
  - then continue business logic

## 3.4 Error Handling Module
- base exception: `AppException`
- subclasses:
  - `BadRequestException`
  - `UnauthorizedException`
  - `ForbiddenException`
  - `ConflictException`
  - `NotFoundException`
- `GlobalExceptionHandler` converts exceptions to `ErrorResponseDTO`

---

# 4) Database / Domain Backbone Relevant to Current Work

The current scheduling domain follows this structure:

## 4.1 Course
Represents a course template.
Key fields:
- `courseId`
- `name`
- `courseNumber`
- `description`
- `level`
- `isActive`

## 4.2 Section
Represents a specific offering of a course taught by a coach.
Key fields:
- `sectionId`
- `courseId`
- `coachId`
- `name`
- `syllabus`
- `startDate`
- `endDate`
- `maxStudents`
- `enrollmentMode`
- `status`
- `createdAt`
- `updatedAt`

## 4.3 Session
Represents a single lesson instance.
Key fields:
- `sessionId`
- `sectionId`
- `startTime`
- `endTime`
- `location`
- `courtId`
- `status`
- `createdAt`
- `updatedAt`

This confirms the implemented service flow:

**Course → Section → Session**

---

# 5) Course Module (Current State)

## 5.1 Purpose
Course is treated as the top-level scheduling template module.
It defines the course itself and acts as the parent object for Sections.

## 5.2 Current DTOs
- `CreateCourseRequestDTO`
- `UpdateCourseRequestDTO`
- `CourseSummaryDTO`
- `CourseDetailDTO`

## 5.3 Current Service Responsibilities
`CourseService` currently handles:
- course creation
- course update
- course lookup by id
- get all courses
- get active courses
- archive course
- validation of unique `courseNumber`
- validation of `Course.Level`
- section-count aggregation for detail DTOs

## 5.4 Current Controller Endpoints
`CourseController` currently exposes:
- `POST /api/courses`
- `PUT /api/courses/{courseId}`
- `GET /api/courses`
- `GET /api/courses/active`
- `GET /api/courses/{courseId}`
- `PATCH /api/courses/{courseId}/archive`

## 5.5 Current Notes
- write operations are admin-only
- archive is preferred over physical delete
- `SectionDAO.getByCourseId(...)` is already used to support course detail aggregation and archive logic
- small controller/service cleanup has been identified as a follow-up refactor item

---

# 6) Section Module (Current State)

## 6.1 Purpose
Section is treated as the concrete teaching offering of a Course.
It links:
- Course
- Coach
- later Enrollment
- later Session

## 6.2 Current DTOs
- `CreateSectionRequestDTO`
- `UpdateSectionRequestDTO`
- `SectionSummaryDTO`
- `SectionDetailDTO`

## 6.3 Current Service Responsibilities
`SectionService` currently handles:
- section creation
- section update
- section lookup by id
- get all sections
- get sections by course id
- get active sections
- archive section
- course existence validation
- section existence validation
- mapping course name into DTOs

## 6.4 Current Controller Endpoints
`SectionController` currently exposes:
- `POST /api/sections`
- `PUT /api/sections/{sectionId}`
- `GET /api/sections`
- `GET /api/sections/active`
- `GET /api/sections/{sectionId}`
- `PATCH /api/sections/{sectionId}/archive`

## 6.5 Known Section Follow-Up Items
The current Section implementation works as a first version, but the following refinements were identified:
- `coachId` validation during create may currently be too strict for future business flexibility
- active-section logic should likely treat non-cancelled sections as active rather than only `ACTIVE`
- a course-scoped endpoint should be added:
  - `GET /api/courses/{courseId}/sections`
- summary mapping can be optimized to avoid repeated course lookups

These are now considered **known refactor items**, not blockers.

---

# 7) Session Module (Current State)

## 7.1 Purpose
Session is treated as a single lesson instance inside a Section.
This module is the first step toward real scheduling execution and will later connect directly to:
- Court
- Enrollment
- SessionAttendance
- SessionNote / SessionAssessment
- TrainingMatch

## 7.2 Current DTOs
- `CreateSessionRequestDTO`
- `UpdateSessionRequestDTO`
- `SessionSummaryDTO`
- `SessionDetailDTO`

## 7.3 Current Service Responsibilities
`SessionService` currently handles:
- session creation
- session update
- get session by id
- get all sessions
- get sessions by section id
- get upcoming sessions
- cancel session
- section existence validation
- session existence validation
- start/end time validation
- detail DTO enrichment using section/course information

## 7.4 Current Controller Endpoints
`SessionController` currently exposes:
- `POST /api/sessions`
- `PUT /api/sessions/{sessionId}`
- `GET /api/sessions/{sessionId}`
- `GET /api/sessions`
- `GET /api/sessions/upcoming`
- `PATCH /api/sessions/{sessionId}/cancel`

## 7.5 Known Session Follow-Up Items
The Session module is functional, but the following refactors were identified:
- request DTOs currently include fields that do not fully match the actual Session persistence model
- `coachId` in session request DTOs is currently unused because coach information is effectively derived from Section
- `notes` handling currently conflicts with the actual Session schema because the schema stores `location`, not a `notes` field
- a section-scoped endpoint should be exposed:
  - `GET /api/sections/{sectionId}/sessions`
- `getUpcomingSessions()` currently filters in memory after loading all sessions; acceptable for now, but later should move closer to DAO/database filtering

These are now tracked as immediate cleanup tasks before broader testing.

---

# 8) Current Testing Status

## 8.1 Runtime Assumption
Backend continues to run locally at:

`http://localhost:8080`

## 8.2 Current Intended Postman Testing Flow
The recommended first integration test chain is now:

1. `POST /auth/login`
2. `GET /auth/me`
3. `POST /api/courses`
4. `GET /api/courses`
5. `POST /api/sections`
6. `GET /api/sections`
7. `POST /api/sessions`
8. `GET /api/sessions`
9. `GET /api/sessions/upcoming`

## 8.3 Testing Preconditions
Because write operations for Course / Section / Session are admin-guarded, integration testing requires:
- a valid logged-in admin account
- a valid session cookie in Postman
- valid foreign-key records where required
  - Course before Section
  - Section before Session
  - Coach and Court records if required by the DTO/database path being tested

## 8.4 Current Testing Goal
The immediate goal is not exhaustive testing yet.
The goal is to confirm a working vertical slice:

**login → create course → create section → create session → read session**

Once this path works, the scheduling backbone can be considered connected end-to-end.

---

# 9) Cursor AI Development Workflow (Current Practice)

The project now actively uses Cursor IDE for backend acceleration.

## Current workflow
1. Choose the next backend module
2. Provide DAO / entity context if needed
3. Generate service/controller/DTO skeleton with Cursor
4. Review generated code manually
5. Refactor small issues
6. Test via Postman
7. Update progress log

## Current status of Cursor usage
Cursor has already been used to generate or help generate:
- Course DTOs / Service / Controller
- Section DTOs / Service / Controller
- Session DTOs / Service / Controller

Human review is still required after each generation pass.

---

# 10) Current Project Structure (Conceptual)

The project now effectively contains these backend areas:

- authentication / current-user flow
- account creation flow
- authorization support services
- exception / error response system
- course module
- section module
- session module

Supporting folders / files still include:
- `.cursor/rules.md`
- `docs/cursor_prompt_templates.md`
- `src/main/java/...`
- `pom.xml`

---

# 11) Immediate Next Planned Work

With Course / Section / Session now in place, the next most natural modules are:

## 11.1 Enrollment
Why next:
- it turns the scheduling structure into actual student participation
- it links Student ↔ Section
- it will later feed SessionAttendance

Expected responsibilities:
- enroll student into section
- drop student from section
- list students by section
- list sections by student
- capacity-related validation

## 11.2 Attendance
Why next:
- it turns Session into a real operational teaching event
- it links Session ↔ Student
- it supports fixed classes, drop-in sessions, and admin adjustment flows

## 11.3 Court Scheduling / Conflict Logic
Why later:
- Session already has `courtId`
- but conflict detection is not yet implemented

---

# 12) Summary of Current Position

The backend is no longer only foundational.
It now has a real first business workflow implemented:

**Authentication / Authorization / Error Handling**
→ **Course**
→ **Section**
→ **Session**

This means the project has moved from pure framework setup into **actual domain implementation**.

The current codebase is now at the stage where:
- module-by-module generation is working
- service-layer rules are consistently applied
- controller style is stable
- DTO style is stable
- Postman integration testing can begin
- the next meaningful expansion is Enrollment and Attendance

---

End of Log
