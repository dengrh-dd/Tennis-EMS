package com.Tennis_EMS.DTO;

import java.time.LocalDate;

public class UpdateSectionRequestDTO {

    private Integer courseId;
    private Integer coachId;
    private String name;
    private String syllabus;
    private LocalDate startDate;
    private LocalDate endDate;
    private Integer maxStudents;
    private String enrollmentMode;
    private String status;
    private Boolean isActive;

    public UpdateSectionRequestDTO() {}

    public UpdateSectionRequestDTO(Integer courseId, Integer coachId, String name, String syllabus,
                                  LocalDate startDate, LocalDate endDate, Integer maxStudents,
                                  String enrollmentMode, String status, Boolean isActive) {
        this.courseId = courseId;
        this.coachId = coachId;
        this.name = name;
        this.syllabus = syllabus;
        this.startDate = startDate;
        this.endDate = endDate;
        this.maxStudents = maxStudents;
        this.enrollmentMode = enrollmentMode;
        this.status = status;
        this.isActive = isActive;
    }

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

    public String getEnrollmentMode() { return enrollmentMode; }
    public void setEnrollmentMode(String enrollmentMode) { this.enrollmentMode = enrollmentMode; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public Boolean getIsActive() { return isActive; }
    public void setIsActive(Boolean isActive) { this.isActive = isActive; }
}
