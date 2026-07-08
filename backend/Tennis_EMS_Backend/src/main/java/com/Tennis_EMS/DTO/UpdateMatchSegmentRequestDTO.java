package com.Tennis_EMS.DTO;

public class UpdateMatchSegmentRequestDTO {

    private String segmentType;
    private Integer sideAScore;
    private Integer sideBScore;

    public UpdateMatchSegmentRequestDTO() {}

    public UpdateMatchSegmentRequestDTO(String segmentType, Integer sideAScore, Integer sideBScore) {
        this.segmentType = segmentType;
        this.sideAScore = sideAScore;
        this.sideBScore = sideBScore;
    }

    public String getSegmentType() { return segmentType; }
    public void setSegmentType(String segmentType) { this.segmentType = segmentType; }

    public Integer getSideAScore() { return sideAScore; }
    public void setSideAScore(Integer sideAScore) { this.sideAScore = sideAScore; }

    public Integer getSideBScore() { return sideBScore; }
    public void setSideBScore(Integer sideBScore) { this.sideBScore = sideBScore; }
}
