package com.Tennis_EMS.Entity;

import java.time.LocalDate;
import java.time.LocalDateTime;

public class Student {

    public enum SkillLevel {
        BEGINNER,
        INTERMEDIATE,
        ADVANCED
    }

    private Integer studentId;
    private Integer userId;

    private String firstName;
    private String lastName;
    private String preferredName;
    private String phone;
    private LocalDate dateOfBirth;

    private SkillLevel skillLevel;
    private String notes;

    private String emergencyContactName;
    private String emergencyContactPhone;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public Student() {}

    public Student(Integer studentId,
                   Integer userId,
                   String firstName,
                   String lastName,
                   String preferredName,
                   String phone,
                   LocalDate dateOfBirth,
                   String skillLevelStr,
                   String notes,
                   String emergencyContactName,
                   String emergencyContactPhone,
                   LocalDateTime createdAt,
                   LocalDateTime updatedAt) {

        this.studentId = studentId;
        this.userId = userId;
        this.firstName = firstName;
        this.lastName = lastName;
        this.preferredName = preferredName;
        this.phone = phone;
        this.dateOfBirth = dateOfBirth;
        setSkillLevelFromString(skillLevelStr);
        this.notes = notes;
        this.emergencyContactName = emergencyContactName;
        this.emergencyContactPhone = emergencyContactPhone;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    // ===== Enum safe parsing =====

    public SkillLevel getSkillLevel() { return skillLevel; }

    public String getSkillLevelStr() {
        return skillLevel == null ? null : skillLevel.name();
    }

    public void setSkillLevel(SkillLevel skillLevel) {
        this.skillLevel = skillLevel;
    }

    public void setSkillLevelFromString(String levelStr) {
        if (levelStr == null) {
            this.skillLevel = null;
            return;
        }
        try {
            this.skillLevel = SkillLevel.valueOf(levelStr.trim().toUpperCase());
        } catch (IllegalArgumentException e) {
            this.skillLevel = null;
        }
    }

    // ===== getters / setters =====

    public Integer getStudentId() { return studentId; }
    public void setStudentId(Integer studentId) { this.studentId = studentId; }

    public Integer getUserId() { return userId; }
    public void setUserId(Integer userId) { this.userId = userId; }

    public String getFirstName() { return firstName; }
    public void setFirstName(String firstName) { this.firstName = firstName; }

    public String getLastName() { return lastName; }
    public void setLastName(String lastName) { this.lastName = lastName; }

    public String getPreferredName() { return preferredName; }
    public void setPreferredName(String preferredName) { this.preferredName = preferredName; }

    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }

    public LocalDate getDateOfBirth() { return dateOfBirth; }
    public void setDateOfBirth(LocalDate dateOfBirth) { this.dateOfBirth = dateOfBirth; }

    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }

    public String getEmergencyContactName() { return emergencyContactName; }
    public void setEmergencyContactName(String name) { this.emergencyContactName = name; }

    public String getEmergencyContactPhone() { return emergencyContactPhone; }
    public void setEmergencyContactPhone(String phone) { this.emergencyContactPhone = phone; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }

    @Override
    public String toString() {
        return studentId + " - " + firstName + " " + lastName;
    }
}

