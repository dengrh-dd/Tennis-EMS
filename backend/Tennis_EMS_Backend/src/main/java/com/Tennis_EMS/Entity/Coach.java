package com.Tennis_EMS.Entity;

import java.time.LocalDate;
import java.time.LocalDateTime;

public class Coach {

    private Integer coachId;
    private Integer userId;

    private String firstName;
    private String lastName;
    private String phone;
    private LocalDate dateOfBirth;

    private String certification;
    private Integer experienceYears;
    private String bio;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public Coach() {}

    public Coach(Integer coachId,
                 Integer userId,
                 String firstName,
                 String lastName,
                 String phone,
                 LocalDate dateOfBirth,
                 String certification,
                 Integer experienceYears,
                 String bio,
                 LocalDateTime createdAt,
                 LocalDateTime updatedAt) {

        this.coachId = coachId;
        this.userId = userId;
        this.firstName = firstName;
        this.lastName = lastName;
        this.phone = phone;
        this.dateOfBirth = dateOfBirth;
        this.certification = certification;
        this.experienceYears = experienceYears;
        this.bio = bio;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    public Integer getCoachId() { return coachId; }
    public void setCoachId(Integer coachId) { this.coachId = coachId; }

    public Integer getUserId() { return userId; }
    public void setUserId(Integer userId) { this.userId = userId; }

    public String getFirstName() { return firstName; }
    public void setFirstName(String firstName) { this.firstName = firstName; }

    public String getLastName() { return lastName; }
    public void setLastName(String lastName) { this.lastName = lastName; }

    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }

    public LocalDate getDateOfBirth() { return dateOfBirth; }
    public void setDateOfBirth(LocalDate dateOfBirth) { this.dateOfBirth = dateOfBirth; }

    public String getCertification() { return certification; }
    public void setCertification(String certification) { this.certification = certification; }

    public Integer getExperienceYears() { return experienceYears; }
    public void setExperienceYears(Integer experienceYears) { this.experienceYears = experienceYears; }

    public String getBio() { return bio; }
    public void setBio(String bio) { this.bio = bio; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }

    @Override
    public String toString() {
        return coachId + " - " + firstName + " " + lastName;
    }
}
