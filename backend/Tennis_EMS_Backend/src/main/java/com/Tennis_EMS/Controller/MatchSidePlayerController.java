package com.Tennis_EMS.Controller;

import com.Tennis_EMS.DTO.AddMatchPlayerRequestDTO;
import com.Tennis_EMS.DTO.MatchSidePlayerResponseDTO;
import com.Tennis_EMS.Service.MatchSidePlayerService;
import jakarta.servlet.http.HttpSession;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/matches/{matchId}/players")
public class MatchSidePlayerController {

    private final MatchSidePlayerService matchSidePlayerService;

    public MatchSidePlayerController(MatchSidePlayerService matchSidePlayerService) {
        this.matchSidePlayerService = matchSidePlayerService;
    }

    @GetMapping
    public ResponseEntity<List<MatchSidePlayerResponseDTO>> getByMatch(@PathVariable int matchId, HttpSession session) {
        return ResponseEntity.ok(matchSidePlayerService.getByMatch(matchId, session));
    }

    @PostMapping
    public ResponseEntity<MatchSidePlayerResponseDTO> add(@PathVariable int matchId,
                                                          @RequestBody AddMatchPlayerRequestDTO request,
                                                          HttpSession session) {
        return ResponseEntity.status(HttpStatus.CREATED).body(matchSidePlayerService.addPlayer(matchId, request, session));
    }

    @DeleteMapping("/{side}/{position}")
    public ResponseEntity<Void> delete(@PathVariable int matchId,
                                       @PathVariable String side,
                                       @PathVariable int position,
                                       HttpSession session) {
        matchSidePlayerService.removePlayer(matchId, side, position, session);
        return ResponseEntity.noContent().build();
    }
}
