package com.Tennis_EMS.DTO;

public class CreateTrainingGroupRequestDTO {

    private String name;
    private String groupType;
    private String description;

    public CreateTrainingGroupRequestDTO() {}

    public CreateTrainingGroupRequestDTO(String name, String groupType, String description) {
        this.name = name;
        this.groupType = groupType;
        this.description = description;
    }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getGroupType() { return groupType; }
    public void setGroupType(String groupType) { this.groupType = groupType; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
}
