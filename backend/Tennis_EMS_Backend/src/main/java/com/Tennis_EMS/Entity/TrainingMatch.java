package com.Tennis_EMS.Entity;

import java.time.LocalDateTime;

public class TrainingMatch {

    public enum MatchType {
        SINGLES,
        DOUBLES
    }

    public enum Status {
        SCHEDULED,
        IN_PROGRESS,
        COMPLETED,
        CANCELLED
    }

    public enum WinnerSide {
        A,
        B
    }

    private Integer matchId;
    private Integer sessionId;
    private Integer formatId;

    private MatchType matchType;
    private String title;
    private String notes;

    private Status status;
    private WinnerSide winnerSide;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public TrainingMatch() {}

    public TrainingMatch(Integer matchId,
                         Integer sessionId,
                         Integer formatId,
                         MatchType matchType,
                         String title,
                         String notes,
                         Status status,
                         WinnerSide winnerSide,
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

    public MatchType getMatchType() { return matchType; }
    public void setMatchType(MatchType matchType) { this.matchType = matchType; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }

    public Status getStatus() { return status; }
    public void setStatus(Status status) { this.status = status; }

    public WinnerSide getWinnerSide() { return winnerSide; }
    public void setWinnerSide(WinnerSide winnerSide) { this.winnerSide = winnerSide; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }

    public String getMatchTypeStr() {
        return matchType == null ? null : matchType.name();
    }

    public void setMatchTypeFromString(String value) {
        if (value == null) {
            this.matchType = null;
            return;
        }
        try {
            this.matchType = MatchType.valueOf(value.trim().toUpperCase());
        } catch (IllegalArgumentException e) {
            this.matchType = MatchType.SINGLES;
        }
    }

    public String getStatusStr() {
        return status == null ? null : status.name();
    }

    public void setStatusFromString(String value) {
        if (value == null) {
            this.status = null;
            return;
        }
        try {
            this.status = Status.valueOf(value.trim().toUpperCase());
        } catch (IllegalArgumentException e) {
            this.status = Status.SCHEDULED;
        }
    }

    public String getWinnerSideStr() {
        return winnerSide == null ? null : winnerSide.name();
    }

    public void setWinnerSideFromString(String value) {
        if (value == null) {
            this.winnerSide = null;
            return;
        }
        try {
            this.winnerSide = WinnerSide.valueOf(value.trim().toUpperCase());
        } catch (IllegalArgumentException e) {
            this.winnerSide = null;
        }
    }
}
