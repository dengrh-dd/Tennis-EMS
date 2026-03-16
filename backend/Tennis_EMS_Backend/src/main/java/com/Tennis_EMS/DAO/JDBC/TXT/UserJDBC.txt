package com.Tennis_EMS.DAO.JDBC;

import com.Tennis_EMS.DAO.UserDAO;
import com.Tennis_EMS.Entity.User;
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
public class UserJDBC implements UserDAO {

    private final JdbcTemplate jdbcTemplate;

    public UserJDBC(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    private final RowMapper<User> rowMapper = (rs, rowNum) -> {
        Timestamp createdTs = rs.getTimestamp("createdAt");
        Timestamp updatedTs = rs.getTimestamp("updatedAt");

        LocalDateTime createdAt = createdTs == null ? null : createdTs.toLocalDateTime();
        LocalDateTime updatedAt = updatedTs == null ? null : updatedTs.toLocalDateTime();

        String roleStr = rs.getString("role");
        User.Role role = User.Role.parse(roleStr);

        return new User(
                rs.getInt("userId"),
                rs.getString("email"),
                rs.getString("passwordHash"),
                role,
                rs.getBoolean("isActive"),
                createdAt,
                updatedAt
        );
    };

    @Override
    public int insert(User user) {
        if (user == null) {
            throw new IllegalArgumentException("User cannot be null.");
        }
        if (user.getEmail() == null || user.getEmail().trim().isEmpty()) {
            throw new IllegalArgumentException("User email cannot be null or empty.");
        }
        if (user.getPasswordHash() == null || user.getPasswordHash().trim().isEmpty()) {
            throw new IllegalArgumentException("User passwordHash cannot be null or empty.");
        }
        if (user.getRole() == null) {
            throw new IllegalArgumentException("User role cannot be null.");
        }

        final String sql = """
                INSERT INTO Users (`email`, `passwordHash`, `role`, `isActive`)
                VALUES (?, ?, ?, ?)
                """;

        KeyHolder keyHolder = new GeneratedKeyHolder();

        int rows = jdbcTemplate.update(connection -> {
            PreparedStatement ps = connection.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS);
            ps.setString(1, user.getEmail());
            ps.setString(2, user.getPasswordHash());
            ps.setString(3, user.getRoleStr());
            ps.setBoolean(4, user.getIsActive() != null ? user.getIsActive() : true);
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
        user.setUserId(generatedId);
        return generatedId;
    }

    @Override
    public List<User> getAll() {
        final String sql = """
                SELECT userId, email, passwordHash, role, isActive, createdAt, updatedAt
                FROM Users
                ORDER BY userId
                """;
        return jdbcTemplate.query(sql, rowMapper);
    }

    @Override
    public User getById(int id) {
        final String sql = """
                SELECT userId, email, passwordHash, role, isActive, createdAt, updatedAt
                FROM Users
                WHERE userId = ?
                """;
        try {
            return jdbcTemplate.queryForObject(sql, rowMapper, id);
        } catch (EmptyResultDataAccessException e) {
            return null;
        }
    }

    @Override
    public User getByEmail(String email) {
        final String sql = """
                SELECT userId, email, passwordHash, role, isActive, createdAt, updatedAt
                FROM Users
                WHERE email = ?
                """;
        try {
            return jdbcTemplate.queryForObject(sql, rowMapper, email);
        } catch (EmptyResultDataAccessException e) {
            return null;
        }
    }

    @Override
    public boolean update(User user) {
        if (user == null) {
            throw new IllegalArgumentException("User cannot be null.");
        }
        if (user.getUserId() == null) {
            throw new IllegalArgumentException("User userId cannot be null.");
        }
        if (user.getEmail() == null || user.getEmail().trim().isEmpty()) {
            throw new IllegalArgumentException("User email cannot be null or empty.");
        }
        if (user.getPasswordHash() == null || user.getPasswordHash().trim().isEmpty()) {
            throw new IllegalArgumentException("User passwordHash cannot be null or empty.");
        }
        if (user.getRole() == null) {
            throw new IllegalArgumentException("User role cannot be null.");
        }

        final String sql = """
                UPDATE Users
                SET email = ?, passwordHash = ?, role = ?, isActive = ?
                WHERE userId = ?
                """;

        int rows = jdbcTemplate.update(
                sql,
                user.getEmail(),
                user.getPasswordHash(),
                user.getRoleStr(),
                user.getIsActive() != null ? user.getIsActive() : true,
                user.getUserId()
        );

        return rows == 1;
    }

    @Override
    public boolean delete(int id) {
        return jdbcTemplate.update(
                "DELETE FROM Users WHERE userId = ?",
                id
        ) == 1;
    }
}

