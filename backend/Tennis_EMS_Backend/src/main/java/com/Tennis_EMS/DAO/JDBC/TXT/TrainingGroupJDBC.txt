package com.Tennis_EMS.DAO.JDBC;

import com.Tennis_EMS.DAO.TrainingGroupDAO;
import com.Tennis_EMS.Entity.TrainingGroup;
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
public class TrainingGroupJDBC implements TrainingGroupDAO {

    private final JdbcTemplate jdbcTemplate;

    public TrainingGroupJDBC(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    private final RowMapper<TrainingGroup> rowMapper = (rs, rowNum) -> {
        Timestamp createdTs = rs.getTimestamp("createdAt");
        Timestamp updatedTs = rs.getTimestamp("updatedAt");

        LocalDateTime createdAt = createdTs == null ? null : createdTs.toLocalDateTime();
        LocalDateTime updatedAt = updatedTs == null ? null : updatedTs.toLocalDateTime();

        TrainingGroup g = new TrainingGroup(
                rs.getInt("groupId"),
                rs.getString("name"),
                null,
                rs.getString("description"),
                rs.getBoolean("isActive"),
                createdAt,
                updatedAt
        );

        g.setGroupTypeFromString(rs.getString("groupType"));
        return g;
    };

    @Override
    public int insert(TrainingGroup group) {
        final String sql = """
                INSERT INTO TrainingGroup (`name`, `groupType`, `description`, `isActive`)
                VALUES (?, ?, ?, ?)
                """;

        KeyHolder keyHolder = new GeneratedKeyHolder();

        int rows = jdbcTemplate.update(connection -> {
            PreparedStatement ps = connection.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS);
            ps.setString(1, group.getName());
            ps.setString(2, group.getGroupTypeStr() != null ? group.getGroupTypeStr() : "TRAINING_GROUP");
            ps.setString(3, group.getDescription());
            ps.setBoolean(4, group.getIsActive() != null ? group.getIsActive() : true);
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
        group.setGroupId(generatedId);
        return generatedId;
    }

    @Override
    public List<TrainingGroup> getAll() {
        final String sql = """
                SELECT groupId, name, groupType, description, isActive, createdAt, updatedAt
                FROM TrainingGroup
                ORDER BY groupId
                """;
        return jdbcTemplate.query(sql, rowMapper);
    }

    @Override
    public TrainingGroup getById(int id) {
        final String sql = """
                SELECT groupId, name, groupType, description, isActive, createdAt, updatedAt
                FROM TrainingGroup
                WHERE groupId = ?
                """;
        try {
            return jdbcTemplate.queryForObject(sql, rowMapper, id);
        } catch (EmptyResultDataAccessException e) {
            return null;
        }
    }

    @Override
    public List<TrainingGroup> getByType(TrainingGroup.GroupType type) {
        final String sql = """
                SELECT groupId, name, groupType, description, isActive, createdAt, updatedAt
                FROM TrainingGroup
                WHERE groupType = ?
                ORDER BY groupId
                """;
        return jdbcTemplate.query(sql, rowMapper, type.name());
    }

    @Override
    public List<TrainingGroup> getActive() {
        final String sql = """
                SELECT groupId, name, groupType, description, isActive, createdAt, updatedAt
                FROM TrainingGroup
                WHERE isActive = TRUE
                ORDER BY groupId
                """;
        return jdbcTemplate.query(sql, rowMapper);
    }

    @Override
    public boolean update(TrainingGroup group) {
        final String sql = """
                UPDATE TrainingGroup
                SET name = ?, groupType = ?, description = ?, isActive = ?
                WHERE groupId = ?
                """;

        int rows = jdbcTemplate.update(
                sql,
                group.getName(),
                group.getGroupTypeStr(),
                group.getDescription(),
                group.getIsActive(),
                group.getGroupId()
        );

        return rows == 1;
    }

    @Override
    public boolean delete(int id) {
        return jdbcTemplate.update(
                "DELETE FROM TrainingGroup WHERE groupId = ?",
                id
        ) == 1;
    }
}
