package com.Tennis_EMS.DAO.JDBC;

import com.Tennis_EMS.DAO.SectionDAO;
import com.Tennis_EMS.Entity.Section;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.jdbc.support.GeneratedKeyHolder;
import org.springframework.jdbc.support.KeyHolder;
import org.springframework.stereotype.Repository;

import java.sql.Date;
import java.sql.PreparedStatement;
import java.sql.Statement;
import java.sql.Timestamp;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Repository
public class SectionJDBC implements SectionDAO {

    private final JdbcTemplate jdbcTemplate;

    public SectionJDBC(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    private final RowMapper<Section> rowMapper = (rs, rowNum) -> {

        Date startSql = rs.getDate("startDate");
        Date endSql = rs.getDate("endDate");

        LocalDate startDate = startSql == null ? null : startSql.toLocalDate();
        LocalDate endDate = endSql == null ? null : endSql.toLocalDate();

        Timestamp createdTs = rs.getTimestamp("createdAt");
        Timestamp updatedTs = rs.getTimestamp("updatedAt");

        LocalDateTime createdAt =
                createdTs == null ? null : createdTs.toLocalDateTime();
        LocalDateTime updatedAt =
                updatedTs == null ? null : updatedTs.toLocalDateTime();

        return new Section(
                rs.getInt("sectionId"),
                rs.getInt("courseId"),
                rs.getInt("coachId"),
                rs.getString("name"),
                rs.getString("syllabus"),
                startDate,
                endDate,
                rs.getObject("maxStudents", Integer.class),
                rs.getString("enrollmentMode"),
                rs.getString("status"),
                createdAt,
                updatedAt
        );
    };

    @Override
    public int insert(Section section) {

        final String sql = """
                INSERT INTO Section
                (courseId, coachId, name, syllabus,
                 startDate, endDate, maxStudents,
                 enrollmentMode, status)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
                """;

        KeyHolder keyHolder = new GeneratedKeyHolder();

        int rows = jdbcTemplate.update(connection -> {
            PreparedStatement ps =
                    connection.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS);

            ps.setInt(1, section.getCourseId());
            ps.setInt(2, section.getCoachId());
            ps.setString(3, section.getName());
            ps.setString(4, section.getSyllabus());

            ps.setObject(5,
                    section.getStartDate() == null ? null :
                            Date.valueOf(section.getStartDate()));

            ps.setObject(6,
                    section.getEndDate() == null ? null :
                            Date.valueOf(section.getEndDate()));

            ps.setObject(7, section.getMaxStudents());

            ps.setString(8,
                    section.getEnrollmentModeStr() == null ?
                            "DROP_IN" :
                            section.getEnrollmentModeStr());

            ps.setString(9,
                    section.getStatusStr() == null ?
                            "PLANNED" :
                            section.getStatusStr());

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
        section.setSectionId(generatedId);

        return generatedId;
    }

    @Override
    public List<Section> getAll() {

        final String sql = """
                SELECT sectionId, courseId, coachId,
                       name, syllabus, startDate, endDate,
                       maxStudents, enrollmentMode, status,
                       createdAt, updatedAt
                FROM Section
                ORDER BY sectionId
                """;

        return jdbcTemplate.query(sql, rowMapper);
    }

    @Override
    public Section getById(int id) {

        final String sql = """
                SELECT sectionId, courseId, coachId,
                       name, syllabus, startDate, endDate,
                       maxStudents, enrollmentMode, status,
                       createdAt, updatedAt
                FROM Section
                WHERE sectionId = ?
                """;

        try {
            return jdbcTemplate.queryForObject(sql, rowMapper, id);
        } catch (EmptyResultDataAccessException e) {
            return null;
        }
    }

    @Override
    public List<Section> getByCourseId(int courseId) {

        final String sql = """
                SELECT * FROM Section WHERE courseId = ?
                """;

        return jdbcTemplate.query(sql, rowMapper, courseId);
    }

    @Override
    public List<Section> getByCoachId(int coachId) {

        final String sql = """
                SELECT * FROM Section WHERE coachId = ?
                """;

        return jdbcTemplate.query(sql, rowMapper, coachId);
    }

    @Override
    public Section getByCourseIdAndCoachIdAndName(int courseId, int coachId, String name) {

        if (name == null || name.trim().isEmpty()) {
            throw new IllegalArgumentException("Section name cannot be empty.");
        }

        final String sql = """
            SELECT sectionId, courseId, coachId,
                   name, syllabus, startDate, endDate,
                   maxStudents, enrollmentMode, status,
                   createdAt, updatedAt
            FROM Section
            WHERE courseId = ? AND coachId = ? AND name = ?
            """;

        try {
            return jdbcTemplate.queryForObject(sql, rowMapper, courseId, coachId, name);
        } catch (EmptyResultDataAccessException e) {
            return null;
        }
    }

    @Override
    public boolean update(Section section) {

        final String sql = """
                UPDATE Section
                SET courseId = ?, coachId = ?, name = ?, syllabus = ?,
                    startDate = ?, endDate = ?, maxStudents = ?,
                    enrollmentMode = ?, status = ?
                WHERE sectionId = ?
                """;

        int rows = jdbcTemplate.update(
                sql,
                section.getCourseId(),
                section.getCoachId(),
                section.getName(),
                section.getSyllabus(),
                section.getStartDate() == null ? null :
                        Date.valueOf(section.getStartDate()),
                section.getEndDate() == null ? null :
                        Date.valueOf(section.getEndDate()),
                section.getMaxStudents(),
                section.getEnrollmentModeStr(),
                section.getStatusStr(),
                section.getSectionId()
        );

        return rows == 1;
    }

    @Override
    public boolean delete(int id) {

        return jdbcTemplate.update(
                "DELETE FROM Section WHERE sectionId = ?",
                id
        ) == 1;
    }
}

