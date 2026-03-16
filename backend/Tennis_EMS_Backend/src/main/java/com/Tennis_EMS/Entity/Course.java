package com.Tennis_EMS.Entity;

public class Course {

    public enum Level {
        BEGINNER,
        INTERMEDIATE,
        ADVANCED
    }

    private Integer courseId;
    private String name;
    private String courseNumber;
    private String description;
    private Level level;
    private Boolean isActive;

    public Course() {}

    public Course(Integer courseId,
                  String name,
                  String courseNumber,
                  String description,
                  String levelStr,
                  Boolean isActive) {

        this.courseId = courseId;
        this.name = name;
        this.courseNumber = courseNumber;
        this.description = description;
        setLevelFromString(levelStr);
        this.isActive = isActive;
    }

    // ===== Enum safe parsing =====

    public Level getLevel() { return level; }

    public String getLevelStr() {
        return level == null ? null : level.name();
    }

    public void setLevel(Level level) {
        this.level = level;
    }

    public void setLevelFromString(String levelStr) {
        if (levelStr == null) {
            this.level = null;
            return;
        }
        try {
            this.level = Level.valueOf(levelStr.trim().toUpperCase());
        } catch (IllegalArgumentException e) {
            this.level = null;
        }
    }

    // ===== getters / setters =====

    public Integer getCourseId() { return courseId; }
    public void setCourseId(Integer courseId) { this.courseId = courseId; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getCourseNumber() { return courseNumber; }
    public void setCourseNumber(String courseNumber) { this.courseNumber = courseNumber; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public Boolean getIsActive() { return isActive; }
    public void setIsActive(Boolean active) { isActive = active; }

    @Override
    public String toString() {
        return courseNumber + " - " + name;
    }
}
