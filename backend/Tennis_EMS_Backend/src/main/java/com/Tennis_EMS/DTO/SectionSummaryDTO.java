package com.Tennis_EMS.DTO;

public class SectionSummaryDTO {

    private Integer sectionId;
    private Integer courseId;
    private String name;
    private String status;
    private Boolean isActive;
    private String courseName;

    public SectionSummaryDTO() {}

    public SectionSummaryDTO(Integer sectionId, Integer courseId, String name, String status,
                             Boolean isActive, String courseName) {
        this.sectionId = sectionId;
        this.courseId = courseId;
        this.name = name;
        this.status = status;
        this.isActive = isActive;
        this.courseName = courseName;
    }

    public Integer getSectionId() { return sectionId; }
    public void setSectionId(Integer sectionId) { this.sectionId = sectionId; }

    public Integer getCourseId() { return courseId; }
    public void setCourseId(Integer courseId) { this.courseId = courseId; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public Boolean getIsActive() { return isActive; }
    public void setIsActive(Boolean isActive) { this.isActive = isActive; }

    public String getCourseName() { return courseName; }
    public void setCourseName(String courseName) { this.courseName = courseName; }
}
