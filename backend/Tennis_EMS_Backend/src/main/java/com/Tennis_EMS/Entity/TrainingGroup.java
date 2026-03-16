package com.Tennis_EMS.Entity;

import java.time.LocalDateTime;

public class TrainingGroup {

    public enum GroupType {
        TRAINING_GROUP,
        CLASS_GROUP,
        CLUB_TEAM
    }

    private Integer groupId;
    private String name;
    private GroupType groupType;
    private String description;
    private Boolean isActive;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public TrainingGroup() {}

    public TrainingGroup(Integer groupId,
                         String name,
                         GroupType groupType,
                         String description,
                         Boolean isActive,
                         LocalDateTime createdAt,
                         LocalDateTime updatedAt) {
        this.groupId = groupId;
        this.name = name;
        this.groupType = groupType;
        this.description = description;
        this.isActive = isActive;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    public Integer getGroupId() { return groupId; }
    public void setGroupId(Integer groupId) { this.groupId = groupId; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public GroupType getGroupType() { return groupType; }
    public void setGroupType(GroupType groupType) { this.groupType = groupType; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public Boolean getIsActive() { return isActive; }
    public void setIsActive(Boolean active) { isActive = active; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }

    public String getGroupTypeStr() {
        return groupType == null ? null : groupType.name();
    }

    public void setGroupTypeFromString(String value) {
        if (value == null) {
            this.groupType = null;
            return;
        }
        try {
            this.groupType = GroupType.valueOf(value.trim().toUpperCase());
        } catch (IllegalArgumentException e) {
            this.groupType = null;
        }
    }

    @Override
    public String toString() {
        return groupId + " - " + name;
    }
}
