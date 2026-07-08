package com.Tennis_EMS.DTO;

public class AddTrainingGroupMemberRequestDTO {

    private Integer studentId;
    private String startDate;
    private String endDate;

    public AddTrainingGroupMemberRequestDTO() {}

    public AddTrainingGroupMemberRequestDTO(Integer studentId, String startDate, String endDate) {
        this.studentId = studentId;
        this.startDate = startDate;
        this.endDate = endDate;
    }

    public Integer getStudentId() { return studentId; }
    public void setStudentId(Integer studentId) { this.studentId = studentId; }

    public String getStartDate() { return startDate; }
    public void setStartDate(String startDate) { this.startDate = startDate; }

    public String getEndDate() { return endDate; }
    public void setEndDate(String endDate) { this.endDate = endDate; }
}
