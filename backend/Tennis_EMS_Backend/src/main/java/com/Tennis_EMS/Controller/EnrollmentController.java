package com.Tennis_EMS.Controller;

import com.Tennis_EMS.DTO.EnrollRequestDTO;
import com.Tennis_EMS.DTO.EnrollmentDetailDTO;
import com.Tennis_EMS.DTO.EnrollmentSummaryDTO;
import com.Tennis_EMS.Service.EnrollmentService;
import jakarta.servlet.http.HttpSession;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/enrollments")
public class EnrollmentController {

    private final EnrollmentService enrollmentService;

    public EnrollmentController(EnrollmentService enrollmentService) {
        this.enrollmentService = enrollmentService;
    }

    @PostMapping
    public ResponseEntity<EnrollmentDetailDTO> enrollStudent(@RequestBody EnrollRequestDTO request, HttpSession session) {
        EnrollmentDetailDTO created = enrollmentService.enrollStudent(request, session);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @PatchMapping("/drop")
    public ResponseEntity<EnrollmentDetailDTO> dropStudent(@RequestBody EnrollRequestDTO request, HttpSession session) {
        EnrollmentDetailDTO updated = enrollmentService.dropStudent(request, session);
        return ResponseEntity.ok(updated);
    }

    @GetMapping("/section/{sectionId}")
    public ResponseEntity<List<EnrollmentSummaryDTO>> getStudentsBySection(@PathVariable int sectionId,
                                                                           HttpSession session) {
        List<EnrollmentSummaryDTO> list = enrollmentService.getStudentsBySection(sectionId, session);
        return ResponseEntity.ok(list);
    }

    @GetMapping("/student/{studentId}")
    public ResponseEntity<List<EnrollmentSummaryDTO>> getSectionsByStudent(@PathVariable int studentId,
                                                                            HttpSession session) {
        List<EnrollmentSummaryDTO> list = enrollmentService.getSectionsByStudent(studentId, session);
        return ResponseEntity.ok(list);
    }
}
