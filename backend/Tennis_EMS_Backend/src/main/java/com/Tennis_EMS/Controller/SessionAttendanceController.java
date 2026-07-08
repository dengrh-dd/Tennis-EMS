package com.Tennis_EMS.Controller;

import com.Tennis_EMS.DTO.MarkAttendanceRequestDTO;
import com.Tennis_EMS.DTO.SessionAttendanceDetailDTO;
import com.Tennis_EMS.DTO.SessionAttendanceSummaryDTO;
import com.Tennis_EMS.Service.SessionAttendanceService;
import jakarta.servlet.http.HttpSession;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/session-attendance")
public class SessionAttendanceController {

    private final SessionAttendanceService sessionAttendanceService;

    public SessionAttendanceController(SessionAttendanceService sessionAttendanceService) {
        this.sessionAttendanceService = sessionAttendanceService;
    }

    @PostMapping
    public ResponseEntity<SessionAttendanceDetailDTO> markAttendance(
            @RequestBody MarkAttendanceRequestDTO request,
            HttpSession session) {
        SessionAttendanceDetailDTO dto = sessionAttendanceService.markAttendance(request, session);
        return ResponseEntity.status(HttpStatus.OK).body(dto);
    }

    @GetMapping("/session/{sessionId}")
    public ResponseEntity<List<SessionAttendanceSummaryDTO>> getAttendanceBySession(
            @PathVariable int sessionId,
            HttpSession session) {
        List<SessionAttendanceSummaryDTO> list =
                sessionAttendanceService.getAttendanceBySession(sessionId, session);
        return ResponseEntity.ok(list);
    }

    @GetMapping("/student/{studentId}")
    public ResponseEntity<List<SessionAttendanceSummaryDTO>> getAttendanceByStudent(
            @PathVariable int studentId,
            HttpSession session) {
        List<SessionAttendanceSummaryDTO> list =
                sessionAttendanceService.getAttendanceByStudent(studentId, session);
        return ResponseEntity.ok(list);
    }

    @GetMapping("/session/{sessionId}/student/{studentId}")
    public ResponseEntity<SessionAttendanceDetailDTO> getAttendance(
            @PathVariable int sessionId,
            @PathVariable int studentId,
            HttpSession session) {
        SessionAttendanceDetailDTO dto =
                sessionAttendanceService.getAttendance(sessionId, studentId, session);
        return ResponseEntity.ok(dto);
    }
}
