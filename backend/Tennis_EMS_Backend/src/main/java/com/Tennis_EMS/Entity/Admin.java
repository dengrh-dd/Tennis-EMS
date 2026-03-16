package com.Tennis_EMS.Entity;

import java.time.LocalDateTime;

public class Admin {

    public enum AdminLevel {
        SUPER,
        STANDARD
    }

    private Integer adminId;
    private Integer userId;

    private String firstName;
    private String lastName;
    private String phone;

    private AdminLevel adminLevel;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public Admin() {}

    public Admin(Integer adminId,
                 Integer userId,
                 String firstName,
                 String lastName,
                 String phone,
                 String adminLevelStr,
                 LocalDateTime createdAt,
                 LocalDateTime updatedAt) {

        this.adminId = adminId;
        this.userId = userId;
        this.firstName = firstName;
        this.lastName = lastName;
        this.phone = phone;
        setAdminLevelFromString(adminLevelStr);
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    // ===== getters / setters =====

    public Integer getAdminId() { return adminId; }
    public void setAdminId(Integer adminId) { this.adminId = adminId; }

    public Integer getUserId() { return userId; }
    public void setUserId(Integer userId) { this.userId = userId; }

    public String getFirstName() { return firstName; }
    public void setFirstName(String firstName) { this.firstName = firstName; }

    public String getLastName() { return lastName; }
    public void setLastName(String lastName) { this.lastName = lastName; }

    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }

    public AdminLevel getAdminLevel() { return adminLevel; }
    public String getAdminLevelStr() {
        return adminLevel == null ? null : adminLevel.name();
    }

    public void setAdminLevel(AdminLevel adminLevel) {
        this.adminLevel = adminLevel;
    }

    public void setAdminLevelFromString(String levelStr) {
        if (levelStr == null) {
            this.adminLevel = null;
            return;
        }
        try {
            this.adminLevel = AdminLevel.valueOf(levelStr.trim().toUpperCase());
        } catch (IllegalArgumentException e) {
            this.adminLevel = null;
        }
    }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }

    @Override
    public String toString() {
        return adminId + " - " + firstName + " " + lastName;
    }
}
