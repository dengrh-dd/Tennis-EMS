package com.Tennis_EMS.Entity;

import java.time.LocalDateTime;

public class ScoringFormat {

    public enum FormatType {
        POINT_RACE,
        GAME_RACE,
        SET_MATCH
    }

    private Integer formatId;

    private String name;
    private FormatType formatType;

    private Integer pointsToWin;
    private Boolean winByTwo;

    private Integer gamesToWinSet;
    private Integer setsToWinMatch;
    private Integer tiebreakAt;

    private Boolean noAd;

    private String notes;
    private Boolean isActive;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public ScoringFormat() {}

    public ScoringFormat(Integer formatId,
                         String name,
                         FormatType formatType,
                         Integer pointsToWin,
                         Boolean winByTwo,
                         Integer gamesToWinSet,
                         Integer setsToWinMatch,
                         Integer tiebreakAt,
                         Boolean noAd,
                         String notes,
                         Boolean isActive,
                         LocalDateTime createdAt,
                         LocalDateTime updatedAt) {
        this.formatId = formatId;
        this.name = name;
        this.formatType = formatType;
        this.pointsToWin = pointsToWin;
        this.winByTwo = winByTwo;
        this.gamesToWinSet = gamesToWinSet;
        this.setsToWinMatch = setsToWinMatch;
        this.tiebreakAt = tiebreakAt;
        this.noAd = noAd;
        this.notes = notes;
        this.isActive = isActive;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    public Integer getFormatId() { return formatId; }
    public void setFormatId(Integer formatId) { this.formatId = formatId; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public FormatType getFormatType() { return formatType; }
    public void setFormatType(FormatType formatType) { this.formatType = formatType; }

    public Integer getPointsToWin() { return pointsToWin; }
    public void setPointsToWin(Integer pointsToWin) { this.pointsToWin = pointsToWin; }

    public Boolean getWinByTwo() { return winByTwo; }
    public void setWinByTwo(Boolean winByTwo) { this.winByTwo = winByTwo; }

    public Integer getGamesToWinSet() { return gamesToWinSet; }
    public void setGamesToWinSet(Integer gamesToWinSet) { this.gamesToWinSet = gamesToWinSet; }

    public Integer getSetsToWinMatch() { return setsToWinMatch; }
    public void setSetsToWinMatch(Integer setsToWinMatch) { this.setsToWinMatch = setsToWinMatch; }

    public Integer getTiebreakAt() { return tiebreakAt; }
    public void setTiebreakAt(Integer tiebreakAt) { this.tiebreakAt = tiebreakAt; }

    public Boolean getNoAd() { return noAd; }
    public void setNoAd(Boolean noAd) { this.noAd = noAd; }

    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }

    public Boolean getIsActive() { return isActive; }
    public void setIsActive(Boolean active) { isActive = active; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }

    public String getFormatTypeStr() {
        return formatType == null ? null : formatType.name();
    }

    public void setFormatTypeFromString(String value) {
        if (value == null) {
            this.formatType = null;
            return;
        }
        try {
            this.formatType = FormatType.valueOf(value.trim().toUpperCase());
        } catch (IllegalArgumentException e) {
            this.formatType = null;
        }
    }
}
