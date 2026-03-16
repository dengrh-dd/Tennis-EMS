package com.Tennis_EMS.DAO.JDBC;

import com.Tennis_EMS.DAO.CourseDAO;
import com.Tennis_EMS.Entity.Course;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.jdbc.support.GeneratedKeyHolder;
import org.springframework.jdbc.support.KeyHolder;
import org.springframework.stereotype.Repository;

import java.sql.PreparedStatement;
import java.sql.Statement;
import java.util.List;

@Repository
public class CourseJDBC implements CourseDAO {

    private final JdbcTemplate jdbcTemplate;

    public CourseJDBC(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    private final RowMapper<Course> rowMapper = (rs, rowNum) ->
            new Course(
                    rs.getInt("courseId"),
                    rs.getString("name"),
                    rs.getString("courseNumber"),
                    rs.getString("description"),
                    rs.getString("level"),
                    rs.getBoolean("isActive")
            );

    @Override
    public int insert(Course course) {

        final String sql = """
                INSERT INTO Course
                (name, courseNumber, description, level, isActive)
                VALUES (?, ?, ?, ?, ?)
                """;

        KeyHolder keyHolder = new GeneratedKeyHolder();

        int rows = jdbcTemplate.update(connection -> {
            PreparedStatement ps =
                    connection.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS);

            ps.setString(1, course.getName());
            ps.setString(2, course.getCourseNumber());
            ps.setString(3, course.getDescription());

            ps.setString(4,
                    course.getLevelStr() == null ? "BEGINNER" : course.getLevelStr());

            ps.setBoolean(5,
                    course.getIsActive() == null || course.getIsActive());

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
        course.setCourseId(generatedId);

        return generatedId;
    }

    @Override
    public List<Course> getAll() {

        final String sql = """
                SELECT courseId, name, courseNumber,
                       description, level, isActive
                FROM Course
                ORDER BY courseId
                """;

        return jdbcTemplate.query(sql, rowMapper);
    }

    @Override
    public Course getById(int id) {

        final String sql = """
                SELECT courseId, name, courseNumber,
                       description, level, isActive
                FROM Course
                WHERE courseId = ?
                """;

        try {
            return jdbcTemplate.queryForObject(sql, rowMapper, id);
        } catch (EmptyResultDataAccessException e) {
            return null;
        }
    }

    @Override
    public Course getByCourseNumber(String courseNumber) {

        final String sql = """
                SELECT courseId, name, courseNumber,
                       description, level, isActive
                FROM Course
                WHERE courseNumber = ?
                """;

        try {
            return jdbcTemplate.queryForObject(sql, rowMapper, courseNumber);
        } catch (EmptyResultDataAccessException e) {
            return null;
        }
    }

    @Override
    public boolean update(Course course) {

        final String sql = """
                UPDATE Course
                SET name = ?, courseNumber = ?, description = ?,
                    level = ?, isActive = ?
                WHERE courseId = ?
                """;

        int rows = jdbcTemplate.update(
                sql,
                course.getName(),
                course.getCourseNumber(),
                course.getDescription(),
                course.getLevelStr(),
                course.getIsActive(),
                course.getCourseId()
        );

        return rows == 1;
    }

    @Override
    public boolean delete(int id) {

        return jdbcTemplate.update(
                "DELETE FROM Course WHERE courseId = ?",
                id
        ) == 1;
    }
}


