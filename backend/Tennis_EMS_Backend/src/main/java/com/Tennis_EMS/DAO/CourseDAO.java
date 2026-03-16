package com.Tennis_EMS.DAO;

import com.Tennis_EMS.Entity.Course;
import java.util.List;

public interface CourseDAO {

    int insert(Course course);

    List<Course> getAll();

    Course getById(int id);

    Course getByCourseNumber(String courseNumber);

    boolean update(Course course);

    boolean delete(int id);
}
