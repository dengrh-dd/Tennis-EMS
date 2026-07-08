package com.Tennis_EMS.Controller;

import com.Tennis_EMS.DTO.ScoringFormatResponseDTO;
import com.Tennis_EMS.Service.ScoringFormatService;
import jakarta.servlet.http.HttpSession;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/scoring-formats")
public class ScoringFormatController {

    private final ScoringFormatService scoringFormatService;

    public ScoringFormatController(ScoringFormatService scoringFormatService) {
        this.scoringFormatService = scoringFormatService;
    }

    @GetMapping("/active")
    public ResponseEntity<List<ScoringFormatResponseDTO>> getActive(HttpSession session) {
        return ResponseEntity.ok(scoringFormatService.getActiveFormats(session));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ScoringFormatResponseDTO> getById(@PathVariable int id, HttpSession session) {
        return ResponseEntity.ok(scoringFormatService.getById(id, session));
    }
}
