# Tennis EMS Backend Rules

## Project Overview

This is a Java Spring Boot backend project using Maven.

Main application entry:
TennisEmsApplication.java

There is also a development seed entry:
SeedDataMain.java

The project uses a layered architecture.


## Technology Stack

- Java
- Spring Boot
- Maven
- MySQL
- HttpSession based authentication


## Architecture

The backend follows a strict layered structure:

Controller
Service
DAO
DTO
Entity
Exception
Config


## Layer Responsibilities

### Controller
Controllers handle HTTP requests and responses.

Controllers must:
- accept DTO request bodies
- return DTO responses
- call Service methods

Controllers must NOT contain business logic or authorization logic.


### Service
Services contain business logic.

Services:
- coordinate DAO calls
- enforce authorization rules
- perform validation
- throw business exceptions


### DAO
DAO classes handle database access only.

DAO classes:
- perform database queries
- map database records to Entities

DAO classes must not contain business logic.


### DTO
DTO classes represent API request and response models.

DTOs are used for communication between backend and frontend.


### Entity
Entity classes represent database persistence models.


### Exception

The project uses a custom exception hierarchy.

Base class:
AppException

Standard subclasses include:

BadRequestException
UnauthorizedException
ForbiddenException
ConflictException
NotFoundException

Services should throw these exceptions instead of raw RuntimeException.


## Authentication

Authentication uses HttpSession.

Session keys used:

EMS_USER_ID
EMS_ROLE

AuthContextService is responsible for resolving the current user context.


## Authorization

Authorization must be enforced in the Service layer.

Use AuthorizationService for guard rules such as:

requireAdmin
requireAdminOrSelf
requireRole

Controllers must not implement authorization logic.


## Database Access

Database access must go through DAO classes.

Services must not perform direct SQL operations.


## Seed Component Rules

The seed component is an internal development utility.

Seed entry point:
SeedDataMain

Seed services include:
UserSeedService
CourseSeedService
MatchSeedService
TrainingGroupSeedService

Seed code must:

- use real DAO beans
- use real PasswordEncoder
- run inside Spring context

Seed code must NOT:

- call Controller endpoints
- use raw SQL scripts


## Coding Rules

Follow the existing package structure.

Reuse existing services and utilities whenever possible.

Do not modify unrelated files.

Keep changes minimal and consistent with the current codebase.


## Special Notes

SeedDataMain is separate from the normal web application.

Do not mix seed logic with normal runtime application logic.