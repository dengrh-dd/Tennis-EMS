package com.Tennis_EMS.Service;

import com.Tennis_EMS.DAO.AdminDAO;
import com.Tennis_EMS.DAO.CoachDAO;
import com.Tennis_EMS.DAO.StudentDAO;
import com.Tennis_EMS.DAO.UserDAO;
import com.Tennis_EMS.DTO.Account.CreateAccountRequestDTO;
import com.Tennis_EMS.DTO.Account.CreateAccountResponseDTO;
import com.Tennis_EMS.Entity.Admin;
import com.Tennis_EMS.Entity.Coach;
import com.Tennis_EMS.Entity.Student;
import com.Tennis_EMS.Entity.User;
import com.Tennis_EMS.Exception.BadRequestException;
import com.Tennis_EMS.Exception.ConflictException;
import com.Tennis_EMS.Service.Authorization.AuthorizationService;
import com.Tennis_EMS.Service.Authorization.AuthContextService;
import jakarta.servlet.http.HttpSession;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AccountCreationService {

    private final UserDAO userDAO;
    private final AdminDAO adminDAO;
    private final CoachDAO coachDAO;
    private final StudentDAO studentDAO;
    private final PasswordEncoder passwordEncoder;
    private final AuthorizationService authorizationService;
    private final AuthContextService authContextService;

    public AccountCreationService(UserDAO userDAO,
                                  AdminDAO adminDAO,
                                  CoachDAO coachDAO,
                                  StudentDAO studentDAO,
                                  PasswordEncoder passwordEncoder,
                                  AuthorizationService authorizationService,
                                  AuthContextService authContextService) {
        this.userDAO = userDAO;
        this.adminDAO = adminDAO;
        this.coachDAO = coachDAO;
        this.studentDAO = studentDAO;
        this.passwordEncoder = passwordEncoder;
        this.authorizationService = authorizationService;
        this.authContextService = authContextService;
    }

    @Transactional
    public CreateAccountResponseDTO createAccount(CreateAccountRequestDTO request, HttpSession session) {
        var ctx = authContextService.requireContext(session);
        authorizationService.requireAdmin(ctx.role());

        validateRequest(request);

        String email = request.getEmail().trim().toLowerCase();
        if (userDAO.getByEmail(email) != null) {
            throw new ConflictException("ACCOUNT_EMAIL_EXISTS", "Email already exists.");
        }

        String passwordHash = passwordEncoder.encode(request.getPassword());

        User user = new User(
                null,
                email,
                passwordHash,
                request.getRole(),
                true,
                null,
                null
        );

        int userId = userDAO.insert(user);

        switch (request.getRole()) {
            case ADMIN -> {
                Admin admin = new Admin(
                        null,
                        userId,
                        request.getFirstName(),
                        request.getLastName(),
                        request.getPhone(),
                        request.getAdminLevel(),
                        null,
                        null
                );
                int adminId = adminDAO.insert(admin);
                return new CreateAccountResponseDTO(userId, User.Role.ADMIN, adminId, buildDisplayName(request));
            }
            case COACH -> {
                Coach coach = new Coach(
                        null,
                        userId,
                        request.getFirstName(),
                        request.getLastName(),
                        request.getPhone(),
                        request.getDateOfBirth(),
                        request.getCertification(),
                        request.getExperienceYears(),
                        request.getBio(),
                        null,
                        null
                );
                int coachId = coachDAO.insert(coach);
                return new CreateAccountResponseDTO(userId, User.Role.COACH, coachId, buildDisplayName(request));
            }
            case STUDENT -> {
                Student student = new Student(
                        null,
                        userId,
                        request.getFirstName(),
                        request.getLastName(),
                        request.getPreferredName(),
                        request.getPhone(),
                        request.getDateOfBirth(),
                        request.getSkillLevel(),
                        request.getNotes(),
                        request.getEmergencyContactName(),
                        request.getEmergencyContactPhone(),
                        null,
                        null
                );
                int studentId = studentDAO.insert(student);
                return new CreateAccountResponseDTO(userId, User.Role.STUDENT, studentId, buildDisplayName(request));
            }
            default -> throw new BadRequestException("VALIDATION_ERROR", "User Role does not exist or empty.");
        }
    }

    private void validateRequest(CreateAccountRequestDTO request) {
        if (request == null) {
            throw new BadRequestException("VALIDATION_ERROR", "Request cannot be null.");
        }
        if (request.getEmail() == null || request.getEmail().trim().isEmpty()) {
            throw new BadRequestException("VALIDATION_ERROR", "Email cannot be empty.");
        }
        if (request.getPassword() == null || request.getPassword().trim().isEmpty()) {
            throw new BadRequestException("VALIDATION_ERROR", "Password cannot be empty.");
        }
        if (request.getRole() == null) {
            throw new BadRequestException("VALIDATION_ERROR", "Role cannot be empty.");
        }

        // Minimal required fields by role (you can tighten later)
        if (request.getFirstName() == null || request.getFirstName().trim().isEmpty()) {
            throw new BadRequestException("VALIDATION_ERROR", "First Name cannot be empty.");
        }
        if (request.getLastName() == null || request.getLastName().trim().isEmpty()) {
            throw new BadRequestException("VALIDATION_ERROR", "Last Name cannot be empty.");
        }
    }

    private String buildDisplayName(CreateAccountRequestDTO request) {
        if (request.getRole() == User.Role.STUDENT
                && request.getPreferredName() != null
                && !request.getPreferredName().trim().isEmpty()) {
            return request.getPreferredName().trim();
        }
        return request.getFirstName().trim() + " " + request.getLastName().trim();
    }
}
