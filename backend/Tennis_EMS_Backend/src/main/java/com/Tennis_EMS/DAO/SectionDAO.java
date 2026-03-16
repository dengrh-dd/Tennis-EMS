package com.Tennis_EMS.DAO;

import com.Tennis_EMS.Entity.Section;
import java.util.List;

public interface SectionDAO {

    int insert(Section section);

    List<Section> getAll();

    Section getById(int id);

    List<Section> getByCourseId(int courseId);

    List<Section> getByCoachId(int coachId);

    Section getByCourseIdAndCoachIdAndName(int courseId, int coachId, String name);

    boolean update(Section section);

    boolean delete(int id);
}
