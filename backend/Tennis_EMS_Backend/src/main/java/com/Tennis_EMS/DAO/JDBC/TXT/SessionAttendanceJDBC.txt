package com.Tennis_EMS.DAO.JDBC;

import com.Tennis_EMS.DAO.SessionAttendanceDAO;
import com.Tennis_EMS.Entity.SessionAttendance;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Repository;

import java.sql.Timestamp;
import java.time.LocalDateTime;
import java.util.List;

@Repository
public class SessionAttendanceJDBC implements SessionAttendanceDAO {

    private final JdbcTemplate jdbcTemplate;

    public SessionAttendanceJDBC(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    private final RowMapper<SessionAttendance> rowMapper = (rs, rowNum) -> {

        Timestamp createdTs = rs.getTimestamp("createdAt");
        Timestamp updatedTs = rs.getTimestamp("updatedAt");

        LocalDateTime createdAt =
                createdTs == null ? null : createdTs.toLocalDateTime();
        LocalDateTime updatedAt =
                updatedTs == null ? null : updatedTs.toLocalDateTime();

        return new SessionAttendance(
                rs.getInt("sessionId"),
                rs.getInt("studentId"),
                rs.getString("status"),
                rs.getString("source"),
                createdAt,
                updatedAt
        );
    };

    @Override
    public boolean insert(SessionAttendance sa) {

        final String sql = """
                INSERT INTO SessionAttendance
                (sessionId, studentId, status, source)
                VALUES (?, ?, ?, ?)
                """;

        int rows = jdbcTemplate.update(
                sql,
                sa.getSessionId(),
                sa.getStudentId(),
                sa.getStatusStr() == null ?
                        "ENROLLED" :
                        sa.getStatusStr(),
                sa.getSourceStr() == null ?
                        "DROP_IN" :
                        sa.getSourceStr()
        );

        return rows == 1;
    }

    @Override
    public SessionAttendance get(int sessionId, int studentId) {

        final String sql = """
                SELECT sessionId, studentId,
                       status, source,
                       createdAt, updatedAt
                FROM SessionAttendance
                WHERE sessionId = ? AND studentId = ?
                """;

        try {
            return jdbcTemplate.queryForObject(
                    sql, rowMapper, sessionId, studentId);
        } catch (EmptyResultDataAccessException e) {
            return null;
        }
    }

    @Override
    public List<SessionAttendance> getBySessionId(int sessionId) {

        final String sql = """
                SELECT * FROM SessionAttendance
                WHERE sessionId = ?
                """;

        return jdbcTemplate.query(sql, rowMapper, sessionId);
    }

    @Override
    public List<SessionAttendance> getByStudentId(int studentId) {

        final String sql = """
                SELECT * FROM SessionAttendance
                WHERE studentId = ?
                """;

        return jdbcTemplate.query(sql, rowMapper, studentId);
    }

    @Override
    public boolean updateStatus(int sessionId,
                                int studentId,
                                String status) {

        final String sql = """
                UPDATE SessionAttendance
                SET status = ?
                WHERE sessionId = ? AND studentId = ?
                """;

        return jdbcTemplate.update(sql, status, sessionId, studentId) == 1;
    }

    @Override
    public boolean updateSource(int sessionId,
                                int studentId,
                                String source) {

        final String sql = """
                UPDATE SessionAttendance
                SET source = ?
                WHERE sessionId = ? AND studentId = ?
                """;

        return jdbcTemplate.update(sql, source, sessionId, studentId) == 1;
    }

    @Override
    public boolean delete(int sessionId, int studentId) {

        final String sql = """
                DELETE FROM SessionAttendance
                WHERE sessionId = ? AND studentId = ?
                """;

        return jdbcTemplate.update(sql, sessionId, studentId) == 1;
    }
}
