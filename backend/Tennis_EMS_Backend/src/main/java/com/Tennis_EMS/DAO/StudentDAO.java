package com.Tennis_EMS.DAO;

import com.Tennis_EMS.Entity.Student;
import java.util.List;

public interface StudentDAO {

    int insert(Student student);

    List<Student> getAll();

    Student getById(int id);

    Student getByUserId(int userId);

    boolean update(Student student);

    boolean delete(int id);
}

