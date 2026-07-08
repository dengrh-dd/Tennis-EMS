package com.Tennis_EMS.DTO;

import java.time.LocalDateTime;

public class EnrollmentSummaryDTO {

    private Integer studentId;
    private Integer sectionId;
    private String status;
    private LocalDateTime createdAt;
    private String studentName;
    private String sectionName;

    public EnrollmentSummaryDTO() {}

    public EnrollmentSummaryDTO(Integer studentId, Integer sectionId, String status,
                                LocalDateTime createdAt, String studentName, String sectionName) {
        this.studentId = studentId;
        this.sectionId = sectionId;
        this.status = status;
        this.createdAt = createdAt;
        this.studentName = studentName;
        this.sectionName = sectionName;
    }

    public Integer getStudentId() { return studentId; }
    public void setStudentId(Integer studentId) { this.studentId = studentId; }

    public Integer getSectionId() { return sectionId; }
    public void setSectionId(Integer sectionId) { this.sectionId = sectionId; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public String getStudentName() { return studentName; }
    public void setStudentName(String studentName) { this.studentName = studentName; }

    public String getSectionName() { return sectionName; }
    public void setSectionName(String sectionName) { this.sectionName = sectionName; }
}
