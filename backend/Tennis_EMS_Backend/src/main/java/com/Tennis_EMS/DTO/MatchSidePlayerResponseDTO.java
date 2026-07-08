package com.Tennis_EMS.DTO;

public class MatchSidePlayerResponseDTO {

    private Integer matchId;
    private String side;
    private Integer position;
    private Integer studentId;

    public MatchSidePlayerResponseDTO() {}

    public MatchSidePlayerResponseDTO(Integer matchId, String side, Integer position, Integer studentId) {
        this.matchId = matchId;
        this.side = side;
        this.position = position;
        this.studentId = studentId;
    }

    public Integer getMatchId() { return matchId; }
    public void setMatchId(Integer matchId) { this.matchId = matchId; }

    public String getSide() { return side; }
    public void setSide(String side) { this.side = side; }

    public Integer getPosition() { return position; }
    public void setPosition(Integer position) { this.position = position; }

    public Integer getStudentId() { return studentId; }
    public void setStudentId(Integer studentId) { this.studentId = studentId; }
}
