package com.Tennis_EMS.Service;

import com.Tennis_EMS.DAO.EnrollmentDAO;
import com.Tennis_EMS.DAO.SectionDAO;
import com.Tennis_EMS.DAO.StudentDAO;
import com.Tennis_EMS.DTO.EnrollRequestDTO;
import com.Tennis_EMS.DTO.EnrollmentDetailDTO;
import com.Tennis_EMS.DTO.EnrollmentSummaryDTO;
import com.Tennis_EMS.Entity.Enrollment;
import com.Tennis_EMS.Entity.Section;
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
import java.util.HashMap;
import java.util.Objects;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class EnrollmentService {

    private final EnrollmentDAO enrollmentDAO;
    private final StudentDAO studentDAO;
    private final SectionDAO sectionDAO;
    private final AuthContextService authContextService;
    private final AuthorizationService authorizationService;
    private final IdentityService identityService;

    public EnrollmentService(EnrollmentDAO enrollmentDAO,
                             StudentDAO studentDAO,
                             SectionDAO sectionDAO,
                             AuthContextService authContextService,
                             AuthorizationService authorizationService,
                             IdentityService identityService) {
        this.enrollmentDAO = enrollmentDAO;
        this.studentDAO = studentDAO;
        this.sectionDAO = sectionDAO;
        this.authContextService = authContextService;
        this.authorizationService = authorizationService;
        this.identityService = identityService;
    }

    public EnrollmentDetailDTO enrollStudent(EnrollRequestDTO request, HttpSession session) {
        var ctx = authContextService.requireContext(session);
        authorizationService.requireAdmin(ctx.role());

        validateEnrollRequest(request);

        requireStudent(request.getStudentId());
        Section section = requireSection(request.getSectionId());
        requireSectionIsEnrollable(section);

        Enrollment existing = enrollmentDAO.get(request.getStudentId(), request.getSectionId());
        if (existing != null && existing.getStatus() == Enrollment.Status.ENROLLED) {
            throw new ConflictException("ENROLLMENT_EXISTS", "Student is already enrolled in this section.");
        }

        if (section.getMaxStudents() != null) {
            long enrolledCount = enrollmentDAO.getBySectionId(request.getSectionId()).stream()
                    .filter(e -> e.getStatus() == Enrollment.Status.ENROLLED)
                    .count();
            if (enrolledCount >= section.getMaxStudents()) {
                throw new ConflictException("SECTION_FULL", "Section has reached maximum capacity.");
            }
        }

        if (existing != null && existing.getStatus() == Enrollment.Status.DROPPED) {
            enrollmentDAO.updateStatus(request.getStudentId(), request.getSectionId(), Enrollment.Status.ENROLLED.name());
            return new EnrollmentDetailDTO(
                    request.getStudentId(),
                    request.getSectionId(),
                    Enrollment.Status.ENROLLED.name(),
                    existing.getCreatedAt()
            );
        }

        Enrollment enrollment = new Enrollment();
        enrollment.setStudentId(request.getStudentId());
        enrollment.setSectionId(request.getSectionId());
        enrollment.setStatusFromString(Enrollment.Status.ENROLLED.name());
        enrollment.setCreatedAt(LocalDateTime.now());

        boolean inserted = enrollmentDAO.insert(enrollment);
        if (!inserted) {
            throw new ConflictException("ENROLLMENT_FAILED", "Failed to create enrollment.");
        }

        return toDetailDTO(enrollment);
    }

    public EnrollmentDetailDTO dropStudent(EnrollRequestDTO request, HttpSession session) {
        var ctx = authContextService.requireContext(session);
        authorizationService.requireAdmin(ctx.role());

        validateDropRequest(request);
        int studentId = request.getStudentId();
        int sectionId = request.getSectionId();

        Enrollment enrollment = requireEnrollment(studentId, sectionId);
        if (enrollment.getStatus() == Enrollment.Status.DROPPED) {
            throw new ConflictException("ALREADY_DROPPED", "Student already dropped from this section.");
        }

        enrollmentDAO.updateStatus(studentId, sectionId, Enrollment.Status.DROPPED.name());

        return new EnrollmentDetailDTO(
                studentId,
                sectionId,
                Enrollment.Status.DROPPED.name(),
                enrollment.getCreatedAt()
        );
    }

    public List<EnrollmentSummaryDTO> getStudentsBySection(int sectionId, HttpSession session) {
        var ctx = authContextService.requireContext(session);
        authorizationService.requireAdminOrCoach(ctx.role());

        Section section = requireSection(sectionId);
        String sectionName = section.getName();

        return enrollmentDAO.getBySectionId(sectionId).stream()
                .filter(e -> e.getStatus() == Enrollment.Status.ENROLLED)
                .map(e -> {
                    Student student = studentDAO.getById(e.getStudentId());
                    String studentName = studentDisplayName(student);
                    return toSummaryDTO(e, studentName, sectionName);
                })
                .collect(Collectors.toList());
    }

    public List<EnrollmentSummaryDTO> getSectionsByStudent(int studentId, HttpSession session) {
        requireAdminCoachOrStudentSelf(session, studentId);

        requireStudent(studentId);

        List<Enrollment> enrolled = enrollmentDAO.getByStudentId(studentId).stream()
                .filter(e -> e.getStatus() == Enrollment.Status.ENROLLED)
                .collect(Collectors.toList());

        Set<Integer> sectionIds = enrolled.stream()
                .map(Enrollment::getSectionId)
                .filter(id -> id != null)
                .collect(Collectors.toSet());

        Map<Integer, String> sectionNameById = resolveSectionNames(sectionIds);

        return enrolled.stream()
                .map(e -> toSummaryDTO(e, null, sectionNameById.get(e.getSectionId())))
                .collect(Collectors.toList());
    }

    /**
     * Staff may list any student; a student may list only their own profile id.
     */
    private void requireAdminCoachOrStudentSelf(HttpSession session, int studentId) {
        var ctx = authContextService.requireContext(session);
        if (ctx.role() == User.Role.STUDENT) {
            Integer self = identityService.getProfileId(ctx.userId(), User.Role.STUDENT);
            if (self == null || !Objects.equals(self, studentId)) {
                throw new ForbiddenException("FORBIDDEN", "You can only view your own enrollments.");
            }
            return;
        }
        authorizationService.requireAdminOrCoach(ctx.role());
    }

    private void validateEnrollRequest(EnrollRequestDTO request) {
        if (request == null) {
            throw new BadRequestException("VALIDATION_ERROR", "Request body is required.");
        }
        if (request.getStudentId() == null) {
            throw new BadRequestException("VALIDATION_ERROR", "Student ID is required.");
        }
        if (request.getSectionId() == null) {
            throw new BadRequestException("VALIDATION_ERROR", "Section ID is required.");
        }
    }

    private void validateDropRequest(EnrollRequestDTO request) {
        if (request == null) {
            throw new BadRequestException("VALIDATION_ERROR", "Request body is required.");
        }
        if (request.getStudentId() == null) {
            throw new BadRequestException("VALIDATION_ERROR", "Student ID is required.");
        }
        if (request.getSectionId() == null) {
            throw new BadRequestException("VALIDATION_ERROR", "Section ID is required.");
        }
    }

    private void requireSectionIsEnrollable(Section section) {
        if (section.getStatus() == Section.Status.CANCELLED) {
            throw new ConflictException("SECTION_INACTIVE",
                    "Cannot enroll into an inactive or archived section.");
        }
    }

    private Student requireStudent(int studentId) {
        Student student = studentDAO.getById(studentId);
        if (student == null) {
            throw new NotFoundException("STUDENT_NOT_FOUND", "Student not found.");
        }
        return student;
    }

    private Section requireSection(int sectionId) {
        Section section = sectionDAO.getById(sectionId);
        if (section == null) {
            throw new NotFoundException("SECTION_NOT_FOUND", "Section not found.");
        }
        return section;
    }

    private Enrollment requireEnrollment(int studentId, int sectionId) {
        Enrollment enrollment = enrollmentDAO.get(studentId, sectionId);
        if (enrollment == null) {
            throw new NotFoundException("ENROLLMENT_NOT_FOUND", "Enrollment not found.");
        }
        return enrollment;
    }

    private Map<Integer, String> resolveSectionNames(Set<Integer> sectionIds) {
        Map<Integer, String> map = new HashMap<>();
        for (Integer id : sectionIds) {
            Section section = sectionDAO.getById(id);
            if (section != null) {
                map.put(id, section.getName());
            }
        }
        return map;
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

    private static EnrollmentDetailDTO toDetailDTO(Enrollment enrollment) {
        return new EnrollmentDetailDTO(
                enrollment.getStudentId(),
                enrollment.getSectionId(),
                enrollment.getStatusStr(),
                enrollment.getCreatedAt()
        );
    }

    private static EnrollmentSummaryDTO toSummaryDTO(Enrollment enrollment, String studentName, String sectionName) {
        return new EnrollmentSummaryDTO(
                enrollment.getStudentId(),
                enrollment.getSectionId(),
                enrollment.getStatusStr(),
                enrollment.getCreatedAt(),
                studentName,
                sectionName
        );
    }
}
