package com.Tennis_EMS.Controller;

import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
public class DBTestController {

    private final JdbcTemplate jdbcTemplate;

    public DBTestController(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    @GetMapping("/api/db/ping")
    public Map<String, Object> ping() {
        return jdbcTemplate.queryForMap("SELECT NOW() AS now_time");
    }
}
