package com.Tennis_EMS.DTO;

public class CreateTrainingMatchRequestDTO {

    private Integer sessionId;
    private Integer formatId;
    private String matchType;
    private String title;
    private String notes;
    private String status;
    private String winnerSide;

    public CreateTrainingMatchRequestDTO() {}

    public CreateTrainingMatchRequestDTO(Integer sessionId,
                                         Integer formatId,
                                         String matchType,
                                         String title,
                                         String notes,
                                         String status,
                                         String winnerSide) {
        this.sessionId = sessionId;
        this.formatId = formatId;
        this.matchType = matchType;
        this.title = title;
        this.notes = notes;
        this.status = status;
        this.winnerSide = winnerSide;
    }

    public Integer getSessionId() { return sessionId; }
    public void setSessionId(Integer sessionId) { this.sessionId = sessionId; }

    public Integer getFormatId() { return formatId; }
    public void setFormatId(Integer formatId) { this.formatId = formatId; }

    public String getMatchType() { return matchType; }
    public void setMatchType(String matchType) { this.matchType = matchType; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getWinnerSide() { return winnerSide; }
    public void setWinnerSide(String winnerSide) { this.winnerSide = winnerSide; }
}
