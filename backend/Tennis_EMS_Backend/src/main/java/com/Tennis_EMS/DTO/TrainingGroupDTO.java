package com.Tennis_EMS.DTO;

public class TrainingGroupDTO {

    private Integer groupId;
    private String name;
    private String groupType;
    private String description;
    private Boolean isActive;

    public TrainingGroupDTO() {}

    public TrainingGroupDTO(Integer groupId,
                            String name,
                            String groupType,
                            String description,
                            Boolean isActive) {
        this.groupId = groupId;
        this.name = name;
        this.groupType = groupType;
        this.description = description;
        this.isActive = isActive;
    }

    public Integer getGroupId() { return groupId; }
    public void setGroupId(Integer groupId) { this.groupId = groupId; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getGroupType() { return groupType; }
    public void setGroupType(String groupType) { this.groupType = groupType; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public Boolean getIsActive() { return isActive; }
    public void setIsActive(Boolean isActive) { this.isActive = isActive; }
}
