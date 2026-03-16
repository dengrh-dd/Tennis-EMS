package com.Tennis_EMS.DAO.JDBC;

import com.Tennis_EMS.DAO.CoachDAO;
import com.Tennis_EMS.Entity.Coach;
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
public class CoachJDBC implements CoachDAO {

    private final JdbcTemplate jdbcTemplate;

    public CoachJDBC(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    private final RowMapper<Coach> rowMapper = (rs, rowNum) -> {

        Date dobSql = rs.getDate("dateOfBirth");
        LocalDate dob = dobSql == null ? null : dobSql.toLocalDate();

        Timestamp createdTs = rs.getTimestamp("createdAt");
        Timestamp updatedTs = rs.getTimestamp("updatedAt");

        LocalDateTime createdAt = createdTs == null ? null : createdTs.toLocalDateTime();
        LocalDateTime updatedAt = updatedTs == null ? null : updatedTs.toLocalDateTime();

        return new Coach(
                rs.getInt("coachId"),
                rs.getInt("userId"),
                rs.getString("firstName"),
                rs.getString("lastName"),
                rs.getString("phone"),
                dob,
                rs.getString("certification"),
                rs.getObject("experienceYears", Integer.class),  // nullable int
                rs.getString("bio"),
                createdAt,
                updatedAt
        );
    };

    @Override
    public int insert(Coach coach) {

        final String sql = """
                INSERT INTO Coach
                (userId, firstName, lastName, phone, dateOfBirth,
                 certification, experienceYears, bio)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?)
                """;

        KeyHolder keyHolder = new GeneratedKeyHolder();

        int rows = jdbcTemplate.update(connection -> {
            PreparedStatement ps = connection.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS);

            ps.setInt(1, coach.getUserId());
            ps.setString(2, coach.getFirstName());
            ps.setString(3, coach.getLastName());
            ps.setString(4, coach.getPhone());

            if (coach.getDateOfBirth() != null) {
                ps.setDate(5, Date.valueOf(coach.getDateOfBirth()));
            } else {
                ps.setNull(5, java.sql.Types.DATE);
            }

            ps.setString(6, coach.getCertification());
            ps.setObject(7, coach.getExperienceYears());
            ps.setString(8, coach.getBio());

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
        coach.setCoachId(generatedId);

        return generatedId;
    }

    @Override
    public List<Coach> getAll() {

        final String sql = """
                SELECT coachId, userId, firstName, lastName, phone,
                       dateOfBirth, certification, experienceYears, bio,
                       createdAt, updatedAt
                FROM Coach
                ORDER BY coachId
                """;

        return jdbcTemplate.query(sql, rowMapper);
    }

    @Override
    public Coach getById(int id) {

        final String sql = """
                SELECT coachId, userId, firstName, lastName, phone,
                       dateOfBirth, certification, experienceYears, bio,
                       createdAt, updatedAt
                FROM Coach
                WHERE coachId = ?
                """;

        try {
            return jdbcTemplate.queryForObject(sql, rowMapper, id);
        } catch (EmptyResultDataAccessException e) {
            return null;
        }
    }

    @Override
    public Coach getByUserId(int userId) {

        final String sql = """
                SELECT coachId, userId, firstName, lastName, phone,
                       dateOfBirth, certification, experienceYears, bio,
                       createdAt, updatedAt
                FROM Coach
                WHERE userId = ?
                """;

        try {
            return jdbcTemplate.queryForObject(sql, rowMapper, userId);
        } catch (EmptyResultDataAccessException e) {
            return null;
        }
    }

    @Override
    public boolean update(Coach coach) {

        final String sql = """
                UPDATE Coach
                SET userId = ?, firstName = ?, lastName = ?, phone = ?,
                    dateOfBirth = ?, certification = ?, experienceYears = ?, bio = ?
                WHERE coachId = ?
                """;

        int rows = jdbcTemplate.update(
                sql,
                coach.getUserId(),
                coach.getFirstName(),
                coach.getLastName(),
                coach.getPhone(),
                coach.getDateOfBirth() == null ? null : Date.valueOf(coach.getDateOfBirth()),
                coach.getCertification(),
                coach.getExperienceYears(),
                coach.getBio(),
                coach.getCoachId()
        );

        return rows == 1;
    }

    @Override
    public boolean delete(int id) {

        return jdbcTemplate.update(
                "DELETE FROM Coach WHERE coachId = ?",
                id
        ) == 1;
    }
}
