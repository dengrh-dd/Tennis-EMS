package com.Tennis_EMS.DAO.JDBC;

import com.Tennis_EMS.DAO.EnrollmentDAO;
import com.Tennis_EMS.Entity.Enrollment;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Repository;

import java.sql.Timestamp;
import java.time.LocalDateTime;
import java.util.List;

@Repository
public class EnrollmentJDBC implements EnrollmentDAO {

    private final JdbcTemplate jdbcTemplate;

    public EnrollmentJDBC(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    private final RowMapper<Enrollment> rowMapper = (rs, rowNum) -> {

        Timestamp createdTs = rs.getTimestamp("createdAt");
        LocalDateTime createdAt =
                createdTs == null ? null : createdTs.toLocalDateTime();

        return new Enrollment(
                rs.getInt("studentId"),
                rs.getInt("sectionId"),
                rs.getString("status"),
                createdAt
        );
    };

    @Override
    public boolean insert(Enrollment enrollment) {

        final String sql = """
                INSERT INTO Enrollment
                (studentId, sectionId, status)
                VALUES (?, ?, ?)
                """;

        int rows = jdbcTemplate.update(
                sql,
                enrollment.getStudentId(),
                enrollment.getSectionId(),
                enrollment.getStatusStr() == null ?
                        "ENROLLED" :
                        enrollment.getStatusStr()
        );

        return rows == 1;
    }

    @Override
    public Enrollment get(int studentId, int sectionId) {

        final String sql = """
                SELECT studentId, sectionId,
                       status, createdAt
                FROM Enrollment
                WHERE studentId = ? AND sectionId = ?
                """;

        try {
            return jdbcTemplate.queryForObject(
                    sql, rowMapper, studentId, sectionId);
        } catch (EmptyResultDataAccessException e) {
            return null;
        }
    }

    @Override
    public List<Enrollment> getByStudentId(int studentId) {

        final String sql = """
                SELECT * FROM Enrollment
                WHERE studentId = ?
                """;

        return jdbcTemplate.query(sql, rowMapper, studentId);
    }

    @Override
    public List<Enrollment> getBySectionId(int sectionId) {

        final String sql = """
                SELECT * FROM Enrollment
                WHERE sectionId = ?
                """;

        return jdbcTemplate.query(sql, rowMapper, sectionId);
    }

    @Override
    public boolean updateStatus(int studentId,
                                int sectionId,
                                String status) {

        final String sql = """
                UPDATE Enrollment
                SET status = ?
                WHERE studentId = ? AND sectionId = ?
                """;

        int rows = jdbcTemplate.update(
                sql,
                status,
                studentId,
                sectionId
        );

        return rows == 1;
    }

    @Override
    public boolean delete(int studentId, int sectionId) {

        final String sql = """
                DELETE FROM Enrollment
                WHERE studentId = ? AND sectionId = ?
                """;

        return jdbcTemplate.update(sql, studentId, sectionId) == 1;
    }
}
