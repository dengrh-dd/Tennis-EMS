package com.Tennis_EMS.Service;

import com.Tennis_EMS.DAO.CourtDAO;
import com.Tennis_EMS.DTO.CourtSummaryDTO;
import com.Tennis_EMS.Entity.Court;
import com.Tennis_EMS.Service.Authorization.AuthorizationService;
import com.Tennis_EMS.Service.Authorization.AuthContextService;
import jakarta.servlet.http.HttpSession;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class CourtService {

    private final CourtDAO courtDAO;
    private final AuthContextService authContextService;
    private final AuthorizationService authorizationService;

    public CourtService(
            CourtDAO courtDAO,
            AuthContextService authContextService,
            AuthorizationService authorizationService) {
        this.courtDAO = courtDAO;
        this.authContextService = authContextService;
        this.authorizationService = authorizationService;
    }

    public List<CourtSummaryDTO> listCourts(HttpSession session) {
        var ctx = authContextService.requireContext(session);
        authorizationService.requireAdmin(ctx.role());

        return courtDAO.getAll().stream()
                .map(this::toSummary)
                .collect(Collectors.toList());
    }

    private CourtSummaryDTO toSummary(Court c) {
        return new CourtSummaryDTO(
                c.getCourtId(),
                c.getName(),
                c.getLocation());
    }
}
