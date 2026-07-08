package com.Tennis_EMS.DTO;

/** Read-only court row for admin session/court pickers. */
public class CourtSummaryDTO {

    private Integer courtId;
    private String name;
    private String location;

    public CourtSummaryDTO() {}

    public CourtSummaryDTO(Integer courtId, String name, String location) {
        this.courtId = courtId;
        this.name = name;
        this.location = location;
    }

    public Integer getCourtId() {
        return courtId;
    }

    public void setCourtId(Integer courtId) {
        this.courtId = courtId;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
        this.location = location;
    }
}
