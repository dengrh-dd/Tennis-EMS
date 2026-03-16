package com.Tennis_EMS.DTO;

import java.time.LocalDateTime;

public class CreateSessionRequestDTO {

    private Integer sectionId;
    private Integer courtId;
    private LocalDateTime startTime;
    private LocalDateTime endTime;
    private String status;

    public CreateSessionRequestDTO() {}

    public CreateSessionRequestDTO(Integer sectionId, Integer courtId,
                                   LocalDateTime startTime, LocalDateTime endTime,
                                   String status) {
        this.sectionId = sectionId;
        this.courtId = courtId;
        this.startTime = startTime;
        this.endTime = endTime;
        this.status = status;
    }

    public Integer getSectionId() { return sectionId; }
    public void setSectionId(Integer sectionId) { this.sectionId = sectionId; }

    public Integer getCourtId() { return courtId; }
    public void setCourtId(Integer courtId) { this.courtId = courtId; }

    public LocalDateTime getStartTime() { return startTime; }
    public void setStartTime(LocalDateTime startTime) { this.startTime = startTime; }

    public LocalDateTime getEndTime() { return endTime; }
    public void setEndTime(LocalDateTime endTime) { this.endTime = endTime; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
}
