package com.Tennis_EMS.Service;

import com.Tennis_EMS.DAO.CourseDAO;
import com.Tennis_EMS.DAO.SectionDAO;
import com.Tennis_EMS.DTO.CreateSectionRequestDTO;
import com.Tennis_EMS.DTO.SectionDetailDTO;
import com.Tennis_EMS.DTO.SectionSummaryDTO;
import com.Tennis_EMS.DTO.UpdateSectionRequestDTO;
import com.Tennis_EMS.Entity.Course;
import com.Tennis_EMS.Entity.Section;
import com.Tennis_EMS.Exception.BadRequestException;
import com.Tennis_EMS.Exception.NotFoundException;
import com.Tennis_EMS.Service.Authorization.AuthorizationService;
import com.Tennis_EMS.Service.Authorization.AuthContextService;
import jakarta.servlet.http.HttpSession;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class SectionService {

    private final SectionDAO sectionDAO;
    private final CourseDAO courseDAO;
    private final AuthContextService authContextService;
    private final AuthorizationService authorizationService;

    public SectionService(SectionDAO sectionDAO,
                          CourseDAO courseDAO,
                          AuthContextService authContextService,
                          AuthorizationService authorizationService) {
        this.sectionDAO = sectionDAO;
        this.courseDAO = courseDAO;
        this.authContextService = authContextService;
        this.authorizationService = authorizationService;
    }

    public SectionDetailDTO createSection(CreateSectionRequestDTO request, HttpSession session) {
        var ctx = authContextService.requireContext(session);
        authorizationService.requireAdmin(ctx.role());

        validateCreateRequest(request);

        Course course = requireCourse(request.getCourseId());

        Section section = new Section();
        section.setCourseId(request.getCourseId());
        section.setCoachId(request.getCoachId() != null ? request.getCoachId() : 0);
        section.setName(request.getName().trim());
        section.setSyllabus(blankToNull(request.getSyllabus()));
        section.setStartDate(request.getStartDate());
        section.setEndDate(request.getEndDate());
        section.setMaxStudents(request.getMaxStudents());

        if (request.getEnrollmentMode() != null && !request.getEnrollmentMode().trim().isEmpty()) {
            section.setEnrollmentModeFromString(request.getEnrollmentMode().trim());
        }
        if (request.getStatus() != null && !request.getStatus().trim().isEmpty()) {
            section.setStatusFromString(request.getStatus().trim());
        } else if (Boolean.FALSE.equals(request.getIsActive())) {
            section.setStatusFromString(Section.Status.CANCELLED.name());
        } else {
            section.setStatusFromString(Section.Status.PLANNED.name());
        }

        int id = sectionDAO.insert(section);
        section.setSectionId(id);

        return toDetailDTO(section, course.getName());
    }

    public SectionDetailDTO updateSection(int sectionId, UpdateSectionRequestDTO request, HttpSession session) {
        var ctx = authContextService.requireContext(session);
        authorizationService.requireAdmin(ctx.role());

        Section section = requireSection(sectionId);
        Course course = requireCourse(section.getCourseId());

        if (request.getCourseId() != null) {
            Course newCourse = courseDAO.getById(request.getCourseId());
            if (newCourse == null) {
                throw new NotFoundException("COURSE_NOT_FOUND", "Course not found.");
            }
            section.setCourseId(request.getCourseId());
            course = newCourse;
        }
        if (request.getCoachId() != null) {
            section.setCoachId(request.getCoachId());
        }
        if (request.getName() != null && !request.getName().trim().isEmpty()) {
            section.setName(request.getName().trim());
        }
        if (request.getSyllabus() != null) {
            section.setSyllabus(blankToNull(request.getSyllabus()));
        }
        if (request.getStartDate() != null) {
            section.setStartDate(request.getStartDate());
        }
        if (request.getEndDate() != null) {
            section.setEndDate(request.getEndDate());
        }
        if (request.getMaxStudents() != null) {
            section.setMaxStudents(request.getMaxStudents());
        }
        if (request.getEnrollmentMode() != null && !request.getEnrollmentMode().trim().isEmpty()) {
            section.setEnrollmentModeFromString(request.getEnrollmentMode().trim());
        }
        if (request.getStatus() != null && !request.getStatus().trim().isEmpty()) {
            section.setStatusFromString(request.getStatus().trim());
        }
        if (request.getIsActive() != null && !request.getIsActive()) {
            section.setStatusFromString(Section.Status.CANCELLED.name());
        }

        sectionDAO.update(section);

        course = section.getCourseId().equals(course.getCourseId()) ? course : requireCourse(section.getCourseId());
        return toDetailDTO(section, course.getName());
    }

    public SectionDetailDTO getSectionById(int sectionId) {
        Section section = requireSection(sectionId);
        Course course = section.getCourseId() != null ? courseDAO.getById(section.getCourseId()) : null;
        String courseName = course != null ? course.getName() : null;
        return toDetailDTO(section, courseName);
    }

    public List<SectionSummaryDTO> getAllSections(HttpSession session) {
        var ctx = authContextService.requireContext(session);
        authorizationService.requireAdmin(ctx.role());

        List<Section> all = sectionDAO.getAll();
        Map<Integer, String> courseNamesByCourseId = resolveCourseNames(
                all.stream()
                        .map(Section::getCourseId)
                        .filter(id -> id != null)
                        .collect(Collectors.toSet()));

        return all.stream()
                .map(s -> toSummaryDTO(s, courseNamesByCourseId.get(s.getCourseId())))
                .collect(Collectors.toList());
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

    public List<SectionSummaryDTO> getSectionsByCourseId(int courseId) {
        requireCourse(courseId);
        Course course = courseDAO.getById(courseId);
        String courseName = course != null ? course.getName() : null;
        return sectionDAO.getByCourseId(courseId).stream()
                .map(s -> toSummaryDTO(s, courseName))
                .collect(Collectors.toList());
    }

    public List<SectionSummaryDTO> getActiveSections() {
        return sectionDAO.getAll().stream()
                .filter(s -> s.getStatus() != Section.Status.CANCELLED)
                .map(this::toSummaryDTO)
                .collect(Collectors.toList());
    }

    public SectionDetailDTO archiveSection(int sectionId, HttpSession session) {
        var ctx = authContextService.requireContext(session);
        authorizationService.requireAdmin(ctx.role());

        Section section = requireSection(sectionId);
        section.setStatusFromString(Section.Status.CANCELLED.name());
        sectionDAO.update(section);

        Course course = section.getCourseId() != null ? courseDAO.getById(section.getCourseId()) : null;
        String courseName = course != null ? course.getName() : null;
        return toDetailDTO(section, courseName);
    }

    private void validateCreateRequest(CreateSectionRequestDTO request) {
        if (request == null) {
            throw new BadRequestException("VALIDATION_ERROR", "Request body is required.");
        }
        if (request.getCourseId() == null) {
            throw new BadRequestException("VALIDATION_ERROR", "Course ID is required.");
        }
        if (request.getName() == null || request.getName().trim().isEmpty()) {
            throw new BadRequestException("VALIDATION_ERROR", "Section name cannot be blank.");
        }
    }

    private static String blankToNull(String value) {
        if (value == null) return null;
        String trimmed = value.trim();
        return trimmed.isEmpty() ? null : trimmed;
    }

    private Section requireSection(int sectionId) {
        Section section = sectionDAO.getById(sectionId);
        if (section == null) {
            throw new NotFoundException("SECTION_NOT_FOUND", "Section not found.");
        }
        return section;
    }

    private Course requireCourse(int courseId) {
        Course course = courseDAO.getById(courseId);
        if (course == null) {
            throw new NotFoundException("COURSE_NOT_FOUND", "Course not found.");
        }
        return course;
    }

    private boolean isActive(Section section) {
        return section.getStatus() != null && section.getStatus() != Section.Status.CANCELLED;
    }

    private SectionSummaryDTO toSummaryDTO(Section section) {
        Course course = section.getCourseId() != null ? courseDAO.getById(section.getCourseId()) : null;
        return toSummaryDTO(section, course != null ? course.getName() : null);
    }

    private SectionSummaryDTO toSummaryDTO(Section section, String courseName) {
        return new SectionSummaryDTO(
                section.getSectionId(),
                section.getCourseId(),
                section.getName(),
                section.getStatusStr(),
                isActive(section),
                courseName
        );
    }

    private SectionDetailDTO toDetailDTO(Section section, String courseName) {
        return new SectionDetailDTO(
                section.getSectionId(),
                section.getCourseId(),
                section.getCoachId(),
                section.getName(),
                section.getSyllabus(),
                section.getStartDate(),
                section.getEndDate(),
                section.getMaxStudents(),
                section.getEnrollmentModeStr(),
                section.getStatusStr(),
                isActive(section),
                courseName,
                section.getCreatedAt(),
                section.getUpdatedAt()
        );
    }
}
