package com.Tennis_EMS.DTO;

import java.time.LocalDateTime;

public class SessionDetailDTO {

    private Integer sessionId;
    private Integer sectionId;
    private Integer coachId;
    private Integer courtId;
    private LocalDateTime startTime;
    private LocalDateTime endTime;
    private String status;
    private String sectionName;
    private String courseName;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public SessionDetailDTO() {}

    public SessionDetailDTO(Integer sessionId, Integer sectionId, Integer coachId, Integer courtId,
                            LocalDateTime startTime, LocalDateTime endTime, String status,
                            String sectionName, String courseName,
                            LocalDateTime createdAt, LocalDateTime updatedAt) {
        this.sessionId = sessionId;
        this.sectionId = sectionId;
        this.coachId = coachId;
        this.courtId = courtId;
        this.startTime = startTime;
        this.endTime = endTime;
        this.status = status;
        this.sectionName = sectionName;
        this.courseName = courseName;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    public Integer getSessionId() { return sessionId; }
    public void setSessionId(Integer sessionId) { this.sessionId = sessionId; }

    public Integer getSectionId() { return sectionId; }
    public void setSectionId(Integer sectionId) { this.sectionId = sectionId; }

    public Integer getCoachId() { return coachId; }
    public void setCoachId(Integer coachId) { this.coachId = coachId; }

    public Integer getCourtId() { return courtId; }
    public void setCourtId(Integer courtId) { this.courtId = courtId; }

    public LocalDateTime getStartTime() { return startTime; }
    public void setStartTime(LocalDateTime startTime) { this.startTime = startTime; }

    public LocalDateTime getEndTime() { return endTime; }
    public void setEndTime(LocalDateTime endTime) { this.endTime = endTime; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getSectionName() { return sectionName; }
    public void setSectionName(String sectionName) { this.sectionName = sectionName; }

    public String getCourseName() { return courseName; }
    public void setCourseName(String courseName) { this.courseName = courseName; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}
