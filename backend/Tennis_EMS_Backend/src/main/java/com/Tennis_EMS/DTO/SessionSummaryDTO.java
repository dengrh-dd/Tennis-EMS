package com.Tennis_EMS.DTO;

import java.time.LocalDateTime;

public class SessionSummaryDTO {

    private Integer sessionId;
    private Integer sectionId;
    private LocalDateTime startTime;
    private LocalDateTime endTime;
    private String status;
    private String sectionName;
    private String courseName;

    public SessionSummaryDTO() {}

    public SessionSummaryDTO(Integer sessionId, Integer sectionId, LocalDateTime startTime,
                             LocalDateTime endTime, String status, String sectionName, String courseName) {
        this.sessionId = sessionId;
        this.sectionId = sectionId;
        this.startTime = startTime;
        this.endTime = endTime;
        this.status = status;
        this.sectionName = sectionName;
        this.courseName = courseName;
    }

    public Integer getSessionId() { return sessionId; }
    public void setSessionId(Integer sessionId) { this.sessionId = sessionId; }

    public Integer getSectionId() { return sectionId; }
    public void setSectionId(Integer sectionId) { this.sectionId = sectionId; }

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
}
