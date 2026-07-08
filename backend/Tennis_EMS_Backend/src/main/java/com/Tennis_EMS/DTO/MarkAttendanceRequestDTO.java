package com.Tennis_EMS.DTO;

public class MarkAttendanceRequestDTO {

    private Integer sessionId;
    private Integer studentId;
    private String status;
    private String source; // optional, default = SECTION

    public MarkAttendanceRequestDTO() {}

    public MarkAttendanceRequestDTO(Integer sessionId,
                                    Integer studentId,
                                    String status,
                                    String source) {
        this.sessionId = sessionId;
        this.studentId = studentId;
        this.status = status;
        this.source = source;
    }

    public Integer getSessionId() { return sessionId; }
    public void setSessionId(Integer sessionId) { this.sessionId = sessionId; }

    public Integer getStudentId() { return studentId; }
    public void setStudentId(Integer studentId) { this.studentId = studentId; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getSource() { return source; }
    public void setSource(String source) { this.source = source; }
}
