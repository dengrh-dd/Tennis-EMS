package com.Tennis_EMS.Controller;

import com.Tennis_EMS.DTO.CreateSessionRequestDTO;
import com.Tennis_EMS.DTO.SessionDetailDTO;
import com.Tennis_EMS.DTO.SessionSummaryDTO;
import com.Tennis_EMS.DTO.UpdateSessionRequestDTO;
import com.Tennis_EMS.Service.SessionService;
import jakarta.servlet.http.HttpSession;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/sessions")
public class SessionController {

    private final SessionService sessionService;

    public SessionController(SessionService sessionService) {
        this.sessionService = sessionService;
    }

    @PostMapping
    public ResponseEntity<SessionDetailDTO> createSession(@RequestBody CreateSessionRequestDTO request, HttpSession session) {
        SessionDetailDTO created = sessionService.createSession(request, session);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @PutMapping("/{sessionId}")
    public ResponseEntity<SessionDetailDTO> updateSession(@PathVariable int sessionId,
                                                         @RequestBody UpdateSessionRequestDTO request,
                                                         HttpSession session) {
        SessionDetailDTO updated = sessionService.updateSession(sessionId, request, session);
        return ResponseEntity.ok(updated);
    }

    @GetMapping("/{sessionId}")
    public ResponseEntity<SessionDetailDTO> getSessionById(@PathVariable int sessionId) {
        SessionDetailDTO detail = sessionService.getSessionById(sessionId);
        return ResponseEntity.ok(detail);
    }

    @GetMapping
    public ResponseEntity<List<SessionSummaryDTO>> getAllSessions(HttpSession session) {
        List<SessionSummaryDTO> list = sessionService.getAllSessions(session);
        return ResponseEntity.ok(list);
    }

    @GetMapping("/upcoming")
    public ResponseEntity<List<SessionSummaryDTO>> getUpcomingSessions() {
        List<SessionSummaryDTO> list = sessionService.getUpcomingSessions();
        return ResponseEntity.ok(list);
    }

    @PatchMapping("/{sessionId}/cancel")
    public ResponseEntity<SessionDetailDTO> cancelSession(@PathVariable int sessionId, HttpSession session) {
        SessionDetailDTO cancelled = sessionService.cancelSession(sessionId, session);
        return ResponseEntity.ok(cancelled);
    }
}
