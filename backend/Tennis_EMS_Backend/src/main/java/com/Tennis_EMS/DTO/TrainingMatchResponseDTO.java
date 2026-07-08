package com.Tennis_EMS.DTO;

import java.time.LocalDateTime;

public class TrainingMatchResponseDTO {

    private Integer matchId;
    private Integer sessionId;
    private Integer formatId;
    private String matchType;
    private String title;
    private String notes;
    private String status;
    private String winnerSide;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public TrainingMatchResponseDTO() {}

    public TrainingMatchResponseDTO(Integer matchId,
                                    Integer sessionId,
                                    Integer formatId,
                                    String matchType,
                                    String title,
                                    String notes,
                                    String status,
                                    String winnerSide,
                                    LocalDateTime createdAt,
                                    LocalDateTime updatedAt) {
        this.matchId = matchId;
        this.sessionId = sessionId;
        this.formatId = formatId;
        this.matchType = matchType;
        this.title = title;
        this.notes = notes;
        this.status = status;
        this.winnerSide = winnerSide;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    public Integer getMatchId() { return matchId; }
    public void setMatchId(Integer matchId) { this.matchId = matchId; }

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

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}
