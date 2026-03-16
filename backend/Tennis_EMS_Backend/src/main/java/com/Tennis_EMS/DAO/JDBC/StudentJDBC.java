package com.Tennis_EMS.DAO.JDBC;

import com.Tennis_EMS.DAO.StudentDAO;
import com.Tennis_EMS.Entity.Student;
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
public class StudentJDBC implements StudentDAO {

    private final JdbcTemplate jdbcTemplate;

    public StudentJDBC(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    private final RowMapper<Student> rowMapper = (rs, rowNum) -> {

        Date dobSql = rs.getDate("dateOfBirth");
        LocalDate dob = dobSql == null ? null : dobSql.toLocalDate();

        Timestamp createdTs = rs.getTimestamp("createdAt");
        Timestamp updatedTs = rs.getTimestamp("updatedAt");

        LocalDateTime createdAt = createdTs == null ? null : createdTs.toLocalDateTime();
        LocalDateTime updatedAt = updatedTs == null ? null : updatedTs.toLocalDateTime();

        return new Student(
                rs.getInt("studentId"),
                rs.getInt("userId"),
                rs.getString("firstName"),
                rs.getString("lastName"),
                rs.getString("preferredName"),
                rs.getString("phone"),
                dob,
                rs.getString("skillLevel"),
                rs.getString("notes"),
                rs.getString("emergencyContactName"),
                rs.getString("emergencyContactPhone"),
                createdAt,
                updatedAt
        );
    };

    @Override
    public int insert(Student student) {

        final String sql = """
                INSERT INTO Student
                (userId, firstName, lastName, preferredName, phone,
                 dateOfBirth, skillLevel, notes,
                 emergencyContactName, emergencyContactPhone)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                """;

        KeyHolder keyHolder = new GeneratedKeyHolder();

        int rows = jdbcTemplate.update(connection -> {
            PreparedStatement ps = connection.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS);

            ps.setInt(1, student.getUserId());
            ps.setString(2, student.getFirstName());
            ps.setString(3, student.getLastName());
            ps.setString(4, student.getPreferredName());
            ps.setString(5, student.getPhone());

            if (student.getDateOfBirth() != null) {
                ps.setDate(6, Date.valueOf(student.getDateOfBirth()));
            } else {
                ps.setNull(6, java.sql.Types.DATE);
            }

            ps.setString(7, student.getSkillLevelStr());
            ps.setString(8, student.getNotes());
            ps.setString(9, student.getEmergencyContactName());
            ps.setString(10, student.getEmergencyContactPhone());

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
        student.setStudentId(generatedId);

        return generatedId;
    }

    @Override
    public List<Student> getAll() {

        final String sql = """
                SELECT studentId, userId, firstName, lastName,
                       preferredName, phone, dateOfBirth,
                       skillLevel, notes,
                       emergencyContactName, emergencyContactPhone,
                       createdAt, updatedAt
                FROM Student
                ORDER BY studentId
                """;

        return jdbcTemplate.query(sql, rowMapper);
    }

    @Override
    public Student getById(int id) {

        final String sql = """
                SELECT studentId, userId, firstName, lastName,
                       preferredName, phone, dateOfBirth,
                       skillLevel, notes,
                       emergencyContactName, emergencyContactPhone,
                       createdAt, updatedAt
                FROM Student
                WHERE studentId = ?
                """;

        try {
            return jdbcTemplate.queryForObject(sql, rowMapper, id);
        } catch (EmptyResultDataAccessException e) {
            return null;
        }
    }

    @Override
    public Student getByUserId(int userId) {

        final String sql = """
                SELECT studentId, userId, firstName, lastName,
                       preferredName, phone, dateOfBirth,
                       skillLevel, notes,
                       emergencyContactName, emergencyContactPhone,
                       createdAt, updatedAt
                FROM Student
                WHERE userId = ?
                """;

        try {
            return jdbcTemplate.queryForObject(sql, rowMapper, userId);
        } catch (EmptyResultDataAccessException e) {
            return null;
        }
    }

    @Override
    public boolean update(Student student) {

        final String sql = """
                UPDATE Student
                SET userId = ?, firstName = ?, lastName = ?, preferredName = ?, phone = ?,
                    dateOfBirth = ?, skillLevel = ?, notes = ?,
                    emergencyContactName = ?, emergencyContactPhone = ?
                WHERE studentId = ?
                """;

        int rows = jdbcTemplate.update(
                sql,
                student.getUserId(),
                student.getFirstName(),
                student.getLastName(),
                student.getPreferredName(),
                student.getPhone(),
                student.getDateOfBirth() == null ? null : Date.valueOf(student.getDateOfBirth()),
                student.getSkillLevelStr(),
                student.getNotes(),
                student.getEmergencyContactName(),
                student.getEmergencyContactPhone(),
                student.getStudentId()
        );

        return rows == 1;
    }

    @Override
    public boolean delete(int id) {

        return jdbcTemplate.update(
                "DELETE FROM Student WHERE studentId = ?",
                id
        ) == 1;
    }
}

