package com.Tennis_EMS.Entity;

public class MatchSidePlayer {

    public enum Side {
        A,
        B
    }

    private Integer matchId;
    private Side side;
    private Integer position;
    private Integer studentId;

    public MatchSidePlayer() {}

    public MatchSidePlayer(Integer matchId,
                           Side side,
                           Integer position,
                           Integer studentId) {
        this.matchId = matchId;
        this.side = side;
        this.position = position;
        this.studentId = studentId;
    }

    public Integer getMatchId() { return matchId; }
    public void setMatchId(Integer matchId) { this.matchId = matchId; }

    public Side getSide() { return side; }
    public void setSide(Side side) { this.side = side; }

    public Integer getPosition() { return position; }
    public void setPosition(Integer position) { this.position = position; }

    public Integer getStudentId() { return studentId; }
    public void setStudentId(Integer studentId) { this.studentId = studentId; }

    public String getSideStr() {
        return side == null ? null : side.name();
    }

    public void setSideFromString(String value) {
        if (value == null) {
            this.side = null;
            return;
        }
        try {
            this.side = Side.valueOf(value.trim().toUpperCase());
        } catch (IllegalArgumentException e) {
            this.side = null;
        }
    }
}
