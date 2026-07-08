package com.Tennis_EMS.DTO;

import java.time.LocalDateTime;

public class EnrollmentDetailDTO {

    private Integer studentId;
    private Integer sectionId;
    private String status;
    private LocalDateTime createdAt;

    public EnrollmentDetailDTO() {}

    public EnrollmentDetailDTO(Integer studentId, Integer sectionId, String status, LocalDateTime createdAt) {
        this.studentId = studentId;
        this.sectionId = sectionId;
        this.status = status;
        this.createdAt = createdAt;
    }

    public Integer getStudentId() { return studentId; }
    public void setStudentId(Integer studentId) { this.studentId = studentId; }

    public Integer getSectionId() { return sectionId; }
    public void setSectionId(Integer sectionId) { this.sectionId = sectionId; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
