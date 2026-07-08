package com.Tennis_EMS.DTO;

public class UpsertMatchSummaryRequestDTO {

    private String finalScoreText;
    private Integer sideAScore;
    private Integer sideBScore;

    public UpsertMatchSummaryRequestDTO() {}

    public UpsertMatchSummaryRequestDTO(String finalScoreText, Integer sideAScore, Integer sideBScore) {
        this.finalScoreText = finalScoreText;
        this.sideAScore = sideAScore;
        this.sideBScore = sideBScore;
    }

    public String getFinalScoreText() { return finalScoreText; }
    public void setFinalScoreText(String finalScoreText) { this.finalScoreText = finalScoreText; }

    public Integer getSideAScore() { return sideAScore; }
    public void setSideAScore(Integer sideAScore) { this.sideAScore = sideAScore; }

    public Integer getSideBScore() { return sideBScore; }
    public void setSideBScore(Integer sideBScore) { this.sideBScore = sideBScore; }
}
