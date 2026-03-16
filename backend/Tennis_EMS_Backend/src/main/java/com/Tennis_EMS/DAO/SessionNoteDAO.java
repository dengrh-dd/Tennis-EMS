package com.Tennis_EMS.DAO;

import com.Tennis_EMS.Entity.SessionNote;

import java.util.List;

public interface SessionNoteDAO {

    int insert(SessionNote note);

    SessionNote getById(int noteId);

    List<SessionNote> getBySession(int sessionId);

    List<SessionNote> getByAuthor(int authorUserId);

    boolean update(SessionNote note);

    boolean delete(int noteId);
}
