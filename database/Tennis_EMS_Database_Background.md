# Tennis EMS Database Background (Updated with Court Table)

## 0. Project Overview

Tennis EMS (Education Management System) is designed to manage tennis
training operations including: - User and role management - Course and
scheduling system - Court management - Enrollment and attendance -
Training groups - Session notes and performance assessments - Training
matches and scoring

The database schema supports a full operational workflow for tennis
coaching programs.

------------------------------------------------------------------------

## 1. User and Role Module

### Users Table

Core authentication table containing: - userId (PK) - email (unique) -
passwordHash - role (ADMIN / COACH / STUDENT) - isActive - createdAt -
updatedAt

Each account belongs to exactly one role.

### Role Profile Tables

Each role has its own profile table connected 1‑to‑1 with Users.

#### Admin

Fields: - adminId (PK) - userId (FK) - firstName - lastName - phone -
adminLevel (SUPER / STANDARD)

#### Coach

Fields: - coachId (PK) - userId (FK) - firstName - lastName - phone -
dateOfBirth - certification - experienceYears - bio

#### Student

Fields: - studentId (PK) - userId (FK) - firstName - lastName -
preferredName - phone - dateOfBirth - skillLevel - notes -
emergencyContactName - emergencyContactPhone

Deleting a user cascades to the corresponding profile.

------------------------------------------------------------------------

## 2. Course and Scheduling Module

### Course

Represents a course template.

Fields: - courseId - name - courseNumber (unique) - description - level
(BEGINNER / INTERMEDIATE / ADVANCED) - isActive

### Section

Represents a specific offering of a course taught by a coach.

Fields: - sectionId - courseId (FK) - coachId (FK) - name - syllabus -
startDate - endDate - maxStudents - enrollmentMode (FIXED / DROP_IN /
HYBRID) - status (PLANNED / ACTIVE / FINISHED / CANCELLED) - createdAt -
updatedAt

### Court

Represents tennis courts used for sessions.

Fields: - courtId (PK) - name - location - surfaceType (HARD / CLAY /
GRASS / SYNTHETIC) - isIndoor - hasLighting - status (AVAILABLE /
MAINTENANCE / CLOSED)

Constraints: - UNIQUE(location, name)

This allows the system to manage: - indoor vs outdoor courts - lighting
availability - court maintenance status

### Session

Represents a single lesson instance.

Fields: - sessionId - sectionId (FK) - startTime - endTime - location -
courtId (FK → Court) - status (SCHEDULED / IN_PROGRESS / COMPLETED /
CANCELLED) - createdAt - updatedAt

If a court is deleted, courtId is set to NULL.

------------------------------------------------------------------------

## 3. Enrollment and Attendance

### Enrollment

Composite PK: (studentId, sectionId)

Fields: - studentId (FK) - sectionId (FK) - status (ENROLLED / DROPPED /
COMPLETED) - createdAt

Represents students enrolled in a section.

### SessionAttendance

Composite PK: (sessionId, studentId)

Fields: - sessionId (FK) - studentId (FK) - status (ENROLLED / PRESENT /
LATE / ABSENT / EXCUSED / CANCELLED) - source (SECTION / DROP_IN /
ADMIN) - createdAt - updatedAt

This design supports: - fixed enrollment classes - drop‑in training -
manual admin adjustments.

------------------------------------------------------------------------

## 4. Training Groups

### TrainingGroup

Fields: - groupId - name - groupType (TRAINING_GROUP / CLASS_GROUP /
CLUB_TEAM) - description - isActive - createdAt - updatedAt

### TrainingGroupMember

Composite PK: (groupId, studentId)

Fields: - groupId (FK) - studentId (FK) - startDate - endDate -
createdAt - updatedAt

endDate NULL indicates an active member.

------------------------------------------------------------------------

## 5. Session Notes and Assessments

### SessionNote

Fields: - noteId - sessionId (FK) - authorUserId (FK → Users) - title -
content - createdAt - updatedAt

### SessionAssessment

Fields: - assessmentId - sessionId (FK) - studentId (FK) - metric -
score (1‑10) - comment - assessorUserId (FK → Users) - createdAt -
updatedAt

Constraint: - UNIQUE(sessionId, studentId, metric)

Metrics may include: FOREHAND, BACKHAND, SERVE, VOLLEY, FOOTWORK,
STAMINA, STRATEGY, MENTAL, CONSISTENCY.

------------------------------------------------------------------------

## 6. Training Matches and Scoring

### ScoringFormat

Defines match scoring systems.

Fields: - formatId - name (unique) - formatType (POINT_RACE / GAME_RACE
/ SET_MATCH) - pointsToWin - winByTwo - gamesToWinSet - setsToWinMatch -
tiebreakAt - noAd - notes - isActive - createdAt - updatedAt

### TrainingMatch

Fields: - matchId - sessionId (FK) - formatId (FK) - matchType (SINGLES
/ DOUBLES) - title - notes - status (SCHEDULED / IN_PROGRESS / COMPLETED
/ CANCELLED) - winnerSide (A / B) - createdAt - updatedAt

### MatchSidePlayer

Composite PK: (matchId, side, position)

Fields: - matchId (FK) - side (A / B) - position (1 / 2) - studentId
(FK)

Supports singles and doubles.

### MatchSummary

1‑to‑1 with TrainingMatch.

Fields: - matchId - finalScoreText - sideAScore - sideBScore

### MatchSegment

Composite PK: (matchId, segmentNo)

Fields: - matchId - segmentNo - segmentType (SET / TB / RACE) -
sideAScore - sideBScore

Allows recording set‑by‑set or segment scores.

------------------------------------------------------------------------

## 7. Overall Schema Characteristics

The current schema demonstrates several design strengths:

1.  Clear role separation between authentication and role profiles.
2.  Full course lifecycle: Course → Section → Session.
3.  Standardized court management integrated with scheduling.
4.  Flexible enrollment and attendance system supporting multiple
    training scenarios.
5.  Detailed performance tracking via assessments.
6.  Advanced match scoring capable of representing singles and doubles
    training matches.

The schema is already suitable for integration with Spring Boot services
and for generating realistic seed data for development and testing.
