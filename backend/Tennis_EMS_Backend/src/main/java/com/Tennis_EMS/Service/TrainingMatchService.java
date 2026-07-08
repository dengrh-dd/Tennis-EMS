package com.Tennis_EMS.Service;

import com.Tennis_EMS.DAO.MatchSegmentDAO;
import com.Tennis_EMS.DAO.MatchSidePlayerDAO;
import com.Tennis_EMS.DAO.MatchSummaryDAO;
import com.Tennis_EMS.DAO.ScoringFormatDAO;
import com.Tennis_EMS.DAO.SessionDAO;
import com.Tennis_EMS.DAO.TrainingMatchDAO;
import com.Tennis_EMS.DTO.CreateTrainingMatchRequestDTO;
import com.Tennis_EMS.DTO.TrainingMatchResponseDTO;
import com.Tennis_EMS.DTO.UpdateTrainingMatchRequestDTO;
import com.Tennis_EMS.Entity.ScoringFormat;
import com.Tennis_EMS.Entity.Session;
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
public class TrainingMatchService {

    private final TrainingMatchDAO trainingMatchDAO;
    private final SessionDAO sessionDAO;
    private final ScoringFormatDAO scoringFormatDAO;
    private final MatchSidePlayerDAO matchSidePlayerDAO;
    private final MatchSummaryDAO matchSummaryDAO;
    private final MatchSegmentDAO matchSegmentDAO;
    private final AuthContextService authContextService;
    private final AuthorizationService authorizationService;

    public TrainingMatchService(TrainingMatchDAO trainingMatchDAO,
                                SessionDAO sessionDAO,
                                ScoringFormatDAO scoringFormatDAO,
                                MatchSidePlayerDAO matchSidePlayerDAO,
                                MatchSummaryDAO matchSummaryDAO,
                                MatchSegmentDAO matchSegmentDAO,
                                AuthContextService authContextService,
                                AuthorizationService authorizationService) {
        this.trainingMatchDAO = trainingMatchDAO;
        this.sessionDAO = sessionDAO;
        this.scoringFormatDAO = scoringFormatDAO;
        this.matchSidePlayerDAO = matchSidePlayerDAO;
        this.matchSummaryDAO = matchSummaryDAO;
        this.matchSegmentDAO = matchSegmentDAO;
        this.authContextService = authContextService;
        this.authorizationService = authorizationService;
    }

    public TrainingMatchResponseDTO getById(int matchId, HttpSession session) {
        requireAdminOrCoach(session);
        return toDTO(requireMatch(matchId));
    }

    public List<TrainingMatchResponseDTO> getBySession(int sessionId, HttpSession session) {
        requireAdminOrCoach(session);
        requireSession(sessionId);
        return trainingMatchDAO.getBySession(sessionId).stream().map(this::toDTO).collect(Collectors.toList());
    }

    public List<TrainingMatchResponseDTO> getByStatus(String status, HttpSession session) {
        requireAdminOrCoach(session);
        TrainingMatch.Status parsed = parseStatus(status);
        return trainingMatchDAO.getByStatus(parsed).stream().map(this::toDTO).collect(Collectors.toList());
    }

    public TrainingMatchResponseDTO create(CreateTrainingMatchRequestDTO request, HttpSession session) {
        requireAdminOrCoach(session);
        if (request == null) {
            throw new BadRequestException("VALIDATION_ERROR", "Request body is required.");
        }
        if (request.getSessionId() == null) {
            throw new BadRequestException("VALIDATION_ERROR", "sessionId is required.");
        }
        if (request.getFormatId() == null) {
            throw new BadRequestException("VALIDATION_ERROR", "formatId is required.");
        }

        Session targetSession = requireSession(request.getSessionId());
        ScoringFormat format = requireScoringFormat(request.getFormatId());
        if (targetSession == null || format == null) {
            throw new BadRequestException("VALIDATION_ERROR", "Invalid match dependencies.");
        }

        TrainingMatch.MatchType matchType = parseMatchType(request.getMatchType());
        TrainingMatch.Status status = request.getStatus() == null || request.getStatus().trim().isEmpty()
                ? TrainingMatch.Status.SCHEDULED
                : parseStatus(request.getStatus());
        TrainingMatch.WinnerSide winnerSide = parseWinnerSideNullable(request.getWinnerSide());

        TrainingMatch match = new TrainingMatch();
        match.setSessionId(request.getSessionId());
        match.setFormatId(request.getFormatId());
        match.setMatchType(matchType);
        match.setTitle(trimToNull(request.getTitle()));
        match.setNotes(trimToNull(request.getNotes()));
        match.setStatus(status);
        match.setWinnerSide(winnerSide);

        int id = trainingMatchDAO.insert(match);
        if (id <= 0) {
            throw new BadRequestException("MATCH_CREATE_FAILED", "Failed to create match.");
        }
        return toDTO(requireMatch(id));
    }

    public TrainingMatchResponseDTO update(int matchId, UpdateTrainingMatchRequestDTO request, HttpSession session) {
        requireAdminOrCoach(session);
        TrainingMatch match = requireMatch(matchId);

        if (request == null) {
            throw new BadRequestException("VALIDATION_ERROR", "Request body is required.");
        }

        if (request.getSessionId() != null) {
            requireSession(request.getSessionId());
            match.setSessionId(request.getSessionId());
        }
        if (request.getFormatId() != null) {
            requireScoringFormat(request.getFormatId());
            match.setFormatId(request.getFormatId());
        }
        if (request.getMatchType() != null) {
            match.setMatchType(parseMatchType(request.getMatchType()));
        }
        if (request.getTitle() != null) {
            match.setTitle(trimToNull(request.getTitle()));
        }
        if (request.getNotes() != null) {
            match.setNotes(trimToNull(request.getNotes()));
        }
        if (request.getStatus() != null) {
            match.setStatus(parseStatus(request.getStatus()));
        }
        if (request.getWinnerSide() != null) {
            match.setWinnerSide(parseWinnerSideNullable(request.getWinnerSide()));
        }

        boolean updated = trainingMatchDAO.update(match);
        if (!updated) {
            throw new BadRequestException("MATCH_UPDATE_FAILED", "Failed to update match.");
        }
        return toDTO(requireMatch(matchId));
    }

    public void delete(int matchId, HttpSession session) {
        requireAdminOrCoach(session);
        requireMatch(matchId);

        matchSegmentDAO.deleteByMatch(matchId);
        matchSummaryDAO.delete(matchId);
        matchSidePlayerDAO.deleteByMatch(matchId);

        boolean deleted = trainingMatchDAO.delete(matchId);
        if (!deleted) {
            throw new BadRequestException("MATCH_DELETE_FAILED", "Failed to delete match.");
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

    private Session requireSession(int sessionId) {
        Session target = sessionDAO.getById(sessionId);
        if (target == null) {
            throw new NotFoundException("SESSION_NOT_FOUND", "Session not found.");
        }
        return target;
    }

    private ScoringFormat requireScoringFormat(int formatId) {
        ScoringFormat target = scoringFormatDAO.getById(formatId);
        if (target == null) {
            throw new NotFoundException("SCORING_FORMAT_NOT_FOUND", "Scoring format not found.");
        }
        return target;
    }

    private TrainingMatch.MatchType parseMatchType(String value) {
        if (value == null || value.trim().isEmpty()) {
            throw new BadRequestException("VALIDATION_ERROR", "matchType is required.");
        }
        try {
            return TrainingMatch.MatchType.valueOf(value.trim().toUpperCase());
        } catch (IllegalArgumentException ex) {
            throw new BadRequestException("VALIDATION_ERROR", "Invalid matchType. Supported: SINGLES, DOUBLES.");
        }
    }

    private TrainingMatch.Status parseStatus(String value) {
        if (value == null || value.trim().isEmpty()) {
            throw new BadRequestException("VALIDATION_ERROR", "status is required.");
        }
        try {
            return TrainingMatch.Status.valueOf(value.trim().toUpperCase());
        } catch (IllegalArgumentException ex) {
            throw new BadRequestException("VALIDATION_ERROR",
                    "Invalid status. Supported: SCHEDULED, IN_PROGRESS, COMPLETED, CANCELLED.");
        }
    }

    private TrainingMatch.WinnerSide parseWinnerSideNullable(String value) {
        if (value == null || value.trim().isEmpty()) {
            return null;
        }
        try {
            return TrainingMatch.WinnerSide.valueOf(value.trim().toUpperCase());
        } catch (IllegalArgumentException ex) {
            throw new BadRequestException("VALIDATION_ERROR", "Invalid winnerSide. Supported: A, B.");
        }
    }

    private String trimToNull(String value) {
        if (value == null) return null;
        String trimmed = value.trim();
        return trimmed.isEmpty() ? null : trimmed;
    }

    private TrainingMatchResponseDTO toDTO(TrainingMatch match) {
        return new TrainingMatchResponseDTO(
                match.getMatchId(),
                match.getSessionId(),
                match.getFormatId(),
                match.getMatchTypeStr(),
                match.getTitle(),
                match.getNotes(),
                match.getStatusStr(),
                match.getWinnerSideStr(),
                match.getCreatedAt(),
                match.getUpdatedAt()
        );
    }
}
