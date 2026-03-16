package com.Tennis_EMS.DAO.JDBC;

import com.Tennis_EMS.DAO.SessionNoteDAO;
import com.Tennis_EMS.Entity.SessionNote;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.jdbc.support.GeneratedKeyHolder;
import org.springframework.jdbc.support.KeyHolder;
import org.springframework.stereotype.Repository;

import java.sql.PreparedStatement;
import java.sql.Statement;
import java.sql.Timestamp;
import java.time.LocalDateTime;
import java.util.List;

@Repository
public class SessionNoteJDBC implements SessionNoteDAO {

    private final JdbcTemplate jdbcTemplate;

    public SessionNoteJDBC(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    private final RowMapper<SessionNote> rowMapper = (rs, rowNum) -> {
        Timestamp createdTs = rs.getTimestamp("createdAt");
        Timestamp updatedTs = rs.getTimestamp("updatedAt");

        LocalDateTime createdAt = createdTs == null ? null : createdTs.toLocalDateTime();
        LocalDateTime updatedAt = updatedTs == null ? null : updatedTs.toLocalDateTime();

        return new SessionNote(
                rs.getInt("noteId"),
                rs.getInt("sessionId"),
                rs.getInt("authorUserId"),
                rs.getString("title"),
                rs.getString("content"),
                createdAt,
                updatedAt
        );
    };

    @Override
    public int insert(SessionNote note) {
        final String sql = """
                INSERT INTO SessionNote (sessionId, authorUserId, title, content)
                VALUES (?, ?, ?, ?)
                """;

        KeyHolder keyHolder = new GeneratedKeyHolder();

        int rows = jdbcTemplate.update(connection -> {
            PreparedStatement ps = connection.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS);
            ps.setInt(1, note.getSessionId());
            ps.setInt(2, note.getAuthorUserId());
            ps.setString(3, note.getTitle());
            ps.setString(4, note.getContent());
            return ps;
        }, keyHolder);

        if (rows != 1) {
            throw new IllegalStateException("Insert failed: affected rows = " + rows);
        }

        Number key = keyHolder.getKey();
        if (key == null) {
            throw new IllegalStateException("Insert succeeded but no generated key returned.");
        }

        int generatedId = key.intValue();
        note.setNoteId(generatedId);
        return generatedId;
    }

    @Override
    public SessionNote getById(int noteId) {
        final String sql = """
                SELECT noteId, sessionId, authorUserId, title, content, createdAt, updatedAt
                FROM SessionNote
                WHERE noteId = ?
                """;
        try {
            return jdbcTemplate.queryForObject(sql, rowMapper, noteId);
        } catch (EmptyResultDataAccessException e) {
            return null;
        }
    }

    @Override
    public List<SessionNote> getBySession(int sessionId) {
        final String sql = """
                SELECT noteId, sessionId, authorUserId, title, content, createdAt, updatedAt
                FROM SessionNote
                WHERE sessionId = ?
                ORDER BY createdAt DESC
                """;
        return jdbcTemplate.query(sql, rowMapper, sessionId);
    }

    @Override
    public List<SessionNote> getByAuthor(int authorUserId) {
        final String sql = """
                SELECT noteId, sessionId, authorUserId, title, content, createdAt, updatedAt
                FROM SessionNote
                WHERE authorUserId = ?
                ORDER BY createdAt DESC
                """;
        return jdbcTemplate.query(sql, rowMapper, authorUserId);
    }

    @Override
    public boolean update(SessionNote note) {
        final String sql = """
                UPDATE SessionNote
                SET title = ?, content = ?
                WHERE noteId = ?
                """;

        int rows = jdbcTemplate.update(
                sql,
                note.getTitle(),
                note.getContent(),
                note.getNoteId()
        );

        return rows == 1;
    }

    @Override
    public boolean delete(int noteId) {
        return jdbcTemplate.update(
                "DELETE FROM SessionNote WHERE noteId = ?",
                noteId
        ) == 1;
    }
}
