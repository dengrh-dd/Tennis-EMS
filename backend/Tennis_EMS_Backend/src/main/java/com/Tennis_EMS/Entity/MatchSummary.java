package com.Tennis_EMS.Entity;

import java.time.LocalDateTime;

public class MatchSummary {

    private Integer matchId;

    private String finalScoreText;
    private Integer sideAScore;
    private Integer sideBScore;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public MatchSummary() {}

    public MatchSummary(Integer matchId,
                        String finalScoreText,
                        Integer sideAScore,
                        Integer sideBScore,
                        LocalDateTime createdAt,
                        LocalDateTime updatedAt) {
        this.matchId = matchId;
        this.finalScoreText = finalScoreText;
        this.sideAScore = sideAScore;
        this.sideBScore = sideBScore;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    public Integer getMatchId() { return matchId; }
    public void setMatchId(Integer matchId) { this.matchId = matchId; }

    public String getFinalScoreText() { return finalScoreText; }
    public void setFinalScoreText(String finalScoreText) { this.finalScoreText = finalScoreText; }

    public Integer getSideAScore() { return sideAScore; }
    public void setSideAScore(Integer sideAScore) { this.sideAScore = sideAScore; }

    public Integer getSideBScore() { return sideBScore; }
    public void setSideBScore(Integer sideBScore) { this.sideBScore = sideBScore; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}
