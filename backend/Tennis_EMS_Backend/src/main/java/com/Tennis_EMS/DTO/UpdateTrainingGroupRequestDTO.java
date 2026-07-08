package com.Tennis_EMS.DTO;

public class UpdateTrainingGroupRequestDTO {

    private String name;
    private String description;
    private Boolean isActive;

    public UpdateTrainingGroupRequestDTO() {}

    public UpdateTrainingGroupRequestDTO(String name, String description, Boolean isActive) {
        this.name = name;
        this.description = description;
        this.isActive = isActive;
    }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public Boolean getIsActive() { return isActive; }
    public void setIsActive(Boolean isActive) { this.isActive = isActive; }
}
