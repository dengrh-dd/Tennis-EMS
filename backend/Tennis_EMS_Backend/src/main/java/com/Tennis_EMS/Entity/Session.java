package com.Tennis_EMS.Entity;

import java.time.LocalDateTime;

public class Session {

    public enum Status {
        SCHEDULED,
        IN_PROGRESS,
        COMPLETED,
        CANCELLED
    }

    private Integer sessionId;
    private Integer sectionId;

    private LocalDateTime startTime;
    private LocalDateTime endTime;

    private String location;
    private Integer courtId;

    private Status status;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public Session() {}

    public Session(Integer sessionId,
                   Integer sectionId,
                   LocalDateTime startTime,
                   LocalDateTime endTime,
                   String location,
                   Integer courtId,
                   String statusStr,
                   LocalDateTime createdAt,
                   LocalDateTime updatedAt) {

        this.sessionId = sessionId;
        this.sectionId = sectionId;
        this.startTime = startTime;
        this.endTime = endTime;
        this.location = location;
        this.courtId = courtId;
        setStatusFromString(statusStr);
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    // ===== Enum safe parsing =====

    public Status getStatus() { return status; }

    public String getStatusStr() {
        return status == null ? null : status.name();
    }

    public void setStatusFromString(String str) {
        if (str == null) {
            this.status = null;
            return;
        }
        try {
            this.status = Status.valueOf(str.trim().toUpperCase());
        } catch (IllegalArgumentException e) {
            this.status = null;
        }
    }

    // ===== getters / setters =====

    public Integer getSessionId() { return sessionId; }
    public void setSessionId(Integer sessionId) { this.sessionId = sessionId; }

    public Integer getSectionId() { return sectionId; }
    public void setSectionId(Integer sectionId) { this.sectionId = sectionId; }

    public LocalDateTime getStartTime() { return startTime; }
    public void setStartTime(LocalDateTime startTime) { this.startTime = startTime; }

    public LocalDateTime getEndTime() { return endTime; }
    public void setEndTime(LocalDateTime endTime) { this.endTime = endTime; }

    public String getLocation() { return location; }
    public void setLocation(String location) { this.location = location; }

    public Integer getCourtId() { return courtId; }
    public void setCourtId(Integer courtId) { this.courtId = courtId; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }

    @Override
    public String toString() {
        return sessionId + " - " + startTime;
    }
}
