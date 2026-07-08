package com.Tennis_EMS.DTO;

public class ScoringFormatResponseDTO {

    private Integer formatId;
    private String name;
    private String formatType;
    private Integer pointsToWin;
    private Boolean winByTwo;
    private Integer gamesToWinSet;
    private Integer setsToWinMatch;
    private Integer tiebreakAt;
    private Boolean noAd;
    private String notes;
    private Boolean isActive;

    public ScoringFormatResponseDTO() {}

    public ScoringFormatResponseDTO(Integer formatId,
                                    String name,
                                    String formatType,
                                    Integer pointsToWin,
                                    Boolean winByTwo,
                                    Integer gamesToWinSet,
                                    Integer setsToWinMatch,
                                    Integer tiebreakAt,
                                    Boolean noAd,
                                    String notes,
                                    Boolean isActive) {
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
    }

    public Integer getFormatId() { return formatId; }
    public void setFormatId(Integer formatId) { this.formatId = formatId; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getFormatType() { return formatType; }
    public void setFormatType(String formatType) { this.formatType = formatType; }

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
}
