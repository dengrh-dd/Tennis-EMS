package com.Tennis_EMS.DTO;

public class LoginResponseDTO {

    private Integer userId;
    private String email;
    private String role;

    private Integer profileId;
    private String displayName;

    public LoginResponseDTO() {}

    public LoginResponseDTO(Integer userId,
                            String email,
                            String role,
                            Integer profileId,
                            String displayName) {
        this.userId = userId;
        this.email = email;
        this.role = role;
        this.profileId = profileId;
        this.displayName = displayName;
    }

    public Integer getUserId() { return userId; }
    public void setUserId(Integer userId) { this.userId = userId; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }

    public Integer getProfileId() { return profileId; }
    public void setProfileId(Integer profileId) { this.profileId = profileId; }

    public String getDisplayName() { return displayName; }
    public void setDisplayName(String displayName) { this.displayName = displayName; }
}
