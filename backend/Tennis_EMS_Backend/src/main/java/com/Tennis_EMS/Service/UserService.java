package com.Tennis_EMS.Service;

import com.Tennis_EMS.DAO.CourseDAO;
import com.Tennis_EMS.DAO.SectionDAO;
import com.Tennis_EMS.DAO.SessionDAO;
import com.Tennis_EMS.DAO.UserDAO;
import com.Tennis_EMS.DTO.Account.CreateAccountRequestDTO;
import com.Tennis_EMS.DTO.Account.CreateAccountResponseDTO;
import com.Tennis_EMS.DTO.EnrollmentSummaryDTO;
import com.Tennis_EMS.DTO.SectionSummaryDTO;
import com.Tennis_EMS.DTO.SessionAttendanceSummaryDTO;
import com.Tennis_EMS.DTO.SessionSummaryDTO;
import com.Tennis_EMS.DTO.UpdateUserRequestDTO;
import com.Tennis_EMS.DTO.UserDTO;
import com.Tennis_EMS.Entity.Course;
import com.Tennis_EMS.Entity.Section;
import com.Tennis_EMS.Entity.Session;
import com.Tennis_EMS.Entity.User;
import com.Tennis_EMS.Exception.BadRequestException;
import com.Tennis_EMS.Exception.ConflictException;
import com.Tennis_EMS.Exception.NotFoundException;
import com.Tennis_EMS.Service.Authorization.AuthContextService;
import com.Tennis_EMS.Service.Authorization.AuthorizationService;
import jakarta.servlet.http.HttpSession;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class UserService {

    private final UserDAO userDAO;
    private final IdentityService identityService;
    private final EnrollmentService enrollmentService;
    private final SessionAttendanceService sessionAttendanceService;
    private final SectionDAO sectionDAO;
    private final SessionDAO sessionDAO;
    private final CourseDAO courseDAO;
    private final AuthContextService authContextService;
    private final AuthorizationService authorizationService;
    private final AccountCreationService accountCreationService;

    public UserService(UserDAO userDAO,
                       IdentityService identityService,
                       EnrollmentService enrollmentService,
                       SessionAttendanceService sessionAttendanceService,
                       SectionDAO sectionDAO,
                       SessionDAO sessionDAO,
                       CourseDAO courseDAO,
                       AuthContextService authContextService,
                       AuthorizationService authorizationService,
                       AccountCreationService accountCreationService) {
        this.userDAO = userDAO;
        this.identityService = identityService;
        this.enrollmentService = enrollmentService;
        this.sessionAttendanceService = sessionAttendanceService;
        this.sectionDAO = sectionDAO;
        this.sessionDAO = sessionDAO;
        this.courseDAO = courseDAO;
        this.authContextService = authContextService;
        this.authorizationService = authorizationService;
        this.accountCreationService = accountCreationService;
    }

    public List<UserDTO> getAllUsers(HttpSession session) {
        var ctx = authContextService.requireContext(session);
        authorizationService.requireAdmin(ctx.role());

        return userDAO.getAll().stream()
                .map(this::toUserDTO)
                .collect(Collectors.toList());
    }

    public UserDTO getUserById(int userId, HttpSession session) {
        var ctx = authContextService.requireContext(session);
        authorizationService.requireAdminOrSelf(ctx.role(), ctx.userId(), userId);

        User user = requireUser(userId);
        return toUserDTO(user);
    }

    public List<UserDTO> getUsersByRole(String role, HttpSession session) {
        var ctx = authContextService.requireContext(session);
        authorizationService.requireAdmin(ctx.role());

        User.Role parsed = parseRole(role);
        if (parsed == null) {
            throw new BadRequestException("VALIDATION_ERROR", "Invalid role. Supported: admin, coach, student.");
        }

        return userDAO.getByRole(parsed.name()).stream()
                .map(this::toUserDTO)
                .collect(Collectors.toList());
    }

    /**
     * Returns sections this student (user) is enrolled in.
     * Reuses EnrollmentService logic.
     */
    public List<EnrollmentSummaryDTO> getSectionsByStudent(int userId, HttpSession session) {
        var ctx = authContextService.requireContext(session);
        requireCanViewUserData(ctx, userId);

        requireUser(userId);
        Integer studentId = identityService.getProfileId(userId, User.Role.STUDENT);
        if (studentId == null) {
            throw new NotFoundException("STUDENT_PROFILE_NOT_FOUND",
                    "User does not have a student profile.");
        }

        return enrollmentService.getSectionsByStudent(studentId, session);
    }

    /**
     * Returns attendance records for this student (user).
     * Reuses SessionAttendanceService logic.
     */
    public List<SessionAttendanceSummaryDTO> getAttendanceByStudent(int userId, HttpSession session) {
        var ctx = authContextService.requireContext(session);
        requireCanViewUserData(ctx, userId);

        requireUser(userId);
        Integer studentId = identityService.getProfileId(userId, User.Role.STUDENT);
        if (studentId == null) {
            throw new NotFoundException("STUDENT_PROFILE_NOT_FOUND",
                    "User does not have a student profile.");
        }

        return sessionAttendanceService.getAttendanceByStudent(studentId, session);
    }

    /**
     * Returns sections this coach (user) is assigned to.
     * Section.coachId links to Coach; schema supports this relationship.
     */
    public List<SectionSummaryDTO> getSectionsByCoach(int userId, HttpSession session) {
        var ctx = authContextService.requireContext(session);
        requireCanViewUserData(ctx, userId);

        requireUser(userId);
        Integer coachId = identityService.getProfileId(userId, User.Role.COACH);
        if (coachId == null) {
            throw new NotFoundException("COACH_PROFILE_NOT_FOUND",
                    "User does not have a coach profile.");
        }

        List<Section> sections = sectionDAO.getByCoachId(coachId);
        Set<Integer> courseIds = sections.stream()
                .map(Section::getCourseId)
                .filter(id -> id != null)
                .collect(Collectors.toSet());
        Map<Integer, String> courseNamesByCourseId = resolveCourseNames(courseIds);

        return sections.stream()
                .map(s -> toSectionSummaryDTO(s, courseNamesByCourseId.get(s.getCourseId())))
                .collect(Collectors.toList());
    }

    /**
     * Returns sessions for sections this coach (user) is assigned to.
     * Session belongs to Section; coach is linked via Section.coachId.
     */
    public List<SessionSummaryDTO> getSessionsByCoach(int userId, HttpSession session) {
        var ctx = authContextService.requireContext(session);
        requireCanViewUserData(ctx, userId);

        requireUser(userId);
        Integer coachId = identityService.getProfileId(userId, User.Role.COACH);
        if (coachId == null) {
            throw new NotFoundException("COACH_PROFILE_NOT_FOUND",
                    "User does not have a coach profile.");
        }

        List<Section> sections = sectionDAO.getByCoachId(coachId);
        List<SessionSummaryDTO> result = new ArrayList<>();
        for (Section section : sections) {
            Integer sectionId = section.getSectionId();
            if (sectionId == null) continue;

            List<Session> sessions = sessionDAO.getBySectionId(sectionId);
            String sectionName = section.getName();
            String courseName = null;
            if (section.getCourseId() != null) {
                Course course = courseDAO.getById(section.getCourseId());
                courseName = course != null ? course.getName() : null;
            }
            String[] names = new String[]{sectionName, courseName};

            for (Session sess : sessions) {
                result.add(toSessionSummaryDTO(sess, names));
            }
        }
        return result;
    }

    public UserDTO createUser(CreateAccountRequestDTO request, HttpSession session) {
        var ctx = authContextService.requireContext(session);
        authorizationService.requireAdmin(ctx.role());

        if (request == null) {
            throw new BadRequestException("VALIDATION_ERROR", "Request body is required.");
        }

        CreateAccountResponseDTO created = accountCreationService.createAccount(request, session);
        return toUserDTO(requireUser(created.getUserId()));
    }

    public UserDTO updateUser(int userId, UpdateUserRequestDTO request, HttpSession session) {
        var ctx = authContextService.requireContext(session);
        authorizationService.requireAdminOrSelf(ctx.role(), ctx.userId(), userId);

        if (request == null) {
            throw new BadRequestException("VALIDATION_ERROR", "Request body is required.");
        }

        User user = requireUser(userId);

        boolean hasChanges = false;
        if (request.getEmail() != null) {
            String email = request.getEmail().trim().toLowerCase();
            if (email.isEmpty()) {
                throw new BadRequestException("VALIDATION_ERROR", "Email cannot be empty.");
            }

            User existing = userDAO.getByEmail(email);
            if (existing != null && existing.getUserId() != userId) {
                throw new ConflictException("ACCOUNT_EMAIL_EXISTS", "Email already exists.");
            }

            user.setEmail(email);
            hasChanges = true;
        }

        if (request.getIsActive() != null) {
            user.setIsActive(request.getIsActive());
            hasChanges = true;
        }

        if (!hasChanges) {
            return toUserDTO(user);
        }

        boolean updated = userDAO.update(user);
        if (!updated) {
            throw new BadRequestException("USER_UPDATE_FAILED", "Failed to update user.");
        }

        return toUserDTO(requireUser(userId));
    }

    public void deleteUser(int userId, HttpSession session) {
        var ctx = authContextService.requireContext(session);
        authorizationService.requireAdmin(ctx.role());

        User user = requireUser(userId);
        // Soft-delete via isActive to avoid FK issues with profile tables and dependent entities.
        user.setIsActive(false);

        boolean updated = userDAO.update(user);
        if (!updated) {
            throw new BadRequestException("USER_DELETE_FAILED", "Failed to delete user.");
        }
    }

    private void requireCanViewUserData(AuthContextService.AuthContext ctx, int targetUserId) {
        if (ctx.role() == User.Role.STUDENT) {
            authorizationService.requireSelf(ctx.userId(), targetUserId);
        } else {
            authorizationService.requireAdminOrCoach(ctx.role());
        }
    }

    private User requireUser(int userId) {
        User user = userDAO.getById(userId);
        if (user == null) {
            throw new NotFoundException("USER_NOT_FOUND", "User not found.");
        }
        return user;
    }

    private User.Role parseRole(String role) {
        return User.Role.parse(role);
    }

    private UserDTO toUserDTO(User user) {
        Integer profileId = null;
        String displayName = null;
        if (user.getRole() != null) {
            profileId = identityService.getProfileId(user.getUserId(), user.getRole());
            displayName = identityService.getDisplayName(user.getUserId(), user.getRole());
        }
        return new UserDTO(
                user.getUserId(),
                user.getEmail(),
                user.getRoleStr(),
                user.getIsActive(),
                profileId,
                displayName
        );
    }

    private Map<Integer, String> resolveCourseNames(Set<Integer> courseIds) {
        Map<Integer, String> map = new HashMap<>();
        for (Integer courseId : courseIds) {
            Course course = courseDAO.getById(courseId);
            if (course != null) {
                map.put(courseId, course.getName());
            }
        }
        return map;
    }

    private static boolean isActive(Section section) {
        return section.getStatus() != null && section.getStatus() != Section.Status.CANCELLED;
    }

    private static SectionSummaryDTO toSectionSummaryDTO(Section section, String courseName) {
        return new SectionSummaryDTO(
                section.getSectionId(),
                section.getCourseId(),
                section.getName(),
                section.getStatusStr(),
                isActive(section),
                courseName
        );
    }

    private static SessionSummaryDTO toSessionSummaryDTO(Session session, String[] sectionAndCourseNames) {
        String sectionName = sectionAndCourseNames != null && sectionAndCourseNames.length > 0
                ? sectionAndCourseNames[0] : null;
        String courseName = sectionAndCourseNames != null && sectionAndCourseNames.length > 1
                ? sectionAndCourseNames[1] : null;
        return new SessionSummaryDTO(
                session.getSessionId(),
                session.getSectionId(),
                session.getStartTime(),
                session.getEndTime(),
                session.getStatusStr(),
                sectionName,
                courseName
        );
    }
}
