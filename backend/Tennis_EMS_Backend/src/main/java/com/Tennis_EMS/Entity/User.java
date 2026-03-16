package com.Tennis_EMS.Entity;

import java.time.LocalDateTime;

public class User {

    public enum Role {
        ADMIN,
        COACH,
        STUDENT;

        public static Role parse(String value) {
            if (value == null) {
                return null;
            }
            String normalized = value.trim().toUpperCase();
            try {
                return Role.valueOf(normalized);
            } catch (IllegalArgumentException e) {
                return null;
            }
        }
    }

    private Integer userId;
    private String email;
    private String passwordHash;
    private Role role;
    private Boolean isActive;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public User() {}

    public User(Integer id,
                String email,
                String passwordHash,
                Role role,
                Boolean isActive,
                LocalDateTime createdAt,
                LocalDateTime updatedAt) {
        this.userId = id;
        this.email = email;
        this.passwordHash = passwordHash;
        this.role = role;
        this.isActive = isActive;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    public Integer getUserId() { return userId; }
    public void setUserId(Integer userId) { this.userId = userId; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getPasswordHash() { return passwordHash; }
    public void setPasswordHash(String passwordHash) { this.passwordHash = passwordHash; }

    public Role getRole() { return role; }
    public void setRole(Role role) { this.role = role; }

    public String getRoleStr() {
        return role == null ? null : role.name();
    }

    public void setRoleFromString(String roleStr) {
        this.role = Role.parse(roleStr);
    }

    public Boolean getIsActive() { return isActive; }
    public void setIsActive(Boolean active) { isActive = active; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }

    @Override
    public String toString() {
        return userId + " - " + email + " (" + getRoleStr() + ")";
    }
}

