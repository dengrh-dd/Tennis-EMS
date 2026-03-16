package com.Tennis_EMS.DAO;

import com.Tennis_EMS.Entity.Coach;
import java.util.List;

public interface CoachDAO {

    int insert(Coach coach);

    List<Coach> getAll();

    Coach getById(int id);

    Coach getByUserId(int userId);

    boolean update(Coach coach);

    boolean delete(int id);
}
