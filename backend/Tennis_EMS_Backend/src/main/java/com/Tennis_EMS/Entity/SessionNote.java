package com.Tennis_EMS.Entity;

import java.time.LocalDateTime;

public class SessionNote {

    private Integer noteId;
    private Integer sessionId;
    private Integer authorUserId;

    private String title;
    private String content;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public SessionNote() {}

    public SessionNote(Integer noteId,
                       Integer sessionId,
                       Integer authorUserId,
                       String title,
                       String content,
                       LocalDateTime createdAt,
                       LocalDateTime updatedAt) {
        this.noteId = noteId;
        this.sessionId = sessionId;
        this.authorUserId = authorUserId;
        this.title = title;
        this.content = content;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    public Integer getNoteId() { return noteId; }
    public void setNoteId(Integer noteId) { this.noteId = noteId; }

    public Integer getSessionId() { return sessionId; }
    public void setSessionId(Integer sessionId) { this.sessionId = sessionId; }

    public Integer getAuthorUserId() { return authorUserId; }
    public void setAuthorUserId(Integer authorUserId) { this.authorUserId = authorUserId; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getContent() { return content; }
    public void setContent(String content) { this.content = content; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}
