package com.Tennis_EMS.DTO;

public class SessionAttendanceSummaryDTO {

    private Integer sessionId;
    private Integer studentId;
    private String status;
    private String source;
    private String studentName;
    private String sessionLabel;

    public SessionAttendanceSummaryDTO() {}

    public SessionAttendanceSummaryDTO(Integer sessionId,
                                       Integer studentId,
                                       String status,
                                       String source,
                                       String studentName,
                                       String sessionLabel) {
        this.sessionId = sessionId;
        this.studentId = studentId;
        this.status = status;
        this.source = source;
        this.studentName = studentName;
        this.sessionLabel = sessionLabel;
    }

    public Integer getSessionId() { return sessionId; }
    public void setSessionId(Integer sessionId) { this.sessionId = sessionId; }

    public Integer getStudentId() { return studentId; }
    public void setStudentId(Integer studentId) { this.studentId = studentId; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getSource() { return source; }
    public void setSource(String source) { this.source = source; }

    public String getStudentName() { return studentName; }
    public void setStudentName(String studentName) { this.studentName = studentName; }

    public String getSessionLabel() { return sessionLabel; }
    public void setSessionLabel(String sessionLabel) { this.sessionLabel = sessionLabel; }
}