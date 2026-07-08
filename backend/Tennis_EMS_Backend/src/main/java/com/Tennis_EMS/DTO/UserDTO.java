package com.Tennis_EMS.DTO;

public class UserDTO {

    private Integer userId;
    private String email;
    private String role;
    private Boolean isActive;
    private Integer profileId;
    private String displayName;

    public UserDTO() {}

    public UserDTO(Integer userId,
                   String email,
                   String role,
                   Boolean isActive,
                   Integer profileId,
                   String displayName) {
        this.userId = userId;
        this.email = email;
        this.role = role;
        this.isActive = isActive;
        this.profileId = profileId;
        this.displayName = displayName;
    }

    public Integer getUserId() { return userId; }
    public void setUserId(Integer userId) { this.userId = userId; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }

    public Boolean getIsActive() { return isActive; }
    public void setIsActive(Boolean isActive) { this.isActive = isActive; }

    public Integer getProfileId() { return profileId; }
    public void setProfileId(Integer profileId) { this.profileId = profileId; }

    public String getDisplayName() { return displayName; }
    public void setDisplayName(String displayName) { this.displayName = displayName; }
}
