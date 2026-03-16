package com.Tennis_EMS.DTO;

public class CourseDetailDTO {

    private Integer courseId;
    private String name;
    private String courseNumber;
    private String description;
    private String level;
    private Boolean isActive;
    private int sectionCount;

    public CourseDetailDTO() {}

    public CourseDetailDTO(Integer courseId, String name, String courseNumber, String description,
                           String level, Boolean isActive, int sectionCount) {
        this.courseId = courseId;
        this.name = name;
        this.courseNumber = courseNumber;
        this.description = description;
        this.level = level;
        this.isActive = isActive;
        this.sectionCount = sectionCount;
    }

    public Integer getCourseId() { return courseId; }
    public void setCourseId(Integer courseId) { this.courseId = courseId; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getCourseNumber() { return courseNumber; }
    public void setCourseNumber(String courseNumber) { this.courseNumber = courseNumber; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getLevel() { return level; }
    public void setLevel(String level) { this.level = level; }

    public Boolean getIsActive() { return isActive; }
    public void setIsActive(Boolean isActive) { this.isActive = isActive; }

    public int getSectionCount() { return sectionCount; }
    public void setSectionCount(int sectionCount) { this.sectionCount = sectionCount; }
}
