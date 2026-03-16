package com.Tennis_EMS.Entity;

public class Court {

    public enum SurfaceType {
        HARD,
        CLAY,
        GRASS,
        SYNTHETIC;

        public static SurfaceType parse(String value) {
            if (value == null) {
                return null;
            }
            String normalized = value.trim().toUpperCase();
            try {
                return SurfaceType.valueOf(normalized);
            } catch (IllegalArgumentException e) {
                return null;
            }
        }
    }

    public enum Status {
        AVAILABLE,
        MAINTENANCE,
        CLOSED;

        public static Status parse(String value) {
            if (value == null) {
                return null;
            }
            String normalized = value.trim().toUpperCase();
            try {
                return Status.valueOf(normalized);
            } catch (IllegalArgumentException e) {
                return null;
            }
        }
    }

    private Integer courtId;
    private String name;
    private String location;
    private SurfaceType surfaceType;
    private Boolean isIndoor;
    private Boolean hasLighting;
    private Status status;

    public Court() {}

    public Court(
            Integer courtId,
            String name,
            String location,
            SurfaceType surfaceType,
            Boolean isIndoor,
            Boolean hasLighting,
            Status status
    ) {
        this.courtId = courtId;
        this.name = name;
        this.location = location;
        this.surfaceType = surfaceType;
        this.isIndoor = isIndoor;
        this.hasLighting = hasLighting;
        this.status = status;
    }

    public Integer getCourtId() { return courtId; }
    public void setCourtId(Integer courtId) { this.courtId = courtId; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getLocation() { return location; }
    public void setLocation(String location) { this.location = location; }

    public SurfaceType getSurfaceType() { return surfaceType; }
    public void setSurfaceType(SurfaceType surfaceType) { this.surfaceType = surfaceType; }

    public String getSurfaceTypeStr() {
        return surfaceType == null ? null : surfaceType.name();
    }

    public void setSurfaceTypeFromString(String value) {
        this.surfaceType = SurfaceType.parse(value);
    }

    public Boolean getIsIndoor() { return isIndoor; }
    public void setIsIndoor(Boolean indoor) { isIndoor = indoor; }

    public Boolean getHasLighting() { return hasLighting; }
    public void setHasLighting(Boolean hasLighting) { this.hasLighting = hasLighting; }

    public Status getStatus() { return status; }
    public void setStatus(Status status) { this.status = status; }

    public String getStatusStr() {
        return status == null ? null : status.name();
    }

    public void setStatusFromString(String value) {
        this.status = Status.parse(value);
    }

    @Override
    public String toString() {
        return courtId + " - " + name + " (" + location + ")";
    }
}