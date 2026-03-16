package com.Tennis_EMS.DAO.JDBC;

import com.Tennis_EMS.DAO.TrainingGroupMemberDAO;
import com.Tennis_EMS.Entity.TrainingGroupMember;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Repository;

import java.sql.Date;
import java.sql.Timestamp;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Repository
public class TrainingGroupMemberJDBC implements TrainingGroupMemberDAO {

    private final JdbcTemplate jdbcTemplate;

    public TrainingGroupMemberJDBC(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    private final RowMapper<TrainingGroupMember> rowMapper = (rs, rowNum) -> {
        Timestamp createdTs = rs.getTimestamp("createdAt");
        Timestamp updatedTs = rs.getTimestamp("updatedAt");

        LocalDateTime createdAt = createdTs == null ? null : createdTs.toLocalDateTime();
        LocalDateTime updatedAt = updatedTs == null ? null : updatedTs.toLocalDateTime();

        Date startSql = rs.getDate("startDate");
        Date endSql = rs.getDate("endDate");

        LocalDate startDate = startSql == null ? null : startSql.toLocalDate();
        LocalDate endDate = endSql == null ? null : endSql.toLocalDate();

        return new TrainingGroupMember(
                rs.getInt("groupId"),
                rs.getInt("studentId"),
                startDate,
                endDate,
                createdAt,
                updatedAt
        );
    };

    @Override
    public boolean insert(TrainingGroupMember member) {
        final String sql = """
                INSERT INTO TrainingGroupMember (groupId, studentId, startDate, endDate)
                VALUES (?, ?, ?, ?)
                """;

        int rows = jdbcTemplate.update(
                sql,
                member.getGroupId(),
                member.getStudentId(),
                member.getStartDate(),
                member.getEndDate()
        );

        return rows == 1;
    }

    @Override
    public boolean delete(int groupId, int studentId) {
        return jdbcTemplate.update(
                "DELETE FROM TrainingGroupMember WHERE groupId = ? AND studentId = ?",
                groupId,
                studentId
        ) == 1;
    }

    @Override
    public TrainingGroupMember get(int groupId, int studentId) {
        final String sql = """
                SELECT groupId, studentId, startDate, endDate, createdAt, updatedAt
                FROM TrainingGroupMember
                WHERE groupId = ? AND studentId = ?
                """;
        try {
            return jdbcTemplate.queryForObject(sql, rowMapper, groupId, studentId);
        } catch (EmptyResultDataAccessException e) {
            return null;
        }
    }

    @Override
    public List<TrainingGroupMember> getByGroup(int groupId) {
        final String sql = """
                SELECT groupId, studentId, startDate, endDate, createdAt, updatedAt
                FROM TrainingGroupMember
                WHERE groupId = ?
                ORDER BY startDate
                """;
        return jdbcTemplate.query(sql, rowMapper, groupId);
    }

    @Override
    public List<TrainingGroupMember> getByStudent(int studentId) {
        final String sql = """
                SELECT groupId, studentId, startDate, endDate, createdAt, updatedAt
                FROM TrainingGroupMember
                WHERE studentId = ?
                ORDER BY startDate
                """;
        return jdbcTemplate.query(sql, rowMapper, studentId);
    }

    @Override
    public List<TrainingGroupMember> getActiveByGroup(int groupId) {
        final String sql = """
                SELECT groupId, studentId, startDate, endDate, createdAt, updatedAt
                FROM TrainingGroupMember
                WHERE groupId = ? AND endDate IS NULL
                ORDER BY startDate
                """;
        return jdbcTemplate.query(sql, rowMapper, groupId);
    }

    @Override
    public boolean updateDates(int groupId, int studentId,
                               LocalDate startDate,
                               LocalDate endDate) {

        final String sql = """
                UPDATE TrainingGroupMember
                SET startDate = ?, endDate = ?
                WHERE groupId = ? AND studentId = ?
                """;

        int rows = jdbcTemplate.update(
                sql,
                startDate,
                endDate,
                groupId,
                studentId
        );

        return rows == 1;
    }
}
