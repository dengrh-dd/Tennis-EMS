package com.Tennis_EMS.DTO;

public class AddMatchPlayerRequestDTO {

    private String side;
    private Integer position;
    private Integer studentId;

    public AddMatchPlayerRequestDTO() {}

    public AddMatchPlayerRequestDTO(String side, Integer position, Integer studentId) {
        this.side = side;
        this.position = position;
        this.studentId = studentId;
    }

    public String getSide() { return side; }
    public void setSide(String side) { this.side = side; }

    public Integer getPosition() { return position; }
    public void setPosition(Integer position) { this.position = position; }

    public Integer getStudentId() { return studentId; }
    public void setStudentId(Integer studentId) { this.studentId = studentId; }
}
