You are working inside an existing Java Spring Boot backend project named Tennis EMS Backend.

Project context:
- This is a Maven-based Spring Boot backend.
- The project follows a layered architecture:
  Controller -> Service -> DAO -> DTO -> Entity -> Database
- Existing package structure includes:
  Config
  Controller
  DAO
  DTO
  Entity
  Exception
  Service
- The project uses MySQL.
- Authentication is session-based using HttpSession.
- Session keys include:
  EMS_USER_ID
  EMS_ROLE
- AuthContextService is used to resolve the current logged-in user.
- AuthorizationService is used for authorization checks.
- The project uses a custom AppException hierarchy including:
  BadRequestException
  UnauthorizedException
  ForbiddenException
  ConflictException
  NotFoundException

Important rules:
- Controllers should only handle HTTP request/response logic.
- Business logic must stay in the Service layer.
- Authorization checks must be enforced in the Service layer, not in controllers.
- DAO classes are responsible for database access only.
- DTOs should be used for request/response models.
- Reuse existing exception style and project structure.
- Do not redesign unrelated parts of the project.
- Do not modify unrelated files.
- Keep changes minimal and consistent with the existing codebase.
- Do not mix seed logic with normal runtime application logic.

Task:
Implement the [MODULE_NAME] module.

Requirements:
1. Follow the existing project architecture and naming conventions.
2. Create or update the necessary classes in the correct folders.
3. Reuse existing services and utilities where appropriate.
4. Use DTOs for API input/output.
5. Use the existing exception system for business errors.
6. If authorization is required, use AuthContextService and AuthorizationService in the Service layer.
7. Keep the implementation clean, minimal, and production-style.

Expected output:
- Generate the necessary Java files and code changes directly in the existing project structure.
- Prefer creating only the files needed for this module.
- If an implementation detail is unclear, choose the option most consistent with the current codebase.