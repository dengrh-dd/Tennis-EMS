package com.Tennis_EMS.Controller;

import com.Tennis_EMS.DTO.MatchSummaryResponseDTO;
import com.Tennis_EMS.DTO.UpsertMatchSummaryRequestDTO;
import com.Tennis_EMS.Service.MatchSummaryService;
import jakarta.servlet.http.HttpSession;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/matches/{matchId}/summary")
public class MatchSummaryController {

    private final MatchSummaryService matchSummaryService;

    public MatchSummaryController(MatchSummaryService matchSummaryService) {
        this.matchSummaryService = matchSummaryService;
    }

    @GetMapping
    public ResponseEntity<MatchSummaryResponseDTO> getByMatch(@PathVariable int matchId, HttpSession session) {
        return ResponseEntity.ok(matchSummaryService.getByMatch(matchId, session));
    }

    @PutMapping
    public ResponseEntity<MatchSummaryResponseDTO> upsert(@PathVariable int matchId,
                                                          @RequestBody UpsertMatchSummaryRequestDTO request,
                                                          HttpSession session) {
        return ResponseEntity.ok(matchSummaryService.upsert(matchId, request, session));
    }
}
