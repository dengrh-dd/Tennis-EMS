package com.Tennis_EMS.DAO.JDBC;

import com.Tennis_EMS.DAO.MatchSidePlayerDAO;
import com.Tennis_EMS.Entity.MatchSidePlayer;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public class MatchSidePlayerJDBC implements MatchSidePlayerDAO {

    private final JdbcTemplate jdbcTemplate;

    public MatchSidePlayerJDBC(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    private final RowMapper<MatchSidePlayer> rowMapper = (rs, rowNum) -> {
        MatchSidePlayer p = new MatchSidePlayer(
                rs.getInt("matchId"),
                null,
                rs.getInt("position"),
                rs.getInt("studentId")
        );

        p.setSideFromString(rs.getString("side"));
        return p;
    };

    @Override
    public boolean insert(MatchSidePlayer player) {
        final String sql = """
                INSERT INTO MatchSidePlayer
                (matchId, side, position, studentId)
                VALUES (?, ?, ?, ?)
                """;

        int rows = jdbcTemplate.update(
                sql,
                player.getMatchId(),
                player.getSideStr(),
                player.getPosition(),
                player.getStudentId()
        );

        return rows == 1;
    }

    @Override
    public boolean delete(int matchId,
                          MatchSidePlayer.Side side,
                          int position) {
        return jdbcTemplate.update(
                "DELETE FROM MatchSidePlayer WHERE matchId = ? AND side = ? AND position = ?",
                matchId,
                side.name(),
                position
        ) == 1;
    }

    @Override
    public boolean deleteByMatch(int matchId) {
        return jdbcTemplate.update(
                "DELETE FROM MatchSidePlayer WHERE matchId = ?",
                matchId
        ) > 0;
    }

    @Override
    public MatchSidePlayer get(int matchId,
                               MatchSidePlayer.Side side,
                               int position) {
        try {
            return jdbcTemplate.queryForObject(
                    """
                    SELECT * FROM MatchSidePlayer
                    WHERE matchId = ? AND side = ? AND position = ?
                    """,
                    rowMapper,
                    matchId,
                    side.name(),
                    position
            );
        } catch (EmptyResultDataAccessException e) {
            return null;
        }
    }

    @Override
    public List<MatchSidePlayer> getByMatch(int matchId) {
        return jdbcTemplate.query(
                """
                SELECT * FROM MatchSidePlayer
                WHERE matchId = ?
                ORDER BY side, position
                """,
                rowMapper,
                matchId
        );
    }

    @Override
    public List<MatchSidePlayer> getByStudent(int studentId) {
        return jdbcTemplate.query(
                """
                SELECT * FROM MatchSidePlayer
                WHERE studentId = ?
                ORDER BY matchId
                """,
                rowMapper,
                studentId
        );
    }
}
