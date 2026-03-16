package com.Tennis_EMS.DAO.JDBC;

import com.Tennis_EMS.DAO.MatchSummaryDAO;
import com.Tennis_EMS.Entity.MatchSummary;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Repository;

import java.sql.Timestamp;
import java.time.LocalDateTime;

@Repository
public class MatchSummaryJDBC implements MatchSummaryDAO {

    private final JdbcTemplate jdbcTemplate;

    public MatchSummaryJDBC(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    private final RowMapper<MatchSummary> rowMapper = (rs, rowNum) -> {
        Timestamp createdTs = rs.getTimestamp("createdAt");
        Timestamp updatedTs = rs.getTimestamp("updatedAt");

        LocalDateTime createdAt = createdTs == null ? null : createdTs.toLocalDateTime();
        LocalDateTime updatedAt = updatedTs == null ? null : updatedTs.toLocalDateTime();

        return new MatchSummary(
                rs.getInt("matchId"),
                rs.getString("finalScoreText"),
                rs.getObject("sideAScore", Integer.class),
                rs.getObject("sideBScore", Integer.class),
                createdAt,
                updatedAt
        );
    };

    @Override
    public boolean insert(MatchSummary summary) {
        final String sql = """
                INSERT INTO MatchSummary
                (matchId, finalScoreText, sideAScore, sideBScore)
                VALUES (?, ?, ?, ?)
                """;

        int rows = jdbcTemplate.update(
                sql,
                summary.getMatchId(),
                summary.getFinalScoreText(),
                summary.getSideAScore(),
                summary.getSideBScore()
        );

        return rows == 1;
    }

    @Override
    public MatchSummary getByMatchId(int matchId) {
        try {
            return jdbcTemplate.queryForObject(
                    "SELECT * FROM MatchSummary WHERE matchId = ?",
                    rowMapper,
                    matchId
            );
        } catch (EmptyResultDataAccessException e) {
            return null;
        }
    }

    @Override
    public boolean update(MatchSummary summary) {
        final String sql = """
                UPDATE MatchSummary
                SET finalScoreText = ?, sideAScore = ?, sideBScore = ?
                WHERE matchId = ?
                """;

        int rows = jdbcTemplate.update(
                sql,
                summary.getFinalScoreText(),
                summary.getSideAScore(),
                summary.getSideBScore(),
                summary.getMatchId()
        );

        return rows == 1;
    }

    @Override
    public boolean delete(int matchId) {
        return jdbcTemplate.update(
                "DELETE FROM MatchSummary WHERE matchId = ?",
                matchId
        ) == 1;
    }
}
