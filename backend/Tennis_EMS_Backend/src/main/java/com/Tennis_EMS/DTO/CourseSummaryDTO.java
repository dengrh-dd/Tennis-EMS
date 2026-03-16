package com.Tennis_EMS.DTO;

public class CourseSummaryDTO {

    private Integer courseId;
    private String name;
    private String courseNumber;
    private String level;
    private Boolean isActive;

    public CourseSummaryDTO() {}

    public CourseSummaryDTO(Integer courseId, String name, String courseNumber, String level, Boolean isActive) {
        this.courseId = courseId;
        this.name = name;
        this.courseNumber = courseNumber;
        this.level = level;
        this.isActive = isActive;
    }

    public Integer getCourseId() { return courseId; }
    public void setCourseId(Integer courseId) { this.courseId = courseId; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getCourseNumber() { return courseNumber; }
    public void setCourseNumber(String courseNumber) { this.courseNumber = courseNumber; }

    public String getLevel() { return level; }
    public void setLevel(String level) { this.level = level; }

    public Boolean getIsActive() { return isActive; }
    public void setIsActive(Boolean isActive) { this.isActive = isActive; }
}
