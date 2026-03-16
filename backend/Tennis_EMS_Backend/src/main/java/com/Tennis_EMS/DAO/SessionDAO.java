package com.Tennis_EMS.DAO;

import com.Tennis_EMS.Entity.Session;

import java.time.LocalDateTime;
import java.util.List;

public interface SessionDAO {

    int insert(Session session);

    List<Session> getAll();

    Session getById(int id);

    List<Session> getBySectionId(int sectionId);

    Session getBySectionIdAndStartTime(int sectionId, LocalDateTime startTime);

    boolean update(Session session);

    boolean delete(int id);
}
