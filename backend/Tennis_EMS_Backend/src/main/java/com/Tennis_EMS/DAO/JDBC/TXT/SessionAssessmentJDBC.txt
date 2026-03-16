package com.Tennis_EMS.DAO.JDBC;

import com.Tennis_EMS.DAO.SessionAssessmentDAO;
import com.Tennis_EMS.Entity.SessionAssessment;
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
public class SessionAssessmentJDBC implements SessionAssessmentDAO {

    private final JdbcTemplate jdbcTemplate;

    public SessionAssessmentJDBC(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    private final RowMapper<SessionAssessment> rowMapper = (rs, rowNum) -> {
        Timestamp createdTs = rs.getTimestamp("createdAt");
        Timestamp updatedTs = rs.getTimestamp("updatedAt");

        LocalDateTime createdAt = createdTs == null ? null : createdTs.toLocalDateTime();
        LocalDateTime updatedAt = updatedTs == null ? null : updatedTs.toLocalDateTime();

        SessionAssessment a = new SessionAssessment(
                rs.getInt("assessmentId"),
                rs.getInt("sessionId"),
                rs.getInt("studentId"),
                null,
                rs.getObject("score", Integer.class),
                rs.getString("comment"),
                rs.getInt("assessorUserId"),
                createdAt,
                updatedAt
        );

        a.setMetricFromString(rs.getString("metric"));
        return a;
    };

    @Override
    public int insert(SessionAssessment assessment) {
        final String sql = """
                INSERT INTO SessionAssessment
                (sessionId, studentId, metric, score, comment, assessorUserId)
                VALUES (?, ?, ?, ?, ?, ?)
                """;

        KeyHolder keyHolder = new GeneratedKeyHolder();

        int rows = jdbcTemplate.update(connection -> {
            PreparedStatement ps = connection.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS);
            ps.setInt(1, assessment.getSessionId());
            ps.setInt(2, assessment.getStudentId());
            ps.setString(3, assessment.getMetricStr() != null ? assessment.getMetricStr() : "OTHER");
            ps.setObject(4, assessment.getScore());
            ps.setString(5, assessment.getComment());
            ps.setInt(6, assessment.getAssessorUserId());
            return ps;
        }, keyHolder);

        if (rows != 1) {
            throw new IllegalStateException("Insert failed: affected rows = " + rows);
        }

        Number key = keyHolder.getKey();
        if (key == null) {
            throw new IllegalStateException("Insert succeeded but no generated key returned.");
        }

        int id = key.intValue();
        assessment.setAssessmentId(id);
        return id;
    }

    @Override
    public SessionAssessment getById(int assessmentId) {
        final String sql = """
                SELECT assessmentId, sessionId, studentId, metric,
                       score, comment, assessorUserId,
                       createdAt, updatedAt
                FROM SessionAssessment
                WHERE assessmentId = ?
                """;
        try {
            return jdbcTemplate.queryForObject(sql, rowMapper, assessmentId);
        } catch (EmptyResultDataAccessException e) {
            return null;
        }
    }

    @Override
    public SessionAssessment getByUnique(int sessionId, int studentId,
                                         SessionAssessment.Metric metric) {
        final String sql = """
                SELECT assessmentId, sessionId, studentId, metric,
                       score, comment, assessorUserId,
                       createdAt, updatedAt
                FROM SessionAssessment
                WHERE sessionId = ? AND studentId = ? AND metric = ?
                """;
        try {
            return jdbcTemplate.queryForObject(
                    sql, rowMapper,
                    sessionId, studentId, metric.name()
            );
        } catch (EmptyResultDataAccessException e) {
            return null;
        }
    }

    @Override
    public List<SessionAssessment> getBySession(int sessionId) {
        final String sql = """
                SELECT assessmentId, sessionId, studentId, metric,
                       score, comment, assessorUserId,
                       createdAt, updatedAt
                FROM SessionAssessment
                WHERE sessionId = ?
                ORDER BY studentId, metric
                """;
        return jdbcTemplate.query(sql, rowMapper, sessionId);
    }

    @Override
    public List<SessionAssessment> getByStudent(int studentId) {
        final String sql = """
                SELECT assessmentId, sessionId, studentId, metric,
                       score, comment, assessorUserId,
                       createdAt, updatedAt
                FROM SessionAssessment
                WHERE studentId = ?
                ORDER BY createdAt DESC
                """;
        return jdbcTemplate.query(sql, rowMapper, studentId);
    }

    @Override
    public List<SessionAssessment> getBySessionAndStudent(int sessionId, int studentId) {
        final String sql = """
                SELECT assessmentId, sessionId, studentId, metric,
                       score, comment, assessorUserId,
                       createdAt, updatedAt
                FROM SessionAssessment
                WHERE sessionId = ? AND studentId = ?
                ORDER BY metric
                """;
        return jdbcTemplate.query(sql, rowMapper, sessionId, studentId);
    }

    @Override
    public boolean update(SessionAssessment assessment) {
        final String sql = """
                UPDATE SessionAssessment
                SET score = ?, comment = ?
                WHERE assessmentId = ?
                """;

        int rows = jdbcTemplate.update(
                sql,
                assessment.getScore(),
                assessment.getComment(),
                assessment.getAssessmentId()
        );

        return rows == 1;
    }

    @Override
    public boolean delete(int assessmentId) {
        return jdbcTemplate.update(
                "DELETE FROM SessionAssessment WHERE assessmentId = ?",
                assessmentId
        ) == 1;
    }
}
