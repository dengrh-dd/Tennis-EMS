package com.Tennis_EMS.DTO;

public class EnrollRequestDTO {

    private Integer studentId;
    private Integer sectionId;

    public EnrollRequestDTO() {}

    public EnrollRequestDTO(Integer studentId, Integer sectionId) {
        this.studentId = studentId;
        this.sectionId = sectionId;
    }

    public Integer getStudentId() { return studentId; }
    public void setStudentId(Integer studentId) { this.studentId = studentId; }

    public Integer getSectionId() { return sectionId; }
    public void setSectionId(Integer sectionId) { this.sectionId = sectionId; }
}
