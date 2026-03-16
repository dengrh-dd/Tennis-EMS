package com.Tennis_EMS.DAO;

import com.Tennis_EMS.Entity.TrainingGroup;

import java.util.List;

public interface TrainingGroupDAO {

    int insert(TrainingGroup group);

    List<TrainingGroup> getAll();

    TrainingGroup getById(int id);

    List<TrainingGroup> getByType(TrainingGroup.GroupType type);

    List<TrainingGroup> getActive();

    boolean update(TrainingGroup group);

    boolean delete(int id);
}
