package com.Tennis_EMS.DAO.JDBC;

import com.Tennis_EMS.DAO.TrainingMatchDAO;
import com.Tennis_EMS.Entity.TrainingMatch;
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
public class TrainingMatchJDBC implements TrainingMatchDAO {

    private final JdbcTemplate jdbcTemplate;

    public TrainingMatchJDBC(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    private final RowMapper<TrainingMatch> rowMapper = (rs, rowNum) -> {
        Timestamp createdTs = rs.getTimestamp("createdAt");
        Timestamp updatedTs = rs.getTimestamp("updatedAt");

        LocalDateTime createdAt = createdTs == null ? null : createdTs.toLocalDateTime();
        LocalDateTime updatedAt = updatedTs == null ? null : updatedTs.toLocalDateTime();

        TrainingMatch m = new TrainingMatch(
                rs.getInt("matchId"),
                rs.getInt("sessionId"),
                rs.getInt("formatId"),
                null,
                rs.getString("title"),
                rs.getString("notes"),
                null,
                null,
                createdAt,
                updatedAt
        );

        m.setMatchTypeFromString(rs.getString("matchType"));
        m.setStatusFromString(rs.getString("status"));
        m.setWinnerSideFromString(rs.getString("winnerSide"));

        return m;
    };

    @Override
    public int insert(TrainingMatch match) {
        final String sql = """
                INSERT INTO TrainingMatch
                (sessionId, formatId, matchType, title, notes, status, winnerSide)
                VALUES (?, ?, ?, ?, ?, ?, ?)
                """;

        KeyHolder keyHolder = new GeneratedKeyHolder();

        int rows = jdbcTemplate.update(connection -> {
            PreparedStatement ps = connection.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS);
            ps.setInt(1, match.getSessionId());
            ps.setInt(2, match.getFormatId());
            ps.setString(3, match.getMatchTypeStr() != null ? match.getMatchTypeStr() : "SINGLES");
            ps.setString(4, match.getTitle());
            ps.setString(5, match.getNotes());
            ps.setString(6, match.getStatusStr() != null ? match.getStatusStr() : "SCHEDULED");
            ps.setString(7, match.getWinnerSideStr());
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
        match.setMatchId(id);
        return id;
    }

    @Override
    public TrainingMatch getById(int matchId) {
        try {
            return jdbcTemplate.queryForObject(
                    "SELECT * FROM TrainingMatch WHERE matchId = ?",
                    rowMapper,
                    matchId
            );
        } catch (EmptyResultDataAccessException e) {
            return null;
        }
    }

    @Override
    public List<TrainingMatch> getBySession(int sessionId) {
        return jdbcTemplate.query(
                "SELECT * FROM TrainingMatch WHERE sessionId = ? ORDER BY createdAt DESC",
                rowMapper,
                sessionId
        );
    }

    @Override
    public List<TrainingMatch> getByStatus(TrainingMatch.Status status) {
        return jdbcTemplate.query(
                "SELECT * FROM TrainingMatch WHERE status = ? ORDER BY createdAt DESC",
                rowMapper,
                status.name()
        );
    }

    @Override
    public List<TrainingMatch> getBySessionAndType(int sessionId,
                                                   TrainingMatch.MatchType type) {
        return jdbcTemplate.query(
                "SELECT * FROM TrainingMatch WHERE sessionId = ? AND matchType = ?",
                rowMapper,
                sessionId,
                type.name()
        );
    }

    @Override
    public boolean update(TrainingMatch match) {
        final String sql = """
                UPDATE TrainingMatch
                SET formatId = ?, matchType = ?, title = ?, notes = ?,
                    status = ?, winnerSide = ?
                WHERE matchId = ?
                """;

        int rows = jdbcTemplate.update(
                sql,
                match.getFormatId(),
                match.getMatchTypeStr(),
                match.getTitle(),
                match.getNotes(),
                match.getStatusStr(),
                match.getWinnerSideStr(),
                match.getMatchId()
        );

        return rows == 1;
    }

    @Override
    public boolean delete(int matchId) {
        return jdbcTemplate.update(
                "DELETE FROM TrainingMatch WHERE matchId = ?",
                matchId
        ) == 1;
    }
}
