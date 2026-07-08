package com.Tennis_EMS.Controller;

import com.Tennis_EMS.DTO.CreateMatchSegmentRequestDTO;
import com.Tennis_EMS.DTO.MatchSegmentResponseDTO;
import com.Tennis_EMS.DTO.UpdateMatchSegmentRequestDTO;
import com.Tennis_EMS.Service.MatchSegmentService;
import jakarta.servlet.http.HttpSession;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/matches/{matchId}/segments")
public class MatchSegmentController {

    private final MatchSegmentService matchSegmentService;

    public MatchSegmentController(MatchSegmentService matchSegmentService) {
        this.matchSegmentService = matchSegmentService;
    }

    @GetMapping
    public ResponseEntity<List<MatchSegmentResponseDTO>> getByMatch(@PathVariable int matchId, HttpSession session) {
        return ResponseEntity.ok(matchSegmentService.getByMatch(matchId, session));
    }

    @PostMapping
    public ResponseEntity<MatchSegmentResponseDTO> create(@PathVariable int matchId,
                                                          @RequestBody CreateMatchSegmentRequestDTO request,
                                                          HttpSession session) {
        return ResponseEntity.status(HttpStatus.CREATED).body(matchSegmentService.create(matchId, request, session));
    }

    @PutMapping("/{segmentNo}")
    public ResponseEntity<MatchSegmentResponseDTO> update(@PathVariable int matchId,
                                                          @PathVariable int segmentNo,
                                                          @RequestBody UpdateMatchSegmentRequestDTO request,
                                                          HttpSession session) {
        return ResponseEntity.ok(matchSegmentService.update(matchId, segmentNo, request, session));
    }

    @DeleteMapping("/{segmentNo}")
    public ResponseEntity<Void> delete(@PathVariable int matchId,
                                       @PathVariable int segmentNo,
                                       HttpSession session) {
        matchSegmentService.delete(matchId, segmentNo, session);
        return ResponseEntity.noContent().build();
    }
}
