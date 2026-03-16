package com.Tennis_EMS.Controller;

import com.Tennis_EMS.DTO.CreateCourseRequestDTO;
import com.Tennis_EMS.DTO.CourseDetailDTO;
import com.Tennis_EMS.DTO.CourseSummaryDTO;
import com.Tennis_EMS.DTO.UpdateCourseRequestDTO;
import com.Tennis_EMS.DTO.SectionSummaryDTO;
import com.Tennis_EMS.Service.CourseService;
import com.Tennis_EMS.Service.SectionService;
import jakarta.servlet.http.HttpSession;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/courses")
public class CourseController {

    private final CourseService courseService;
    private final SectionService sectionService;

    public CourseController(CourseService courseService, SectionService sectionService) {
        this.courseService = courseService;
        this.sectionService = sectionService;
    }

    @PostMapping
    public ResponseEntity<CourseDetailDTO> createCourse(@RequestBody CreateCourseRequestDTO request, HttpSession session) {
        CourseDetailDTO created = courseService.createCourse(request, session);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @PutMapping("/{courseId}")
    public ResponseEntity<CourseDetailDTO> updateCourse(@PathVariable int courseId,
                                                        @RequestBody UpdateCourseRequestDTO request,
                                                        HttpSession session) {
        CourseDetailDTO updated = courseService.updateCourse(courseId, request, session);
        return ResponseEntity.ok(updated);
    }

    @GetMapping
    public ResponseEntity<List<CourseSummaryDTO>> getAllCourses(HttpSession session) {
        List<CourseSummaryDTO> courses = courseService.getAllCourses(session);
        return ResponseEntity.ok(courses);
    }

    @GetMapping("/active")
    public ResponseEntity<List<CourseSummaryDTO>> getActiveCourses() {
        List<CourseSummaryDTO> courses = courseService.getActiveCourses();
        return ResponseEntity.ok(courses);
    }

    @GetMapping("/{courseId}")
    public ResponseEntity<CourseDetailDTO> getCourseById(@PathVariable int courseId) {
        CourseDetailDTO course = courseService.getCourseById(courseId);
        return ResponseEntity.ok(course);
    }

    @GetMapping("/{courseId}/sections")
    public ResponseEntity<List<SectionSummaryDTO>> getSectionsByCourseId(@PathVariable int courseId) {
        List<SectionSummaryDTO> sections = sectionService.getSectionsByCourseId(courseId);
        return ResponseEntity.ok(sections);
    }

    @PatchMapping("/{courseId}/archive")
    public ResponseEntity<CourseDetailDTO> archiveCourse(@PathVariable int courseId, HttpSession session) {
        CourseDetailDTO archived = courseService.archiveCourse(courseId, session);
        return ResponseEntity.ok(archived);
    }
}
