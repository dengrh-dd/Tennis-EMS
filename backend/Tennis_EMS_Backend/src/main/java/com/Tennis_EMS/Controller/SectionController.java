package com.Tennis_EMS.Controller;

import com.Tennis_EMS.DTO.CreateSectionRequestDTO;
import com.Tennis_EMS.DTO.SectionDetailDTO;
import com.Tennis_EMS.DTO.SectionSummaryDTO;
import com.Tennis_EMS.DTO.UpdateSectionRequestDTO;
import com.Tennis_EMS.DTO.SessionSummaryDTO;
import com.Tennis_EMS.Service.SectionService;
import com.Tennis_EMS.Service.SessionService;
import jakarta.servlet.http.HttpSession;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/sections")
public class SectionController {

    private final SectionService sectionService;
    private final SessionService sessionService;

    public SectionController(SectionService sectionService, SessionService sessionService) {
        this.sectionService = sectionService;
        this.sessionService = sessionService;
    }

    @PostMapping
    public ResponseEntity<SectionDetailDTO> createSection(@RequestBody CreateSectionRequestDTO request, HttpSession session) {
        SectionDetailDTO created = sectionService.createSection(request, session);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @PutMapping("/{sectionId}")
    public ResponseEntity<SectionDetailDTO> updateSection(@PathVariable int sectionId,
                                                         @RequestBody UpdateSectionRequestDTO request,
                                                         HttpSession session) {
        SectionDetailDTO updated = sectionService.updateSection(sectionId, request, session);
        return ResponseEntity.ok(updated);
    }

    @GetMapping
    public ResponseEntity<List<SectionSummaryDTO>> getAllSections(HttpSession session) {
        List<SectionSummaryDTO> sections = sectionService.getAllSections(session);
        return ResponseEntity.ok(sections);
    }

    @GetMapping("/active")
    public ResponseEntity<List<SectionSummaryDTO>> getActiveSections() {
        List<SectionSummaryDTO> sections = sectionService.getActiveSections();
        return ResponseEntity.ok(sections);
    }

    @GetMapping("/course/{courseId}")
    public ResponseEntity<List<SectionSummaryDTO>> getSectionsByCourseId(@PathVariable int courseId) {
        List<SectionSummaryDTO> sections = sectionService.getSectionsByCourseId(courseId);
        return ResponseEntity.ok(sections);
    }

    @GetMapping("/{sectionId}")
    public ResponseEntity<SectionDetailDTO> getSectionById(@PathVariable int sectionId) {
        SectionDetailDTO section = sectionService.getSectionById(sectionId);
        return ResponseEntity.ok(section);
    }

    @GetMapping("/{sectionId}/sessions")
    public ResponseEntity<List<SessionSummaryDTO>> getSessionsBySectionId(@PathVariable int sectionId) {
        List<SessionSummaryDTO> sessions = sessionService.getSessionsBySectionId(sectionId);
        return ResponseEntity.ok(sessions);
    }

    @PatchMapping("/{sectionId}/archive")
    public ResponseEntity<SectionDetailDTO> archiveSection(@PathVariable int sectionId, HttpSession session) {
        SectionDetailDTO archived = sectionService.archiveSection(sectionId, session);
        return ResponseEntity.ok(archived);
    }
}
