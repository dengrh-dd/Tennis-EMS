package com.Tennis_EMS.Entity;

import java.time.LocalDateTime;

public class SessionAssessment {

    public enum Metric {
        FOREHAND,
        BACKHAND,
        SERVE,
        VOLLEY,
        FOOTWORK,
        STAMINA,
        STRATEGY,
        MENTAL,
        CONSISTENCY,
        OTHER
    }

    private Integer assessmentId;

    private Integer sessionId;
    private Integer studentId;

    private Metric metric;
    private Integer score;
    private String comment;

    private Integer assessorUserId;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public SessionAssessment() {}

    public SessionAssessment(Integer assessmentId,
                             Integer sessionId,
                             Integer studentId,
                             Metric metric,
                             Integer score,
                             String comment,
                             Integer assessorUserId,
                             LocalDateTime createdAt,
                             LocalDateTime updatedAt) {
        this.assessmentId = assessmentId;
        this.sessionId = sessionId;
        this.studentId = studentId;
        this.metric = metric;
        this.score = score;
        this.comment = comment;
        this.assessorUserId = assessorUserId;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    public Integer getAssessmentId() { return assessmentId; }
    public void setAssessmentId(Integer assessmentId) { this.assessmentId = assessmentId; }

    public Integer getSessionId() { return sessionId; }
    public void setSessionId(Integer sessionId) { this.sessionId = sessionId; }

    public Integer getStudentId() { return studentId; }
    public void setStudentId(Integer studentId) { this.studentId = studentId; }

    public Metric getMetric() { return metric; }
    public void setMetric(Metric metric) { this.metric = metric; }

    public Integer getScore() { return score; }
    public void setScore(Integer score) { this.score = score; }

    public String getComment() { return comment; }
    public void setComment(String comment) { this.comment = comment; }

    public Integer getAssessorUserId() { return assessorUserId; }
    public void setAssessorUserId(Integer assessorUserId) { this.assessorUserId = assessorUserId; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }

    public String getMetricStr() {
        return metric == null ? null : metric.name();
    }

    public void setMetricFromString(String value) {
        if (value == null) {
            this.metric = null;
            return;
        }
        try {
            this.metric = Metric.valueOf(value.trim().toUpperCase());
        } catch (IllegalArgumentException e) {
            this.metric = Metric.OTHER;
        }
    }
}
