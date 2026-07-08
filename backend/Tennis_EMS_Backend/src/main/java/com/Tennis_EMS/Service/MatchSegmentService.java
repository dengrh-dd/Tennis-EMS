package com.Tennis_EMS.Service;

import com.Tennis_EMS.DAO.MatchSegmentDAO;
import com.Tennis_EMS.DAO.TrainingMatchDAO;
import com.Tennis_EMS.DTO.CreateMatchSegmentRequestDTO;
import com.Tennis_EMS.DTO.MatchSegmentResponseDTO;
import com.Tennis_EMS.DTO.UpdateMatchSegmentRequestDTO;
import com.Tennis_EMS.Entity.MatchSegment;
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
public class MatchSegmentService {

    private final MatchSegmentDAO matchSegmentDAO;
    private final TrainingMatchDAO trainingMatchDAO;
    private final AuthContextService authContextService;
    private final AuthorizationService authorizationService;

    public MatchSegmentService(MatchSegmentDAO matchSegmentDAO,
                               TrainingMatchDAO trainingMatchDAO,
                               AuthContextService authContextService,
                               AuthorizationService authorizationService) {
        this.matchSegmentDAO = matchSegmentDAO;
        this.trainingMatchDAO = trainingMatchDAO;
        this.authContextService = authContextService;
        this.authorizationService = authorizationService;
    }

    public List<MatchSegmentResponseDTO> getByMatch(int matchId, HttpSession session) {
        requireAdminOrCoach(session);
        requireMatch(matchId);
        return matchSegmentDAO.getByMatch(matchId).stream().map(this::toDTO).collect(Collectors.toList());
    }

    public MatchSegmentResponseDTO create(int matchId, CreateMatchSegmentRequestDTO request, HttpSession session) {
        requireAdminOrCoach(session);
        requireMatch(matchId);
        if (request == null) {
            throw new BadRequestException("VALIDATION_ERROR", "Request body is required.");
        }
        if (request.getSegmentNo() == null || request.getSegmentNo() < 1) {
            throw new BadRequestException("VALIDATION_ERROR", "segmentNo must be >= 1.");
        }

        MatchSegment.SegmentType segmentType = parseSegmentType(request.getSegmentType());
        int sideAScore = nonNegativeScore(request.getSideAScore(), "sideAScore");
        int sideBScore = nonNegativeScore(request.getSideBScore(), "sideBScore");

        MatchSegment existing = matchSegmentDAO.get(matchId, request.getSegmentNo());
        if (existing != null) {
            throw new BadRequestException("SEGMENT_EXISTS", "Segment already exists for this match/segmentNo.");
        }

        MatchSegment segment = new MatchSegment();
        segment.setMatchId(matchId);
        segment.setSegmentNo(request.getSegmentNo());
        segment.setSegmentType(segmentType);
        segment.setSideAScore(sideAScore);
        segment.setSideBScore(sideBScore);

        boolean inserted = matchSegmentDAO.insert(segment);
        if (!inserted) {
            throw new BadRequestException("MATCH_SEGMENT_CREATE_FAILED", "Failed to create match segment.");
        }
        return toDTO(requireSegment(matchId, request.getSegmentNo()));
    }

    public MatchSegmentResponseDTO update(int matchId,
                                          int segmentNo,
                                          UpdateMatchSegmentRequestDTO request,
                                          HttpSession session) {
        requireAdminOrCoach(session);
        requireMatch(matchId);
        MatchSegment current = requireSegment(matchId, segmentNo);
        if (request == null) {
            throw new BadRequestException("VALIDATION_ERROR", "Request body is required.");
        }

        if (request.getSegmentType() != null) {
            current.setSegmentType(parseSegmentType(request.getSegmentType()));
        }
        if (request.getSideAScore() != null) {
            current.setSideAScore(nonNegativeScore(request.getSideAScore(), "sideAScore"));
        }
        if (request.getSideBScore() != null) {
            current.setSideBScore(nonNegativeScore(request.getSideBScore(), "sideBScore"));
        }

        boolean updated = matchSegmentDAO.update(current);
        if (!updated) {
            throw new BadRequestException("MATCH_SEGMENT_UPDATE_FAILED", "Failed to update match segment.");
        }
        return toDTO(requireSegment(matchId, segmentNo));
    }

    public void delete(int matchId, int segmentNo, HttpSession session) {
        requireAdminOrCoach(session);
        requireMatch(matchId);
        requireSegment(matchId, segmentNo);
        boolean deleted = matchSegmentDAO.delete(matchId, segmentNo);
        if (!deleted) {
            throw new BadRequestException("MATCH_SEGMENT_DELETE_FAILED", "Failed to delete match segment.");
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

    private MatchSegment requireSegment(int matchId, int segmentNo) {
        MatchSegment segment = matchSegmentDAO.get(matchId, segmentNo);
        if (segment == null) {
            throw new NotFoundException("MATCH_SEGMENT_NOT_FOUND", "Match segment not found.");
        }
        return segment;
    }

    private MatchSegment.SegmentType parseSegmentType(String value) {
        if (value == null || value.trim().isEmpty()) {
            throw new BadRequestException("VALIDATION_ERROR", "segmentType is required.");
        }
        try {
            return MatchSegment.SegmentType.valueOf(value.trim().toUpperCase());
        } catch (IllegalArgumentException ex) {
            throw new BadRequestException("VALIDATION_ERROR", "Invalid segmentType. Supported: SET, TB, RACE.");
        }
    }

    private int nonNegativeScore(Integer score, String field) {
        int value = score == null ? 0 : score;
        if (value < 0) {
            throw new BadRequestException("VALIDATION_ERROR", field + " cannot be negative.");
        }
        return value;
    }

    private MatchSegmentResponseDTO toDTO(MatchSegment segment) {
        return new MatchSegmentResponseDTO(
                segment.getMatchId(),
                segment.getSegmentNo(),
                segment.getSegmentTypeStr(),
                segment.getSideAScore(),
                segment.getSideBScore(),
                segment.getCreatedAt(),
                segment.getUpdatedAt()
        );
    }
}
