package com.Tennis_EMS.DTO.Account;

import com.Tennis_EMS.Entity.User;

public class CreateAccountResponseDTO {

    private Integer userId;
    private User.Role role;

    private Integer profileId;      // adminId / coachId / studentId
    private String displayName;     // quick UI usage

    public CreateAccountResponseDTO() {}

    public CreateAccountResponseDTO(Integer userId, User.Role role, Integer profileId, String displayName) {
        this.userId = userId;
        this.role = role;
        this.profileId = profileId;
        this.displayName = displayName;
    }

    public Integer getUserId() { return userId; }
    public void setUserId(Integer userId) { this.userId = userId; }

    public User.Role getRole() { return role; }
    public void setRole(User.Role role) { this.role = role; }

    public Integer getProfileId() { return profileId; }
    public void setProfileId(Integer profileId) { this.profileId = profileId; }

    public String getDisplayName() { return displayName; }
    public void setDisplayName(String displayName) { this.displayName = displayName; }
}
