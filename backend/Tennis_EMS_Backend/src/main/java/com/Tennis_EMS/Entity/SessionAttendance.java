package com.Tennis_EMS.Entity;

import java.time.LocalDateTime;

public class SessionAttendance {

    public enum Status {
        ENROLLED,
        PRESENT,
        LATE,
        ABSENT,
        EXCUSED,
        CANCELLED
    }

    public enum Source {
        SECTION,
        DROP_IN,
        ADMIN
    }

    private Integer sessionId;
    private Integer studentId;

    private Status status;
    private Source source;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public SessionAttendance() {}

    public SessionAttendance(Integer sessionId,
                             Integer studentId,
                             String statusStr,
                             String sourceStr,
                             LocalDateTime createdAt,
                             LocalDateTime updatedAt) {

        this.sessionId = sessionId;
        this.studentId = studentId;

        setStatusFromString(statusStr);
        setSourceFromString(sourceStr);

        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    // ===== Status =====

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

    // ===== Source =====

    public Source getSource() { return source; }

    public String getSourceStr() {
        return source == null ? null : source.name();
    }

    public void setSourceFromString(String str) {
        if (str == null) {
            this.source = null;
            return;
        }
        try {
            this.source = Source.valueOf(str.trim().toUpperCase());
        } catch (IllegalArgumentException e) {
            this.source = null;
        }
    }

    // ===== getters / setters =====

    public Integer getSessionId() { return sessionId; }
    public void setSessionId(Integer sessionId) { this.sessionId = sessionId; }

    public Integer getStudentId() { return studentId; }
    public void setStudentId(Integer studentId) { this.studentId = studentId; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }

    @Override
    public String toString() {
        return "Session " + sessionId + " - Student " + studentId;
    }
}
