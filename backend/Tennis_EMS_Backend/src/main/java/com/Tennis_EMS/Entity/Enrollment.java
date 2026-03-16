package com.Tennis_EMS.Entity;

import java.time.LocalDateTime;

public class Enrollment {

    public enum Status {
        ENROLLED,
        DROPPED,
        COMPLETED
    }

    private Integer studentId;
    private Integer sectionId;

    private Status status;
    private LocalDateTime createdAt;

    public Enrollment() {}

    public Enrollment(Integer studentId,
                      Integer sectionId,
                      String statusStr,
                      LocalDateTime createdAt) {

        this.studentId = studentId;
        this.sectionId = sectionId;
        setStatusFromString(statusStr);
        this.createdAt = createdAt;
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

    public Integer getStudentId() { return studentId; }
    public void setStudentId(Integer studentId) { this.studentId = studentId; }

    public Integer getSectionId() { return sectionId; }
    public void setSectionId(Integer sectionId) { this.sectionId = sectionId; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    @Override
    public String toString() {
        return "Student " + studentId + " → Section " + sectionId;
    }
}