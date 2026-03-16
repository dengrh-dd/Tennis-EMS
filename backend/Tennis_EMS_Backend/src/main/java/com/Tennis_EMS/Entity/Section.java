package com.Tennis_EMS.Entity;

import java.time.LocalDate;
import java.time.LocalDateTime;

public class Section {

    public enum EnrollmentMode {
        FIXED,
        DROP_IN,
        HYBRID
    }

    public enum Status {
        PLANNED,
        ACTIVE,
        FINISHED,
        CANCELLED
    }

    private Integer sectionId;
    private Integer courseId;
    private Integer coachId;

    private String name;
    private String syllabus;

    private LocalDate startDate;
    private LocalDate endDate;

    private Integer maxStudents;

    private EnrollmentMode enrollmentMode;
    private Status status;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public Section() {}

    public Section(Integer sectionId,
                   Integer courseId,
                   Integer coachId,
                   String name,
                   String syllabus,
                   LocalDate startDate,
                   LocalDate endDate,
                   Integer maxStudents,
                   String enrollmentModeStr,
                   String statusStr,
                   LocalDateTime createdAt,
                   LocalDateTime updatedAt) {

        this.sectionId = sectionId;
        this.courseId = courseId;
        this.coachId = coachId;
        this.name = name;
        this.syllabus = syllabus;
        this.startDate = startDate;
        this.endDate = endDate;
        this.maxStudents = maxStudents;

        setEnrollmentModeFromString(enrollmentModeStr);
        setStatusFromString(statusStr);

        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    // ===== EnrollmentMode =====

    public EnrollmentMode getEnrollmentMode() { return enrollmentMode; }

    public String getEnrollmentModeStr() {
        return enrollmentMode == null ? null : enrollmentMode.name();
    }

    public void setEnrollmentModeFromString(String str) {
        if (str == null) {
            this.enrollmentMode = null;
            return;
        }
        try {
            this.enrollmentMode =
                    EnrollmentMode.valueOf(str.trim().toUpperCase());
        } catch (IllegalArgumentException e) {
            this.enrollmentMode = null;
        }
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
            this.status =
                    Status.valueOf(str.trim().toUpperCase());
        } catch (IllegalArgumentException e) {
            this.status = null;
        }
    }

    // ===== getters / setters =====

    public Integer getSectionId() { return sectionId; }
    public void setSectionId(Integer sectionId) { this.sectionId = sectionId; }

    public Integer getCourseId() { return courseId; }
    public void setCourseId(Integer courseId) { this.courseId = courseId; }

    public Integer getCoachId() { return coachId; }
    public void setCoachId(Integer coachId) { this.coachId = coachId; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getSyllabus() { return syllabus; }
    public void setSyllabus(String syllabus) { this.syllabus = syllabus; }

    public LocalDate getStartDate() { return startDate; }
    public void setStartDate(LocalDate startDate) { this.startDate = startDate; }

    public LocalDate getEndDate() { return endDate; }
    public void setEndDate(LocalDate endDate) { this.endDate = endDate; }

    public Integer getMaxStudents() { return maxStudents; }
    public void setMaxStudents(Integer maxStudents) { this.maxStudents = maxStudents; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }

    @Override
    public String toString() {
        return sectionId + " - " + name;
    }
}

