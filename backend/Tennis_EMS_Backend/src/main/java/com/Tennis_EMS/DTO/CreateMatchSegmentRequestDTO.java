package com.Tennis_EMS.DTO;

public class CreateMatchSegmentRequestDTO {

    private Integer segmentNo;
    private String segmentType;
    private Integer sideAScore;
    private Integer sideBScore;

    public CreateMatchSegmentRequestDTO() {}

    public CreateMatchSegmentRequestDTO(Integer segmentNo,
                                        String segmentType,
                                        Integer sideAScore,
                                        Integer sideBScore) {
        this.segmentNo = segmentNo;
        this.segmentType = segmentType;
        this.sideAScore = sideAScore;
        this.sideBScore = sideBScore;
    }

    public Integer getSegmentNo() { return segmentNo; }
    public void setSegmentNo(Integer segmentNo) { this.segmentNo = segmentNo; }

    public String getSegmentType() { return segmentType; }
    public void setSegmentType(String segmentType) { this.segmentType = segmentType; }

    public Integer getSideAScore() { return sideAScore; }
    public void setSideAScore(Integer sideAScore) { this.sideAScore = sideAScore; }

    public Integer getSideBScore() { return sideBScore; }
    public void setSideBScore(Integer sideBScore) { this.sideBScore = sideBScore; }
}
