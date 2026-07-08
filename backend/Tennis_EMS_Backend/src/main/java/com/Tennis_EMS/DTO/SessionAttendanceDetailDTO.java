package com.Tennis_EMS.DTO;

import java.time.LocalDateTime;

public class SessionAttendanceDetailDTO {

    private Integer sessionId;
    private Integer studentId;
    private String status;
    private String source;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public SessionAttendanceDetailDTO() {}

    public SessionAttendanceDetailDTO(Integer sessionId,
                                      Integer studentId,
                                      String status,
                                      String source,
                                      LocalDateTime createdAt,
                                      LocalDateTime updatedAt) {
        this.sessionId = sessionId;
        this.studentId = studentId;
        this.status = status;
        this.source = source;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    public Integer getSessionId() { return sessionId; }
    public void setSessionId(Integer sessionId) { this.sessionId = sessionId; }

    public Integer getStudentId() { return studentId; }
    public void setStudentId(Integer studentId) { this.studentId = studentId; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getSource() { return source; }
    public void setSource(String source) { this.source = source; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}
