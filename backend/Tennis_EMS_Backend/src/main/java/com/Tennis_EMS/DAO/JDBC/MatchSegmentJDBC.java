package com.Tennis_EMS.DAO.JDBC;

import com.Tennis_EMS.DAO.MatchSegmentDAO;
import com.Tennis_EMS.Entity.MatchSegment;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Repository;

import java.sql.Timestamp;
import java.time.LocalDateTime;
import java.util.List;

@Repository
public class MatchSegmentJDBC implements MatchSegmentDAO {

    private final JdbcTemplate jdbcTemplate;

    public MatchSegmentJDBC(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    private final RowMapper<MatchSegment> rowMapper = (rs, rowNum) -> {
        Timestamp createdTs = rs.getTimestamp("createdAt");
        Timestamp updatedTs = rs.getTimestamp("updatedAt");

        LocalDateTime createdAt = createdTs == null ? null : createdTs.toLocalDateTime();
        LocalDateTime updatedAt = updatedTs == null ? null : updatedTs.toLocalDateTime();

        MatchSegment s = new MatchSegment(
                rs.getInt("matchId"),
                rs.getInt("segmentNo"),
                null,
                rs.getInt("sideAScore"),
                rs.getInt("sideBScore"),
                createdAt,
                updatedAt
        );

        s.setSegmentTypeFromString(rs.getString("segmentType"));
        return s;
    };

    @Override
    public boolean insert(MatchSegment segment) {
        final String sql = """
                INSERT INTO MatchSegment
                (matchId, segmentNo, segmentType, sideAScore, sideBScore)
                VALUES (?, ?, ?, ?, ?)
                """;

        int rows = jdbcTemplate.update(
                sql,
                segment.getMatchId(),
                segment.getSegmentNo(),
                segment.getSegmentTypeStr() != null ? segment.getSegmentTypeStr() : "SET",
                segment.getSideAScore(),
                segment.getSideBScore()
        );

        return rows == 1;
    }

    @Override
    public boolean update(MatchSegment segment) {
        final String sql = """
                UPDATE MatchSegment
                SET segmentType = ?, sideAScore = ?, sideBScore = ?
                WHERE matchId = ? AND segmentNo = ?
                """;

        int rows = jdbcTemplate.update(
                sql,
                segment.getSegmentTypeStr(),
                segment.getSideAScore(),
                segment.getSideBScore(),
                segment.getMatchId(),
                segment.getSegmentNo()
        );

        return rows == 1;
    }

    @Override
    public boolean delete(int matchId, int segmentNo) {
        return jdbcTemplate.update(
                "DELETE FROM MatchSegment WHERE matchId = ? AND segmentNo = ?",
                matchId,
                segmentNo
        ) == 1;
    }

    @Override
    public boolean deleteByMatch(int matchId) {
        return jdbcTemplate.update(
                "DELETE FROM MatchSegment WHERE matchId = ?",
                matchId
        ) > 0;
    }

    @Override
    public MatchSegment get(int matchId, int segmentNo) {
        try {
            return jdbcTemplate.queryForObject(
                    """
                    SELECT * FROM MatchSegment
                    WHERE matchId = ? AND segmentNo = ?
                    """,
                    rowMapper,
                    matchId,
                    segmentNo
            );
        } catch (EmptyResultDataAccessException e) {
            return null;
        }
    }

    @Override
    public List<MatchSegment> getByMatch(int matchId) {
        return jdbcTemplate.query(
                """
                SELECT * FROM MatchSegment
                WHERE matchId = ?
                ORDER BY segmentNo
                """,
                rowMapper,
                matchId
        );
    }
}
