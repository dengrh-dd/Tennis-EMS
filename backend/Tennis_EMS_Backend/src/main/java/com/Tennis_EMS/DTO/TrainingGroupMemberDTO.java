package com.Tennis_EMS.DTO;

public class TrainingGroupMemberDTO {

    private Integer groupId;
    private Integer studentId;
    private String startDate;
    private String endDate;
    private Boolean active;

    public TrainingGroupMemberDTO() {}

    public TrainingGroupMemberDTO(Integer groupId,
                                  Integer studentId,
                                  String startDate,
                                  String endDate,
                                  Boolean active) {
        this.groupId = groupId;
        this.studentId = studentId;
        this.startDate = startDate;
        this.endDate = endDate;
        this.active = active;
    }

    public Integer getGroupId() { return groupId; }
    public void setGroupId(Integer groupId) { this.groupId = groupId; }

    public Integer getStudentId() { return studentId; }
    public void setStudentId(Integer studentId) { this.studentId = studentId; }

    public String getStartDate() { return startDate; }
    public void setStartDate(String startDate) { this.startDate = startDate; }

    public String getEndDate() { return endDate; }
    public void setEndDate(String endDate) { this.endDate = endDate; }

    public Boolean getActive() { return active; }
    public void setActive(Boolean active) { this.active = active; }
}
