package com.Tennis_EMS.Service;

import com.Tennis_EMS.DAO.MatchSummaryDAO;
import com.Tennis_EMS.DAO.TrainingMatchDAO;
import com.Tennis_EMS.DTO.MatchSummaryResponseDTO;
import com.Tennis_EMS.DTO.UpsertMatchSummaryRequestDTO;
import com.Tennis_EMS.Entity.MatchSummary;
import com.Tennis_EMS.Entity.TrainingMatch;
import com.Tennis_EMS.Exception.BadRequestException;
import com.Tennis_EMS.Exception.NotFoundException;
import com.Tennis_EMS.Service.Authorization.AuthContextService;
import com.Tennis_EMS.Service.Authorization.AuthorizationService;
import jakarta.servlet.http.HttpSession;
import org.springframework.stereotype.Service;

@Service
public class MatchSummaryService {

    private final MatchSummaryDAO matchSummaryDAO;
    private final TrainingMatchDAO trainingMatchDAO;
    private final AuthContextService authContextService;
    private final AuthorizationService authorizationService;

    public MatchSummaryService(MatchSummaryDAO matchSummaryDAO,
                               TrainingMatchDAO trainingMatchDAO,
                               AuthContextService authContextService,
                               AuthorizationService authorizationService) {
        this.matchSummaryDAO = matchSummaryDAO;
        this.trainingMatchDAO = trainingMatchDAO;
        this.authContextService = authContextService;
        this.authorizationService = authorizationService;
    }

    public MatchSummaryResponseDTO getByMatch(int matchId, HttpSession session) {
        requireAdminOrCoach(session);
        requireMatch(matchId);
        MatchSummary summary = matchSummaryDAO.getByMatchId(matchId);
        if (summary == null) {
            throw new NotFoundException("MATCH_SUMMARY_NOT_FOUND", "Match summary not found.");
        }
        return toDTO(summary);
    }

    public MatchSummaryResponseDTO upsert(int matchId, UpsertMatchSummaryRequestDTO request, HttpSession session) {
        requireAdminOrCoach(session);
        requireMatch(matchId);

        if (request == null) {
            throw new BadRequestException("VALIDATION_ERROR", "Request body is required.");
        }

        Integer sideAScore = request.getSideAScore() != null ? request.getSideAScore() : 0;
        Integer sideBScore = request.getSideBScore() != null ? request.getSideBScore() : 0;
        if (sideAScore < 0 || sideBScore < 0) {
            throw new BadRequestException("VALIDATION_ERROR", "sideAScore and sideBScore cannot be negative.");
        }

        MatchSummary existing = matchSummaryDAO.getByMatchId(matchId);
        if (existing == null) {
            MatchSummary summary = new MatchSummary();
            summary.setMatchId(matchId);
            summary.setFinalScoreText(trimToNull(request.getFinalScoreText()));
            summary.setSideAScore(sideAScore);
            summary.setSideBScore(sideBScore);
            boolean inserted = matchSummaryDAO.insert(summary);
            if (!inserted) {
                throw new BadRequestException("MATCH_SUMMARY_CREATE_FAILED", "Failed to create match summary.");
            }
        } else {
            existing.setFinalScoreText(trimToNull(request.getFinalScoreText()));
            existing.setSideAScore(sideAScore);
            existing.setSideBScore(sideBScore);
            boolean updated = matchSummaryDAO.update(existing);
            if (!updated) {
                throw new BadRequestException("MATCH_SUMMARY_UPDATE_FAILED", "Failed to update match summary.");
            }
        }

        return toDTO(requireSummary(matchId));
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

    private MatchSummary requireSummary(int matchId) {
        MatchSummary summary = matchSummaryDAO.getByMatchId(matchId);
        if (summary == null) {
            throw new NotFoundException("MATCH_SUMMARY_NOT_FOUND", "Match summary not found.");
        }
        return summary;
    }

    private String trimToNull(String value) {
        if (value == null) return null;
        String trimmed = value.trim();
        return trimmed.isEmpty() ? null : trimmed;
    }

    private MatchSummaryResponseDTO toDTO(MatchSummary summary) {
        return new MatchSummaryResponseDTO(
                summary.getMatchId(),
                summary.getFinalScoreText(),
                summary.getSideAScore(),
                summary.getSideBScore(),
                summary.getCreatedAt(),
                summary.getUpdatedAt()
        );
    }
}
