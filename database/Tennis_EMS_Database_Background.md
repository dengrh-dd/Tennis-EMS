# Tennis EMS Database Background

## 0. Project Overview

Tennis EMS (Education Management System) uses a MySQL relational database to support the main workflow of a tennis training organization. The schema is designed for a Spring Boot backend and a React frontend, with clear modules for authentication, role profiles, course scheduling, court management, enrollment, attendance, training groups, coaching notes, assessments, and training match records.

The database currently focuses on development and test data rather than production personal information. Even so, the schema is structured as if it were supporting a real EMS workflow, so sensitive values such as local database passwords should stay outside GitHub and be provided through environment variables.

---

## 1. Account and Role Module

### Users

The `Users` table is the base authentication table.

Main fields:
- `userId` as the primary key
- `email` as a unique login identifier
- `passwordHash` for BCrypt-style hashed passwords
- `role` with values `ADMIN`, `COACH`, or `STUDENT`
- `isActive`, `createdAt`, and `updatedAt`

Each application account belongs to exactly one role. Role-specific profile data is stored in separate profile tables instead of being mixed into the base account table.

### Admin

The `Admin` table stores administrator profile information.

Main fields:
- `adminId`
- `userId`
- `firstName`, `lastName`, `phone`
- `adminLevel`, currently `SUPER` or `STANDARD`

The relationship to `Users` is one-to-one. Deleting a user cascades to the admin profile.

### Coach

The `Coach` table stores coach profile information.

Main fields:
- `coachId`
- `userId`
- `firstName`, `lastName`, `phone`
- `dateOfBirth`
- `certification`
- `experienceYears`
- `bio`

This supports coach assignment to course sections and future profile/detail pages in the frontend.

### Student

The `Student` table stores student profile information.

Main fields:
- `studentId`
- `userId`
- `firstName`, `lastName`, `preferredName`
- `phone`, `dateOfBirth`
- `skillLevel`
- `notes`
- `emergencyContactName`, `emergencyContactPhone`

This supports enrollment, attendance, group membership, assessment, and match-player records.

---

## 2. Course, Section, Court, and Session Module

### Course

The `Course` table represents a reusable course template.

Main fields:
- `courseId`
- `name`
- `courseNumber`, unique
- `description`
- `level`, currently `BEGINNER`, `INTERMEDIATE`, or `ADVANCED`
- `isActive`

### Section

The `Section` table represents a specific course offering taught by a coach.

Main fields:
- `sectionId`
- `courseId`
- `coachId`
- `name`
- `syllabus`
- `startDate`, `endDate`
- `maxStudents`
- `enrollmentMode`, currently `FIXED`, `DROP_IN`, or `HYBRID`
- `status`, currently `PLANNED`, `ACTIVE`, `FINISHED`, or `CANCELLED`
- `createdAt`, `updatedAt`

A section connects a course template to a coach and a date range.

### Court

The `Court` table stores tennis court information used by scheduled sessions.

Main fields:
- `courtId`
- `name`
- `location`
- `surfaceType`, currently `HARD`, `CLAY`, `GRASS`, or `SYNTHETIC`
- `isIndoor`
- `hasLighting`
- `status`, currently `AVAILABLE`, `MAINTENANCE`, or `CLOSED`

The schema enforces a unique `(location, name)` pair so that the same court name can exist at different locations, but cannot be duplicated within the same location.

### Session

The `Session` table represents a single lesson or training event.

Main fields:
- `sessionId`
- `sectionId`
- `startTime`, `endTime`
- `location`
- `courtId`
- `status`, currently `SCHEDULED`, `IN_PROGRESS`, `COMPLETED`, or `CANCELLED`
- `createdAt`, `updatedAt`

`courtId` is nullable. If a court record is deleted, existing sessions keep their scheduling history while `courtId` is set to `NULL`.

---

## 3. Enrollment and Attendance Module

### Enrollment

The `Enrollment` table connects students to sections.

Primary key:
- `(studentId, sectionId)`

Main fields:
- `studentId`
- `sectionId`
- `status`, currently `ENROLLED`, `DROPPED`, or `COMPLETED`
- `createdAt`

This supports course enrollment pages and student course views.

### SessionAttendance

The `SessionAttendance` table records attendance for individual sessions.

Primary key:
- `(sessionId, studentId)`

Main fields:
- `sessionId`
- `studentId`
- `status`, currently `ENROLLED`, `PRESENT`, `LATE`, `ABSENT`, `EXCUSED`, or `CANCELLED`
- `source`, currently `SECTION`, `DROP_IN`, or `ADMIN`
- `createdAt`, `updatedAt`

This design supports fixed-section attendance, drop-in attendance, and manual administrative adjustments.

---

## 4. Training Group Module

### TrainingGroup

The `TrainingGroup` table represents a group of students outside or across formal course sections.

Main fields:
- `groupId`
- `name`
- `groupType`, currently `TRAINING_GROUP`, `CLASS_GROUP`, or `CLUB_TEAM`
- `description`
- `isActive`
- `createdAt`, `updatedAt`

### TrainingGroupMember

The `TrainingGroupMember` table connects students to groups.

Primary key:
- `(groupId, studentId)`

Main fields:
- `groupId`
- `studentId`
- `startDate`
- `endDate`
- `createdAt`, `updatedAt`

A `NULL` `endDate` means the student is currently an active member.

---

## 5. Notes and Assessment Module

### SessionNote

The `SessionNote` table stores coach/admin notes for a session.

Main fields:
- `noteId`
- `sessionId`
- `authorUserId`
- `title`
- `content`
- `createdAt`, `updatedAt`

### SessionAssessment

The `SessionAssessment` table stores student-level evaluation metrics for a session.

Main fields:
- `assessmentId`
- `sessionId`
- `studentId`
- `metric`
- `score`, constrained from 1 to 10
- `comment`
- `assessorUserId`
- `createdAt`, `updatedAt`

The schema enforces `UNIQUE(sessionId, studentId, metric)` so the same student cannot receive duplicate scores for the same metric in one session.

Example metrics include `FOREHAND`, `BACKHAND`, `SERVE`, `VOLLEY`, `FOOTWORK`, `STAMINA`, `STRATEGY`, `MENTAL`, and `CONSISTENCY`.

---

## 6. Training Match and Scoring Module

### ScoringFormat

The `ScoringFormat` table defines supported scoring systems.

Main fields:
- `formatId`
- `name`
- `formatType`, currently `POINT_RACE`, `GAME_RACE`, or `SET_MATCH`
- `pointsToWin`
- `winByTwo`
- `gamesToWinSet`
- `setsToWinMatch`
- `tiebreakAt`
- `noAd`
- `notes`
- `isActive`
- `createdAt`, `updatedAt`

### TrainingMatch

The `TrainingMatch` table represents a training match connected to a session.

Main fields:
- `matchId`
- `sessionId`
- `formatId`
- `matchType`, currently `SINGLES` or `DOUBLES`
- `title`
- `notes`
- `status`, currently `SCHEDULED`, `IN_PROGRESS`, `COMPLETED`, or `CANCELLED`
- `winnerSide`, currently `A` or `B`
- `createdAt`, `updatedAt`

### MatchSidePlayer

The `MatchSidePlayer` table stores who played on each side.

Primary key:
- `(matchId, side, position)`

Main fields:
- `matchId`
- `side`, currently `A` or `B`
- `position`, currently `1` or `2`
- `studentId`

This supports both singles and doubles training matches.

### MatchSummary

The `MatchSummary` table stores a one-to-one summary for a match.

Main fields:
- `matchId`
- `finalScoreText`
- `sideAScore`
- `sideBScore`

### MatchSegment

The `MatchSegment` table stores set-by-set or segment-level score details.

Primary key:
- `(matchId, segmentNo)`

Main fields:
- `matchId`
- `segmentNo`
- `segmentType`, currently `SET`, `TB`, or `RACE`
- `sideAScore`
- `sideBScore`

---

## 7. Relationship Summary

High-level flow:

```text
Users
├── Admin
├── Coach ─── Section ─── Session ─── SessionAttendance
└── Student ─ Enrollment ┘       ├── SessionNote
                                  ├── SessionAssessment
                                  └── TrainingMatch ─ MatchSidePlayer
                                                   ├── MatchSummary
                                                   └── MatchSegment

Course ─── Section
Court ─── Session
TrainingGroup ─── TrainingGroupMember ─── Student
ScoringFormat ─── TrainingMatch
```

---

## 8. Design Characteristics

The current schema has several design strengths:

1. Authentication and role profiles are separated cleanly.
2. Course templates, sections, sessions, courts, and enrollment are modeled as separate concepts.
3. Attendance supports both fixed enrollment and drop-in workflows.
4. Training groups support team/class/group organization outside the course-section structure.
5. Session notes and assessments provide a foundation for coach feedback and student progress tracking.
6. Training match tables support singles, doubles, flexible scoring formats, summaries, and segment-level score details.
7. The schema is suitable for Spring JDBC service integration and development seed data generation.

---

## 9. Current Repository Notes

- `schema.sql` is the executable database schema.
- `Tennis_EMS_Database_Background.md` is the human-readable explanation of the schema.
- Test data should be generated or seeded locally; production-like personal data should not be committed.
- Database connection credentials should not be committed. The backend should read them from environment variables such as `DB_URL`, `DB_USERNAME`, and `DB_PASSWORD`.
