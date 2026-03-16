package com.Tennis_EMS.Service;

import com.Tennis_EMS.DAO.CourseDAO;
import com.Tennis_EMS.DAO.SectionDAO;
import com.Tennis_EMS.DAO.SessionDAO;
import com.Tennis_EMS.DTO.CreateSessionRequestDTO;
import com.Tennis_EMS.DTO.SessionDetailDTO;
import com.Tennis_EMS.DTO.SessionSummaryDTO;
import com.Tennis_EMS.DTO.UpdateSessionRequestDTO;
import com.Tennis_EMS.Entity.Course;
import com.Tennis_EMS.Entity.Section;
import com.Tennis_EMS.Entity.Session;
import com.Tennis_EMS.Exception.BadRequestException;
import com.Tennis_EMS.Exception.NotFoundException;
import com.Tennis_EMS.Service.Authorization.AuthorizationService;
import com.Tennis_EMS.Service.Authorization.AuthContextService;
import jakarta.servlet.http.HttpSession;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class SessionService {

    private final SessionDAO sessionDAO;
    private final SectionDAO sectionDAO;
    private final CourseDAO courseDAO;
    private final AuthContextService authContextService;
    private final AuthorizationService authorizationService;

    public SessionService(SessionDAO sessionDAO,
                          SectionDAO sectionDAO,
                          CourseDAO courseDAO,
                          AuthContextService authContextService,
                          AuthorizationService authorizationService) {
        this.sessionDAO = sessionDAO;
        this.sectionDAO = sectionDAO;
        this.courseDAO = courseDAO;
        this.authContextService = authContextService;
        this.authorizationService = authorizationService;
    }

    public SessionDetailDTO createSession(CreateSessionRequestDTO request, HttpSession session) {
        var ctx = authContextService.requireContext(session);
        authorizationService.requireAdmin(ctx.role());

        validateCreateRequest(request);
        validateTimes(request.getStartTime(), request.getEndTime());

        requireSection(request.getSectionId());

        Session entity = new Session();
        entity.setSectionId(request.getSectionId());
        entity.setStartTime(request.getStartTime());
        entity.setEndTime(request.getEndTime());
        entity.setCourtId(request.getCourtId());
        entity.setStatusFromString(
                request.getStatus() != null && !request.getStatus().trim().isEmpty()
                        ? request.getStatus().trim()
                        : Session.Status.SCHEDULED.name());

        int id = sessionDAO.insert(entity);
        entity.setSessionId(id);

        return toDetailDTO(entity);
    }

    public SessionDetailDTO updateSession(int sessionId, UpdateSessionRequestDTO request, HttpSession session) {
        var ctx = authContextService.requireContext(session);
        authorizationService.requireAdmin(ctx.role());

        Session entity = requireSession(sessionId);

        if (request.getSectionId() != null) {
            requireSection(request.getSectionId());
            entity.setSectionId(request.getSectionId());
        }
        if (request.getStartTime() != null) {
            entity.setStartTime(request.getStartTime());
        }
        if (request.getEndTime() != null) {
            entity.setEndTime(request.getEndTime());
        }
        if (request.getStartTime() != null || request.getEndTime() != null) {
            validateTimes(entity.getStartTime(), entity.getEndTime());
        }
        if (request.getCourtId() != null) {
            entity.setCourtId(request.getCourtId());
        }
        if (request.getStatus() != null && !request.getStatus().trim().isEmpty()) {
            entity.setStatusFromString(request.getStatus().trim());
        }

        sessionDAO.update(entity);

        return toDetailDTO(entity);
    }

    public SessionDetailDTO getSessionById(int sessionId) {
        Session entity = requireSession(sessionId);
        return toDetailDTO(entity);
    }

    public List<SessionSummaryDTO> getAllSessions(HttpSession session) {
        var ctx = authContextService.requireContext(session);
        authorizationService.requireAdmin(ctx.role());

        List<Session> all = sessionDAO.getAll();
        Map<Integer, String[]> sectionAndCourseNames = resolveSectionAndCourseNames(
                all.stream()
                        .map(Session::getSectionId)
                        .filter(id -> id != null)
                        .collect(Collectors.toSet()));

        return all.stream()
                .map(s -> toSummaryDTO(s, sectionAndCourseNames.get(s.getSectionId())))
                .collect(Collectors.toList());
    }

    public List<SessionSummaryDTO> getSessionsBySectionId(int sectionId) {
        requireSection(sectionId);
        Section section = sectionDAO.getById(sectionId);
        Course course = section != null && section.getCourseId() != null
                ? courseDAO.getById(section.getCourseId()) : null;
        String sectionName = section != null ? section.getName() : null;
        String courseName = course != null ? course.getName() : null;
        String[] names = new String[]{sectionName, courseName};

        return sessionDAO.getBySectionId(sectionId).stream()
                .map(s -> toSummaryDTO(s, names))
                .collect(Collectors.toList());
    }

    public List<SessionSummaryDTO> getUpcomingSessions() {
        LocalDateTime now = LocalDateTime.now();
        List<Session> all = sessionDAO.getAll();
        List<Session> upcoming = all.stream()
                .filter(s -> s.getStartTime() != null && s.getStartTime().isAfter(now))
                .collect(Collectors.toList());
        Set<Integer> sectionIds = upcoming.stream()
                .map(Session::getSectionId)
                .filter(id -> id != null)
                .collect(Collectors.toSet());
        Map<Integer, String[]> sectionAndCourseNames = resolveSectionAndCourseNames(sectionIds);

        return upcoming.stream()
                .map(s -> toSummaryDTO(s, sectionAndCourseNames.get(s.getSectionId())))
                .collect(Collectors.toList());
    }

    public SessionDetailDTO cancelSession(int sessionId, HttpSession session) {
        var ctx = authContextService.requireContext(session);
        authorizationService.requireAdmin(ctx.role());

        Session entity = requireSession(sessionId);
        entity.setStatusFromString(Session.Status.CANCELLED.name());
        sessionDAO.update(entity);

        return toDetailDTO(entity);
    }

    private void validateCreateRequest(CreateSessionRequestDTO request) {
        if (request == null) {
            throw new BadRequestException("VALIDATION_ERROR", "Request body is required.");
        }
        if (request.getSectionId() == null) {
            throw new BadRequestException("VALIDATION_ERROR", "Section ID is required.");
        }
        if (request.getStartTime() == null) {
            throw new BadRequestException("VALIDATION_ERROR", "Start time is required.");
        }
        if (request.getEndTime() == null) {
            throw new BadRequestException("VALIDATION_ERROR", "End time is required.");
        }
    }

    private void validateTimes(LocalDateTime startTime, LocalDateTime endTime) {
        if (startTime == null || endTime == null) {
            throw new BadRequestException("VALIDATION_ERROR", "Start time and end time are required.");
        }
        if (!endTime.isAfter(startTime)) {
            throw new BadRequestException("VALIDATION_ERROR", "End time must be after start time.");
        }
    }

    private Session requireSession(int sessionId) {
        Session entity = sessionDAO.getById(sessionId);
        if (entity == null) {
            throw new NotFoundException("SESSION_NOT_FOUND", "Session not found.");
        }
        return entity;
    }

    private Section requireSection(int sectionId) {
        Section section = sectionDAO.getById(sectionId);
        if (section == null) {
            throw new NotFoundException("SECTION_NOT_FOUND", "Section not found.");
        }
        return section;
    }

    private Map<Integer, String[]> resolveSectionAndCourseNames(Set<Integer> sectionIds) {
        Map<Integer, String[]> map = new HashMap<>();
        for (Integer sectionId : sectionIds) {
            Section section = sectionDAO.getById(sectionId);
            String sectionName = section != null ? section.getName() : null;
            String courseName = null;
            if (section != null && section.getCourseId() != null) {
                Course course = courseDAO.getById(section.getCourseId());
                courseName = course != null ? course.getName() : null;
            }
            map.put(sectionId, new String[]{sectionName, courseName});
        }
        return map;
    }

    private SessionSummaryDTO toSummaryDTO(Session session, String[] sectionAndCourseNames) {
        String sectionName = sectionAndCourseNames != null && sectionAndCourseNames.length > 0
                ? sectionAndCourseNames[0] : null;
        String courseName = sectionAndCourseNames != null && sectionAndCourseNames.length > 1
                ? sectionAndCourseNames[1] : null;
        return new SessionSummaryDTO(
                session.getSessionId(),
                session.getSectionId(),
                session.getStartTime(),
                session.getEndTime(),
                session.getStatusStr(),
                sectionName,
                courseName
        );
    }

    private SessionDetailDTO toDetailDTO(Session session) {
        String sectionName = null;
        String courseName = null;
        Integer coachId = null;
        if (session.getSectionId() != null) {
            Section section = sectionDAO.getById(session.getSectionId());
            if (section != null) {
                sectionName = section.getName();
                coachId = section.getCoachId();
                if (section.getCourseId() != null) {
                    Course course = courseDAO.getById(section.getCourseId());
                    courseName = course != null ? course.getName() : null;
                }
            }
        }
        return new SessionDetailDTO(
                session.getSessionId(),
                session.getSectionId(),
                coachId,
                session.getCourtId(),
                session.getStartTime(),
                session.getEndTime(),
                session.getStatusStr(),
                sectionName,
                courseName,
                session.getCreatedAt(),
                session.getUpdatedAt()
        );
    }
}
