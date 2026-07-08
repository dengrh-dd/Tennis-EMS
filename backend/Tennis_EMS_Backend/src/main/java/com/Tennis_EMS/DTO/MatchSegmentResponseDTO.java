package com.Tennis_EMS.DTO;

import java.time.LocalDateTime;

public class MatchSegmentResponseDTO {

    private Integer matchId;
    private Integer segmentNo;
    private String segmentType;
    private Integer sideAScore;
    private Integer sideBScore;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public MatchSegmentResponseDTO() {}

    public MatchSegmentResponseDTO(Integer matchId,
                                   Integer segmentNo,
                                   String segmentType,
                                   Integer sideAScore,
                                   Integer sideBScore,
                                   LocalDateTime createdAt,
                                   LocalDateTime updatedAt) {
        this.matchId = matchId;
        this.segmentNo = segmentNo;
        this.segmentType = segmentType;
        this.sideAScore = sideAScore;
        this.sideBScore = sideBScore;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    public Integer getMatchId() { return matchId; }
    public void setMatchId(Integer matchId) { this.matchId = matchId; }

    public Integer getSegmentNo() { return segmentNo; }
    public void setSegmentNo(Integer segmentNo) { this.segmentNo = segmentNo; }

    public String getSegmentType() { return segmentType; }
    public void setSegmentType(String segmentType) { this.segmentType = segmentType; }

    public Integer getSideAScore() { return sideAScore; }
    public void setSideAScore(Integer sideAScore) { this.sideAScore = sideAScore; }

    public Integer getSideBScore() { return sideBScore; }
    public void setSideBScore(Integer sideBScore) { this.sideBScore = sideBScore; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}
