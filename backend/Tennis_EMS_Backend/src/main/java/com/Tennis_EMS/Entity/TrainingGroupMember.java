package com.Tennis_EMS.Entity;

import java.time.LocalDate;
import java.time.LocalDateTime;

public class TrainingGroupMember {

    private Integer groupId;
    private Integer studentId;

    private LocalDate startDate;
    private LocalDate endDate;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public TrainingGroupMember() {}

    public TrainingGroupMember(Integer groupId,
                               Integer studentId,
                               LocalDate startDate,
                               LocalDate endDate,
                               LocalDateTime createdAt,
                               LocalDateTime updatedAt) {
        this.groupId = groupId;
        this.studentId = studentId;
        this.startDate = startDate;
        this.endDate = endDate;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    public Integer getGroupId() { return groupId; }
    public void setGroupId(Integer groupId) { this.groupId = groupId; }

    public Integer getStudentId() { return studentId; }
    public void setStudentId(Integer studentId) { this.studentId = studentId; }

    public LocalDate getStartDate() { return startDate; }
    public void setStartDate(LocalDate startDate) { this.startDate = startDate; }

    public LocalDate getEndDate() { return endDate; }
    public void setEndDate(LocalDate endDate) { this.endDate = endDate; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }

    public boolean isActive() {
        return endDate == null;
    }
}
