package com.Tennis_EMS.Service;

import com.Tennis_EMS.DAO.ScoringFormatDAO;
import com.Tennis_EMS.DTO.ScoringFormatResponseDTO;
import com.Tennis_EMS.Entity.ScoringFormat;
import com.Tennis_EMS.Exception.NotFoundException;
import com.Tennis_EMS.Service.Authorization.AuthContextService;
import com.Tennis_EMS.Service.Authorization.AuthorizationService;
import jakarta.servlet.http.HttpSession;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ScoringFormatService {

    private final ScoringFormatDAO scoringFormatDAO;
    private final AuthContextService authContextService;
    private final AuthorizationService authorizationService;

    public ScoringFormatService(ScoringFormatDAO scoringFormatDAO,
                                AuthContextService authContextService,
                                AuthorizationService authorizationService) {
        this.scoringFormatDAO = scoringFormatDAO;
        this.authContextService = authContextService;
        this.authorizationService = authorizationService;
    }

    public List<ScoringFormatResponseDTO> getActiveFormats(HttpSession session) {
        requireAnyAuthenticatedRole(session);
        return scoringFormatDAO.getActive().stream().map(this::toDTO).collect(Collectors.toList());
    }

    public ScoringFormatResponseDTO getById(int formatId, HttpSession session) {
        requireAnyAuthenticatedRole(session);
        ScoringFormat format = scoringFormatDAO.getById(formatId);
        if (format == null) {
            throw new NotFoundException("SCORING_FORMAT_NOT_FOUND", "Scoring format not found.");
        }
        return toDTO(format);
    }

    private void requireAnyAuthenticatedRole(HttpSession session) {
        var ctx = authContextService.requireContext(session);
        authorizationService.requireAdminOrCoachOrStudent(ctx.role());
    }

    private ScoringFormatResponseDTO toDTO(ScoringFormat format) {
        return new ScoringFormatResponseDTO(
                format.getFormatId(),
                format.getName(),
                format.getFormatTypeStr(),
                format.getPointsToWin(),
                format.getWinByTwo(),
                format.getGamesToWinSet(),
                format.getSetsToWinMatch(),
                format.getTiebreakAt(),
                format.getNoAd(),
                format.getNotes(),
                format.getIsActive()
        );
    }
}
