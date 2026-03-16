package com.Tennis_EMS.DAO.JDBC;

import com.Tennis_EMS.DAO.CourtDAO;
import com.Tennis_EMS.Entity.Court;
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
public class CourtJDBC implements CourtDAO {

    private final JdbcTemplate jdbcTemplate;

    public CourtJDBC(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    private final RowMapper<Court> rowMapper = (rs, rowNum) -> {

        Court.SurfaceType surface =
                Court.SurfaceType.parse(rs.getString("surfaceType"));

        Court.Status status =
                Court.Status.parse(rs.getString("status"));

        return new Court(
                rs.getInt("courtId"),
                rs.getString("name"),
                rs.getString("location"),
                surface,
                rs.getBoolean("isIndoor"),
                rs.getBoolean("hasLighting"),
                status
        );
    };

    @Override
    public int insert(Court court) {

        if (court == null) {
            throw new IllegalArgumentException("Court cannot be null.");
        }

        if (court.getName() == null || court.getName().trim().isEmpty()) {
            throw new IllegalArgumentException("Court name cannot be empty.");
        }

        if (court.getLocation() == null || court.getLocation().trim().isEmpty()) {
            throw new IllegalArgumentException("Court location cannot be empty.");
        }

        if (court.getSurfaceType() == null) {
            throw new IllegalArgumentException("Surface type cannot be null.");
        }

        final String sql = """
                INSERT INTO Court
                (`name`, `location`, `surfaceType`, `isIndoor`, `hasLighting`, `status`)
                VALUES (?, ?, ?, ?, ?, ?)
                """;

        KeyHolder keyHolder = new GeneratedKeyHolder();

        int rows = jdbcTemplate.update(connection -> {

            PreparedStatement ps =
                    connection.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS);

            ps.setString(1, court.getName());
            ps.setString(2, court.getLocation());
            ps.setString(3, court.getSurfaceTypeStr());
            ps.setBoolean(4, court.getIsIndoor() != null ? court.getIsIndoor() : false);
            ps.setBoolean(5, court.getHasLighting() != null ? court.getHasLighting() : true);
            ps.setString(6, court.getStatusStr());

            return ps;

        }, keyHolder);

        if (rows != 1) {
            throw new IllegalStateException("Insert failed: affected rows = " + rows);
        }

        Number key = keyHolder.getKey();

        if (key == null) {
            throw new IllegalStateException("Insert succeeded but no generated key.");
        }

        int generatedId = key.intValue();

        court.setCourtId(generatedId);

        return generatedId;
    }

    @Override
    public List<Court> getAll() {

        final String sql = """
                SELECT courtId, name, location, surfaceType, isIndoor, hasLighting, status
                FROM Court
                ORDER BY courtId
                """;

        return jdbcTemplate.query(sql, rowMapper);
    }

    @Override
    public Court getById(int id) {

        final String sql = """
                SELECT courtId, name, location, surfaceType, isIndoor, hasLighting, status
                FROM Court
                WHERE courtId = ?
                """;

        try {
            return jdbcTemplate.queryForObject(sql, rowMapper, id);
        } catch (EmptyResultDataAccessException e) {
            return null;
        }
    }

    @Override
    public Court getByLocationAndName(String location, String name) {

        if (location == null || location.trim().isEmpty()) {
            throw new IllegalArgumentException("Court location cannot be empty.");
        }

        if (name == null || name.trim().isEmpty()) {
            throw new IllegalArgumentException("Court name cannot be empty.");
        }

        final String sql = """
            SELECT courtId, name, location, surfaceType, isIndoor, hasLighting, status
            FROM Court
            WHERE location = ? AND name = ?
            """;

        try {
            return jdbcTemplate.queryForObject(sql, rowMapper, location, name);
        } catch (EmptyResultDataAccessException e) {
            return null;
        }
    }

    @Override
    public boolean update(Court court) {

        if (court == null) {
            throw new IllegalArgumentException("Court cannot be null.");
        }

        if (court.getCourtId() == null) {
            throw new IllegalArgumentException("Court id cannot be null.");
        }

        final String sql = """
                UPDATE Court
                SET name = ?, location = ?, surfaceType = ?, isIndoor = ?, hasLighting = ?, status = ?
                WHERE courtId = ?
                """;

        int rows = jdbcTemplate.update(
                sql,
                court.getName(),
                court.getLocation(),
                court.getSurfaceTypeStr(),
                court.getIsIndoor(),
                court.getHasLighting(),
                court.getStatusStr(),
                court.getCourtId()
        );

        return rows == 1;
    }

    @Override
    public boolean delete(int id) {

        return jdbcTemplate.update(
                "DELETE FROM Court WHERE courtId = ?",
                id
        ) == 1;
    }
}
