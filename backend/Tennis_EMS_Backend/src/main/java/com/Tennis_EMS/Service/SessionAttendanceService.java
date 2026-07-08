package com.Tennis_EMS.Service;

import com.Tennis_EMS.DAO.EnrollmentDAO;
import com.Tennis_EMS.DAO.SessionAttendanceDAO;
import com.Tennis_EMS.DAO.SessionDAO;
import com.Tennis_EMS.DAO.StudentDAO;
import com.Tennis_EMS.DTO.MarkAttendanceRequestDTO;
import com.Tennis_EMS.DTO.SessionAttendanceDetailDTO;
import com.Tennis_EMS.DTO.SessionAttendanceSummaryDTO;
import com.Tennis_EMS.Entity.Enrollment;
import com.Tennis_EMS.Entity.Session;
import com.Tennis_EMS.Entity.SessionAttendance;
import com.Tennis_EMS.Entity.Student;
import com.Tennis_EMS.Entity.User;
import com.Tennis_EMS.Exception.BadRequestException;
import com.Tennis_EMS.Exception.ConflictException;
import com.Tennis_EMS.Exception.ForbiddenException;
import com.Tennis_EMS.Exception.NotFoundException;
import com.Tennis_EMS.Service.Authorization.AuthorizationService;
import com.Tennis_EMS.Service.Authorization.AuthContextService;
import jakarta.servlet.http.HttpSession;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;

@Service
public class SessionAttendanceService {

    private final SessionAttendanceDAO sessionAttendanceDAO;
    private final SessionDAO sessionDAO;
    private final StudentDAO studentDAO;
    private final EnrollmentDAO enrollmentDAO;
    private final AuthContextService authContextService;
    private final AuthorizationService authorizationService;
    private final IdentityService identityService;

    public SessionAttendanceService(SessionAttendanceDAO sessionAttendanceDAO,
                                    SessionDAO sessionDAO,
                                    StudentDAO studentDAO,
                                    EnrollmentDAO enrollmentDAO,
                                    AuthContextService authContextService,
                                    AuthorizationService authorizationService,
                                    IdentityService identityService) {
        this.sessionAttendanceDAO = sessionAttendanceDAO;
        this.sessionDAO = sessionDAO;
        this.studentDAO = studentDAO;
        this.enrollmentDAO = enrollmentDAO;
        this.authContextService = authContextService;
        this.authorizationService = authorizationService;
        this.identityService = identityService;
    }

    public SessionAttendanceDetailDTO markAttendance(MarkAttendanceRequestDTO request,
                                                     HttpSession httpSession) {
        var ctx = authContextService.requireContext(httpSession);
        authorizationService.requireAdminOrCoach(ctx.role());

        validateMarkRequest(request);

        Session session = requireSession(request.getSessionId());
        Student student = requireStudent(request.getStudentId());

        SessionAttendance.Status status = parseApiStatus(request.getStatus());
        SessionAttendance.Source source = parseSource(request.getSource());

        if (source == SessionAttendance.Source.SECTION) {
            Integer sectionId = session.getSectionId();
            if (sectionId == null) {
                throw new ConflictException("ENROLLMENT_REQUIRED",
                        "Session is not linked to a section for enrollment check.");
            }

            Enrollment enrollment = enrollmentDAO.get(student.getStudentId(), sectionId);
            if (enrollment == null || enrollment.getStatus() != Enrollment.Status.ENROLLED) {
                throw new ConflictException("ENROLLMENT_REQUIRED",
                        "Student must be enrolled in the section to mark attendance from SECTION.");
            }
        }

        SessionAttendance existing = sessionAttendanceDAO.get(request.getSessionId(),
                request.getStudentId());

        LocalDateTime now = LocalDateTime.now();

        if (existing != null) {
            // upsert: update status and optionally source
            sessionAttendanceDAO.updateStatus(existing.getSessionId(),
                    existing.getStudentId(),
                    status.name());
            if (existing.getSource() != source) {
                sessionAttendanceDAO.updateSource(existing.getSessionId(),
                        existing.getStudentId(),
                        source.name());
            }
            existing.setStatusFromString(status.name());
            existing.setSourceFromString(source.name());
            existing.setUpdatedAt(now);
            return toDetailDTO(existing);
        }

        SessionAttendance sa = new SessionAttendance();
        sa.setSessionId(request.getSessionId());
        sa.setStudentId(request.getStudentId());
        sa.setStatusFromString(status.name());
        sa.setSourceFromString(source.name());
        sa.setCreatedAt(now);
        sa.setUpdatedAt(now);

        boolean ok = sessionAttendanceDAO.insert(sa);
        if (!ok) {
            throw new ConflictException("ATTENDANCE_FAILED", "Failed to save attendance.");
        }

        return toDetailDTO(sa);
    }

    public List<SessionAttendanceSummaryDTO> getAttendanceBySession(int sessionId,
                                                                    HttpSession httpSession) {
        var ctx = authContextService.requireContext(httpSession);
        authorizationService.requireAdminOrCoach(ctx.role());

        requireSession(sessionId);

        return sessionAttendanceDAO.getBySessionId(sessionId).stream()
                .map(sa -> {
                    Student student = studentDAO.getById(sa.getStudentId());
                    String studentName = studentDisplayName(student);
                    String sessionLabel = sessionLabel(sessionDAO.getById(sa.getSessionId()));
                    return toSummaryDTO(sa, studentName, sessionLabel);
                })
                .collect(Collectors.toList());
    }

    public List<SessionAttendanceSummaryDTO> getAttendanceByStudent(int studentId,
                                                                    HttpSession httpSession) {
        requireAdminCoachOrStudentSelf(httpSession, studentId);

        requireStudent(studentId);

        return sessionAttendanceDAO.getByStudentId(studentId).stream()
                .map(sa -> {
                    String studentName = studentDisplayName(studentDAO.getById(sa.getStudentId()));
                    String sessionLabel = sessionLabel(sessionDAO.getById(sa.getSessionId()));
                    return toSummaryDTO(sa, studentName, sessionLabel);
                })
                .collect(Collectors.toList());
    }

    public SessionAttendanceDetailDTO getAttendance(int sessionId,
                                                    int studentId,
                                                    HttpSession httpSession) {
        var ctx = authContextService.requireContext(httpSession);
        authorizationService.requireAdminOrCoach(ctx.role());

        SessionAttendance sa = sessionAttendanceDAO.get(sessionId, studentId);
        if (sa == null) {
            throw new NotFoundException("ATTENDANCE_NOT_FOUND", "Attendance not found.");
        }
        return toDetailDTO(sa);
    }

    private void requireAdminCoachOrStudentSelf(HttpSession httpSession, int studentId) {
        var ctx = authContextService.requireContext(httpSession);
        if (ctx.role() == User.Role.STUDENT) {
            Integer self = identityService.getProfileId(ctx.userId(), User.Role.STUDENT);
            if (self == null || !Objects.equals(self, studentId)) {
                throw new ForbiddenException("FORBIDDEN", "You can only view your own attendance.");
            }
            return;
        }
        authorizationService.requireAdminOrCoach(ctx.role());
    }

    // ===== Helpers =====

    private void validateMarkRequest(MarkAttendanceRequestDTO request) {
        if (request == null) {
            throw new BadRequestException("VALIDATION_ERROR", "Request body is required.");
        }
        if (request.getSessionId() == null) {
            throw new BadRequestException("VALIDATION_ERROR", "Session ID is required.");
        }
        if (request.getStudentId() == null) {
            throw new BadRequestException("VALIDATION_ERROR", "Student ID is required.");
        }
        if (request.getStatus() == null || request.getStatus().trim().isEmpty()) {
            throw new BadRequestException("VALIDATION_ERROR", "Status is required.");
        }
    }

    private SessionAttendance.Status parseApiStatus(String statusStr) {
        String normalized = statusStr == null ? null : statusStr.trim().toUpperCase();
        if (normalized == null) {
            throw new BadRequestException("VALIDATION_ERROR", "Status is required.");
        }
        try {
            SessionAttendance.Status status = SessionAttendance.Status.valueOf(normalized);
            // Only allow PRESENT, LATE, ABSENT, EXCUSED from API
            switch (status) {
                case PRESENT, LATE, ABSENT, EXCUSED -> {
                    return status;
                }
                default -> throw new BadRequestException("VALIDATION_ERROR",
                        "Invalid attendance status. Allowed: PRESENT, LATE, ABSENT, EXCUSED.");
            }
        } catch (IllegalArgumentException ex) {
            throw new BadRequestException("VALIDATION_ERROR",
                    "Invalid attendance status. Allowed: PRESENT, LATE, ABSENT, EXCUSED.");
        }
    }

    private SessionAttendance.Source parseSource(String sourceStr) {
        if (sourceStr == null || sourceStr.trim().isEmpty()) {
            return SessionAttendance.Source.SECTION;
        }
        String normalized = sourceStr.trim().toUpperCase();
        try {
            return SessionAttendance.Source.valueOf(normalized);
        } catch (IllegalArgumentException ex) {
            throw new BadRequestException("VALIDATION_ERROR",
                    "Invalid source. Allowed: SECTION, DROP_IN, ADMIN.");
        }
    }

    private Session requireSession(int sessionId) {
        Session session = sessionDAO.getById(sessionId);
        if (session == null) {
            throw new NotFoundException("SESSION_NOT_FOUND", "Session not found.");
        }
        return session;
    }

    private Student requireStudent(int studentId) {
        Student student = studentDAO.getById(studentId);
        if (student == null) {
            throw new NotFoundException("STUDENT_NOT_FOUND", "Student not found.");
        }
        return student;
    }

    private static String studentDisplayName(Student student) {
        if (student == null) return null;
        if (student.getPreferredName() != null && !student.getPreferredName().trim().isEmpty()) {
            return student.getPreferredName().trim();
        }
        String first = student.getFirstName() != null ? student.getFirstName().trim() : "";
        String last = student.getLastName() != null ? student.getLastName().trim() : "";
        return (first + " " + last).trim();
    }

    private static String sessionLabel(Session session) {
        if (session == null) {
            return null;
        }
        // Session entity currently has no name field
        return "Session " + session.getSessionId();
    }

    private static SessionAttendanceDetailDTO toDetailDTO(SessionAttendance sa) {
        return new SessionAttendanceDetailDTO(
                sa.getSessionId(),
                sa.getStudentId(),
                sa.getStatusStr(),
                sa.getSourceStr(),
                sa.getCreatedAt(),
                sa.getUpdatedAt()
        );
    }

    private static SessionAttendanceSummaryDTO toSummaryDTO(SessionAttendance sa,
                                                            String studentName,
                                                            String sessionLabel) {
        return new SessionAttendanceSummaryDTO(
                sa.getSessionId(),
                sa.getStudentId(),
                sa.getStatusStr(),
                sa.getSourceStr(),
                studentName,
                sessionLabel
        );
    }
}
