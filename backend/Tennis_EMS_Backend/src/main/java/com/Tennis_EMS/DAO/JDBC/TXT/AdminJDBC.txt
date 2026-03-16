package com.Tennis_EMS.DAO.JDBC;

import com.Tennis_EMS.DAO.AdminDAO;
import com.Tennis_EMS.Entity.Admin;
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
public class AdminJDBC implements AdminDAO {

    private final JdbcTemplate jdbcTemplate;

    public AdminJDBC(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    private final RowMapper<Admin> rowMapper = (rs, rowNum) -> {

        Timestamp createdTs = rs.getTimestamp("createdAt");
        Timestamp updatedTs = rs.getTimestamp("updatedAt");

        LocalDateTime createdAt = createdTs == null ? null : createdTs.toLocalDateTime();
        LocalDateTime updatedAt = updatedTs == null ? null : updatedTs.toLocalDateTime();

        return new Admin(
                rs.getInt("adminId"),
                rs.getInt("userId"),
                rs.getString("firstName"),
                rs.getString("lastName"),
                rs.getString("phone"),
                rs.getString("adminLevel"),
                createdAt,
                updatedAt
        );
    };

    @Override
    public int insert(Admin admin) {

        final String sql = """
                INSERT INTO Admin
                (userId, firstName, lastName, phone, adminLevel)
                VALUES (?, ?, ?, ?, ?)
                """;

        KeyHolder keyHolder = new GeneratedKeyHolder();

        int rows = jdbcTemplate.update(connection -> {
            PreparedStatement ps = connection.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS);

            ps.setInt(1, admin.getUserId());
            ps.setString(2, admin.getFirstName());
            ps.setString(3, admin.getLastName());
            ps.setString(4, admin.getPhone());
            ps.setString(5, admin.getAdminLevelStr());

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
        admin.setAdminId(generatedId);

        return generatedId;
    }

    @Override
    public List<Admin> getAll() {

        final String sql = """
                SELECT adminId, userId, firstName, lastName, phone,
                       adminLevel, createdAt, updatedAt
                FROM Admin
                ORDER BY adminId
                """;

        return jdbcTemplate.query(sql, rowMapper);
    }

    @Override
    public Admin getById(int id) {

        final String sql = """
                SELECT adminId, userId, firstName, lastName, phone,
                       adminLevel, createdAt, updatedAt
                FROM Admin
                WHERE adminId = ?
                """;

        try {
            return jdbcTemplate.queryForObject(sql, rowMapper, id);
        } catch (EmptyResultDataAccessException e) {
            return null;
        }
    }

    @Override
    public Admin getByUserId(int userId) {

        final String sql = """
                SELECT adminId, userId, firstName, lastName, phone,
                       adminLevel, createdAt, updatedAt
                FROM Admin
                WHERE userId = ?
                """;

        try {
            return jdbcTemplate.queryForObject(sql, rowMapper, userId);
        } catch (EmptyResultDataAccessException e) {
            return null;
        }
    }

    @Override
    public boolean update(Admin admin) {

        final String sql = """
                UPDATE Admin
                SET userId = ?, firstName = ?, lastName = ?, phone = ?, adminLevel = ?
                WHERE adminId = ?
                """;

        int rows = jdbcTemplate.update(
                sql,
                admin.getUserId(),
                admin.getFirstName(),
                admin.getLastName(),
                admin.getPhone(),
                admin.getAdminLevelStr(),
                admin.getAdminId()
        );

        return rows == 1;
    }

    @Override
    public boolean delete(int id) {

        return jdbcTemplate.update(
                "DELETE FROM Admin WHERE adminId = ?",
                id
        ) == 1;
    }
}
