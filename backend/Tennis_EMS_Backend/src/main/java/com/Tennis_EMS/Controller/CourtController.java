package com.Tennis_EMS.Controller;

import com.Tennis_EMS.DTO.CourtSummaryDTO;
import com.Tennis_EMS.Service.CourtService;
import jakarta.servlet.http.HttpSession;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/courts")
public class CourtController {

    private final CourtService courtService;

    public CourtController(CourtService courtService) {
        this.courtService = courtService;
    }

    @GetMapping
    public ResponseEntity<List<CourtSummaryDTO>> listCourts(HttpSession session) {
        return ResponseEntity.ok(courtService.listCourts(session));
    }
}
