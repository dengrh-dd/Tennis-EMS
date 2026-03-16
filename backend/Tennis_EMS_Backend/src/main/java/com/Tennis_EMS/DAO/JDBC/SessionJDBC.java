package com.Tennis_EMS.DAO.JDBC;

import com.Tennis_EMS.DAO.SessionDAO;
import com.Tennis_EMS.Entity.Session;
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
public class SessionJDBC implements SessionDAO {

    private final JdbcTemplate jdbcTemplate;

    public SessionJDBC(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    private final RowMapper<Session> rowMapper = (rs, rowNum) -> {

        Timestamp startTs = rs.getTimestamp("startTime");
        Timestamp endTs = rs.getTimestamp("endTime");

        Timestamp createdTs = rs.getTimestamp("createdAt");
        Timestamp updatedTs = rs.getTimestamp("updatedAt");

        LocalDateTime startTime =
                startTs == null ? null : startTs.toLocalDateTime();
        LocalDateTime endTime =
                endTs == null ? null : endTs.toLocalDateTime();

        LocalDateTime createdAt =
                createdTs == null ? null : createdTs.toLocalDateTime();
        LocalDateTime updatedAt =
                updatedTs == null ? null : updatedTs.toLocalDateTime();

        return new Session(
                rs.getInt("sessionId"),
                rs.getInt("sectionId"),
                startTime,
                endTime,
                rs.getString("location"),
                rs.getObject("courtId", Integer.class),
                rs.getString("status"),
                createdAt,
                updatedAt
        );
    };

    @Override
    public int insert(Session session) {

        final String sql = """
                INSERT INTO Session
                (sectionId, startTime, endTime,
                 location, courtId, status)
                VALUES (?, ?, ?, ?, ?, ?)
                """;

        KeyHolder keyHolder = new GeneratedKeyHolder();

        int rows = jdbcTemplate.update(connection -> {
            PreparedStatement ps =
                    connection.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS);

            ps.setInt(1, session.getSectionId());
            ps.setTimestamp(2,
                    Timestamp.valueOf(session.getStartTime()));
            ps.setTimestamp(3,
                    Timestamp.valueOf(session.getEndTime()));
            ps.setString(4, session.getLocation());
            ps.setObject(5, session.getCourtId());
            ps.setString(6,
                    session.getStatusStr() == null ?
                            "SCHEDULED" :
                            session.getStatusStr());

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
        session.setSessionId(generatedId);

        return generatedId;
    }

    @Override
    public List<Session> getAll() {

        final String sql = """
                SELECT sessionId, sectionId,
                       startTime, endTime,
                       location, courtId,
                       status, createdAt, updatedAt
                FROM Session
                ORDER BY startTime
                """;

        return jdbcTemplate.query(sql, rowMapper);
    }

    @Override
    public Session getById(int id) {

        final String sql = """
                SELECT sessionId, sectionId,
                       startTime, endTime,
                       location, courtId,
                       status, createdAt, updatedAt
                FROM Session
                WHERE sessionId = ?
                """;

        try {
            return jdbcTemplate.queryForObject(sql, rowMapper, id);
        } catch (EmptyResultDataAccessException e) {
            return null;
        }
    }

    @Override
    public List<Session> getBySectionId(int sectionId) {

        final String sql = """
                SELECT * FROM Session
                WHERE sectionId = ?
                ORDER BY startTime
                """;

        return jdbcTemplate.query(sql, rowMapper, sectionId);
    }

    @Override
    public Session getBySectionIdAndStartTime(int sectionId, LocalDateTime startTime) {

        if (startTime == null) {
            throw new IllegalArgumentException("Session startTime cannot be null.");
        }

        final String sql = """
            SELECT sessionId, sectionId,
                   startTime, endTime,
                   location, courtId,
                   status, createdAt, updatedAt
            FROM Session
            WHERE sectionId = ? AND startTime = ?
            """;

        try {
            return jdbcTemplate.queryForObject(
                    sql,
                    rowMapper,
                    sectionId,
                    Timestamp.valueOf(startTime)
            );
        } catch (EmptyResultDataAccessException e) {
            return null;
        }
    }

    @Override
    public boolean update(Session session) {

        final String sql = """
                UPDATE Session
                SET sectionId = ?, startTime = ?, endTime = ?,
                    location = ?, courtId = ?, status = ?
                WHERE sessionId = ?
                """;

        int rows = jdbcTemplate.update(
                sql,
                session.getSectionId(),
                Timestamp.valueOf(session.getStartTime()),
                Timestamp.valueOf(session.getEndTime()),
                session.getLocation(),
                session.getCourtId(),
                session.getStatusStr(),
                session.getSessionId()
        );

        return rows == 1;
    }

    @Override
    public boolean delete(int id) {

        return jdbcTemplate.update(
                "DELETE FROM Session WHERE sessionId = ?",
                id
        ) == 1;
    }
}

