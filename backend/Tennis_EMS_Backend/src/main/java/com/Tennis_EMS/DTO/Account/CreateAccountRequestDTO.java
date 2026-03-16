package com.Tennis_EMS.DTO.Account;

import com.Tennis_EMS.Entity.User;

import java.time.LocalDate;

public class CreateAccountRequestDTO {

    private String email;
    private String password;
    private User.Role role;

    // ===== Common profile fields (optional by role rules) =====
    private String firstName;
    private String lastName;
    private String phone;

    // ===== Student-only =====
    private String preferredName;
    private LocalDate dateOfBirth;
    private String skillLevel;
    private String notes;
    private String emergencyContactName;
    private String emergencyContactPhone;

    // ===== Coach-only =====
    private String certification;
    private Integer experienceYears;
    private String bio;

    // ===== Admin-only =====
    private String adminLevel;

    public CreateAccountRequestDTO() {}

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }

    public User.Role getRole() { return role; }
    public void setRole(User.Role role) { this.role = role; }

    public String getFirstName() { return firstName; }
    public void setFirstName(String firstName) { this.firstName = firstName; }

    public String getLastName() { return lastName; }
    public void setLastName(String lastName) { this.lastName = lastName; }

    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }

    public String getPreferredName() { return preferredName; }
    public void setPreferredName(String preferredName) { this.preferredName = preferredName; }

    public LocalDate getDateOfBirth() { return dateOfBirth; }
    public void setDateOfBirth(LocalDate dateOfBirth) { this.dateOfBirth = dateOfBirth; }

    public String getSkillLevel() { return skillLevel; }
    public void setSkillLevel(String skillLevel) { this.skillLevel = skillLevel; }

    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }

    public String getEmergencyContactName() { return emergencyContactName; }
    public void setEmergencyContactName(String emergencyContactName) { this.emergencyContactName = emergencyContactName; }

    public String getEmergencyContactPhone() { return emergencyContactPhone; }
    public void setEmergencyContactPhone(String emergencyContactPhone) { this.emergencyContactPhone = emergencyContactPhone; }

    public String getCertification() { return certification; }
    public void setCertification(String certification) { this.certification = certification; }

    public Integer getExperienceYears() { return experienceYears; }
    public void setExperienceYears(Integer experienceYears) { this.experienceYears = experienceYears; }

    public String getBio() { return bio; }
    public void setBio(String bio) { this.bio = bio; }

    public String getAdminLevel() { return adminLevel; }
    public void setAdminLevel(String adminLevel) { this.adminLevel = adminLevel; }
}
