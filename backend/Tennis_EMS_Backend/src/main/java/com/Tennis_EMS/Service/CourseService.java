package com.Tennis_EMS.Service;

import com.Tennis_EMS.DAO.CourseDAO;
import com.Tennis_EMS.DAO.SectionDAO;
import com.Tennis_EMS.DTO.CreateCourseRequestDTO;
import com.Tennis_EMS.DTO.CourseDetailDTO;
import com.Tennis_EMS.DTO.CourseSummaryDTO;
import com.Tennis_EMS.DTO.UpdateCourseRequestDTO;
import com.Tennis_EMS.Entity.Course;
import com.Tennis_EMS.Exception.BadRequestException;
import com.Tennis_EMS.Exception.ConflictException;
import com.Tennis_EMS.Exception.NotFoundException;
import com.Tennis_EMS.Service.Authorization.AuthorizationService;
import com.Tennis_EMS.Service.Authorization.AuthContextService;
import jakarta.servlet.http.HttpSession;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class CourseService {

    private final CourseDAO courseDAO;
    private final SectionDAO sectionDAO;
    private final AuthContextService authContextService;
    private final AuthorizationService authorizationService;

    public CourseService(CourseDAO courseDAO,
                         SectionDAO sectionDAO,
                         AuthContextService authContextService,
                         AuthorizationService authorizationService) {
        this.courseDAO = courseDAO;
        this.sectionDAO = sectionDAO;
        this.authContextService = authContextService;
        this.authorizationService = authorizationService;
    }

    public CourseDetailDTO createCourse(CreateCourseRequestDTO request, HttpSession session) {
        var ctx = authContextService.requireContext(session);
        authorizationService.requireAdmin(ctx.role());

        validateCreateRequest(request);

        String courseNumber = request.getCourseNumber().trim();
        if (courseDAO.getByCourseNumber(courseNumber) != null) {
            throw new ConflictException("COURSE_NUMBER_EXISTS", "Course number already exists.");
        }

        Course.Level level = parseLevel(request.getLevel());
        Boolean isActive = request.getIsActive() != null ? request.getIsActive() : true;

        Course course = new Course();
        course.setName(request.getName().trim());
        course.setCourseNumber(courseNumber);
        course.setDescription(request.getDescription() != null ? request.getDescription().trim() : null);
        course.setLevel(level);
        course.setIsActive(isActive);

        int id = courseDAO.insert(course);
        course.setCourseId(id);

        return toDetailDTO(course, 0);
    }

    public CourseDetailDTO updateCourse(int courseId, UpdateCourseRequestDTO request, HttpSession session) {
        var ctx = authContextService.requireContext(session);
        authorizationService.requireAdmin(ctx.role());

        Course course = requireCourse(courseId);

        if (request.getName() != null && !request.getName().trim().isEmpty()) {
            course.setName(request.getName().trim());
        }
        if (request.getCourseNumber() != null && !request.getCourseNumber().trim().isEmpty()) {
            String newNumber = request.getCourseNumber().trim();
            if (!newNumber.equals(course.getCourseNumber())) {
                if (courseDAO.getByCourseNumber(newNumber) != null) {
                    throw new ConflictException("COURSE_NUMBER_EXISTS", "Course number already exists.");
                }
                course.setCourseNumber(newNumber);
            }
        }
        if (request.getDescription() != null) {
            String trimmed = request.getDescription().trim();
            course.setDescription(trimmed.isEmpty() ? null : trimmed);
        }
        if (request.getLevel() != null && !request.getLevel().trim().isEmpty()) {
            course.setLevel(parseLevel(request.getLevel()));
        }
        if (request.getIsActive() != null) {
            course.setIsActive(request.getIsActive());
        }

        courseDAO.update(course);

        int sectionCount = sectionDAO.getByCourseId(courseId).size();
        return toDetailDTO(course, sectionCount);
    }

    public CourseDetailDTO getCourseById(int courseId) {
        Course course = requireCourse(courseId);
        int sectionCount = sectionDAO.getByCourseId(courseId).size();
        return toDetailDTO(course, sectionCount);
    }

    public List<CourseSummaryDTO> getAllCourses(HttpSession session) {
        var ctx = authContextService.requireContext(session);
        authorizationService.requireAdmin(ctx.role());

        return courseDAO.getAll().stream()
                .map(this::toSummaryDTO)
                .collect(Collectors.toList());
    }

    public List<CourseSummaryDTO> getActiveCourses() {
        return courseDAO.getAll().stream()
                .filter(c -> Boolean.TRUE.equals(c.getIsActive()))
                .map(this::toSummaryDTO)
                .collect(Collectors.toList());
    }

    public CourseDetailDTO archiveCourse(int courseId, HttpSession session) {
        var ctx = authContextService.requireContext(session);
        authorizationService.requireAdmin(ctx.role());

        Course course = requireCourse(courseId);
        course.setIsActive(false);
        courseDAO.update(course);

        int sectionCount = sectionDAO.getByCourseId(courseId).size();
        return toDetailDTO(course, sectionCount);
    }

    private void validateCreateRequest(CreateCourseRequestDTO request) {
        if (request == null) {
            throw new BadRequestException("VALIDATION_ERROR", "Request body is required.");
        }
        if (request.getName() == null || request.getName().trim().isEmpty()) {
            throw new BadRequestException("VALIDATION_ERROR", "Name cannot be blank.");
        }
        if (request.getCourseNumber() == null || request.getCourseNumber().trim().isEmpty()) {
            throw new BadRequestException("VALIDATION_ERROR", "Course number cannot be blank.");
        }
        if (request.getLevel() == null || request.getLevel().trim().isEmpty()) {
            throw new BadRequestException("VALIDATION_ERROR", "Level is required.");
        }
        parseLevel(request.getLevel());
    }

    private Course.Level parseLevel(String levelStr) {
        if (levelStr == null || levelStr.trim().isEmpty()) {
            throw new BadRequestException("VALIDATION_ERROR", "Level is required.");
        }
        Course temp = new Course();
        temp.setLevelFromString(levelStr);
        if (temp.getLevel() == null) {
            throw new BadRequestException("VALIDATION_ERROR",
                    "Invalid level. Must be one of: BEGINNER, INTERMEDIATE, ADVANCED.");
        }
        return temp.getLevel();
    }

    private Course requireCourse(int courseId) {
        Course course = courseDAO.getById(courseId);
        if (course == null) {
            throw new NotFoundException("COURSE_NOT_FOUND", "Course not found.");
        }
        return course;
    }

    private CourseSummaryDTO toSummaryDTO(Course course) {
        return new CourseSummaryDTO(
                course.getCourseId(),
                course.getName(),
                course.getCourseNumber(),
                course.getLevelStr(),
                course.getIsActive()
        );
    }

    private CourseDetailDTO toDetailDTO(Course course, int sectionCount) {
        return new CourseDetailDTO(
                course.getCourseId(),
                course.getName(),
                course.getCourseNumber(),
                course.getDescription(),
                course.getLevelStr(),
                course.getIsActive(),
                sectionCount
        );
    }
}
