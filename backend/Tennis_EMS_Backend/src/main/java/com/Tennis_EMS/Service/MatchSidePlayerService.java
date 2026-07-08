package com.Tennis_EMS.Service;

import com.Tennis_EMS.DAO.MatchSidePlayerDAO;
import com.Tennis_EMS.DAO.StudentDAO;
import com.Tennis_EMS.DAO.TrainingMatchDAO;
import com.Tennis_EMS.DTO.AddMatchPlayerRequestDTO;
import com.Tennis_EMS.DTO.MatchSidePlayerResponseDTO;
import com.Tennis_EMS.Entity.MatchSidePlayer;
import com.Tennis_EMS.Entity.TrainingMatch;
import com.Tennis_EMS.Exception.BadRequestException;
import com.Tennis_EMS.Exception.NotFoundException;
import com.Tennis_EMS.Service.Authorization.AuthContextService;
import com.Tennis_EMS.Service.Authorization.AuthorizationService;
import jakarta.servlet.http.HttpSession;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class MatchSidePlayerService {

    private final MatchSidePlayerDAO matchSidePlayerDAO;
    private final TrainingMatchDAO trainingMatchDAO;
    private final StudentDAO studentDAO;
    private final AuthContextService authContextService;
    private final AuthorizationService authorizationService;

    public MatchSidePlayerService(MatchSidePlayerDAO matchSidePlayerDAO,
                                  TrainingMatchDAO trainingMatchDAO,
                                  StudentDAO studentDAO,
                                  AuthContextService authContextService,
                                  AuthorizationService authorizationService) {
        this.matchSidePlayerDAO = matchSidePlayerDAO;
        this.trainingMatchDAO = trainingMatchDAO;
        this.studentDAO = studentDAO;
        this.authContextService = authContextService;
        this.authorizationService = authorizationService;
    }

    public List<MatchSidePlayerResponseDTO> getByMatch(int matchId, HttpSession session) {
        requireAdminOrCoach(session);
        requireMatch(matchId);
        return matchSidePlayerDAO.getByMatch(matchId).stream().map(this::toDTO).collect(Collectors.toList());
    }

    public MatchSidePlayerResponseDTO addPlayer(int matchId, AddMatchPlayerRequestDTO request, HttpSession session) {
        requireAdminOrCoach(session);
        TrainingMatch match = requireMatch(matchId);

        if (request == null) {
            throw new BadRequestException("VALIDATION_ERROR", "Request body is required.");
        }
        if (request.getStudentId() == null) {
            throw new BadRequestException("VALIDATION_ERROR", "studentId is required.");
        }
        if (request.getPosition() == null) {
            throw new BadRequestException("VALIDATION_ERROR", "position is required.");
        }
        if (request.getPosition() < 1) {
            throw new BadRequestException("VALIDATION_ERROR", "position must be >= 1.");
        }

        MatchSidePlayer.Side side = parseSide(request.getSide());
        int maxPerSide = match.getMatchType() == TrainingMatch.MatchType.DOUBLES ? 2 : 1;
        if (request.getPosition() > maxPerSide) {
            throw new BadRequestException("VALIDATION_ERROR",
                    "Invalid position for " + match.getMatchTypeStr() + ". Max per side is " + maxPerSide + ".");
        }

        if (studentDAO.getById(request.getStudentId()) == null) {
            throw new NotFoundException("STUDENT_NOT_FOUND", "Student not found.");
        }

        List<MatchSidePlayer> existing = matchSidePlayerDAO.getByMatch(matchId);
        long sideCount = existing.stream().filter(p -> p.getSide() == side).count();
        if (sideCount >= maxPerSide) {
            throw new BadRequestException("SIDE_FULL", "This side already has maximum allowed players.");
        }

        boolean duplicateStudent = existing.stream().anyMatch(p -> p.getStudentId().equals(request.getStudentId()));
        if (duplicateStudent) {
            throw new BadRequestException("DUPLICATE_PLAYER", "Student is already added to this match.");
        }

        MatchSidePlayer existingSlot = matchSidePlayerDAO.get(matchId, side, request.getPosition());
        if (existingSlot != null) {
            throw new BadRequestException("POSITION_OCCUPIED", "This side/position is already occupied.");
        }

        MatchSidePlayer player = new MatchSidePlayer();
        player.setMatchId(matchId);
        player.setSide(side);
        player.setPosition(request.getPosition());
        player.setStudentId(request.getStudentId());

        boolean inserted = matchSidePlayerDAO.insert(player);
        if (!inserted) {
            throw new BadRequestException("MATCH_PLAYER_CREATE_FAILED", "Failed to add player to match.");
        }
        return toDTO(player);
    }

    public void removePlayer(int matchId, String side, int position, HttpSession session) {
        requireAdminOrCoach(session);
        requireMatch(matchId);

        MatchSidePlayer.Side parsedSide = parseSide(side);
        MatchSidePlayer existing = matchSidePlayerDAO.get(matchId, parsedSide, position);
        if (existing == null) {
            throw new NotFoundException("MATCH_PLAYER_NOT_FOUND", "Match side player not found.");
        }

        boolean deleted = matchSidePlayerDAO.delete(matchId, parsedSide, position);
        if (!deleted) {
            throw new BadRequestException("MATCH_PLAYER_DELETE_FAILED", "Failed to remove player from match.");
        }
    }

    private void requireAdminOrCoach(HttpSession session) {
        var ctx = authContextService.requireContext(session);
        authorizationService.requireAdminOrCoach(ctx.role());
    }

    private TrainingMatch requireMatch(int matchId) {
        TrainingMatch match = trainingMatchDAO.getById(matchId);
        if (match == null) {
            throw new NotFoundException("MATCH_NOT_FOUND", "Match not found.");
        }
        return match;
    }

    private MatchSidePlayer.Side parseSide(String value) {
        if (value == null || value.trim().isEmpty()) {
            throw new BadRequestException("VALIDATION_ERROR", "side is required.");
        }
        try {
            return MatchSidePlayer.Side.valueOf(value.trim().toUpperCase());
        } catch (IllegalArgumentException ex) {
            throw new BadRequestException("VALIDATION_ERROR", "Invalid side. Supported: A, B.");
        }
    }

    private MatchSidePlayerResponseDTO toDTO(MatchSidePlayer p) {
        return new MatchSidePlayerResponseDTO(
                p.getMatchId(),
                p.getSideStr(),
                p.getPosition(),
                p.getStudentId()
        );
    }
}
