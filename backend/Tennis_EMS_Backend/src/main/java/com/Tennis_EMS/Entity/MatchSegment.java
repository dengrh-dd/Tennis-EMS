package com.Tennis_EMS.Entity;

import java.time.LocalDateTime;

public class MatchSegment {

    public enum SegmentType {
        SET,
        TB,
        RACE
    }

    private Integer matchId;
    private Integer segmentNo;

    private SegmentType segmentType;

    private Integer sideAScore;
    private Integer sideBScore;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public MatchSegment() {}

    public MatchSegment(Integer matchId,
                        Integer segmentNo,
                        SegmentType segmentType,
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

    public SegmentType getSegmentType() { return segmentType; }
    public void setSegmentType(SegmentType segmentType) { this.segmentType = segmentType; }

    public Integer getSideAScore() { return sideAScore; }
    public void setSideAScore(Integer sideAScore) { this.sideAScore = sideAScore; }

    public Integer getSideBScore() { return sideBScore; }
    public void setSideBScore(Integer sideBScore) { this.sideBScore = sideBScore; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }

    public String getSegmentTypeStr() {
        return segmentType == null ? null : segmentType.name();
    }

    public void setSegmentTypeFromString(String value) {
        if (value == null) {
            this.segmentType = null;
            return;
        }
        try {
            this.segmentType = SegmentType.valueOf(value.trim().toUpperCase());
        } catch (IllegalArgumentException e) {
            this.segmentType = SegmentType.SET;
        }
    }
}
