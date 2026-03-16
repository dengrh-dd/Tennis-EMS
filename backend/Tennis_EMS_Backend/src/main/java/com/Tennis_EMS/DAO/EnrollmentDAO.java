package com.Tennis_EMS.DAO;

import com.Tennis_EMS.Entity.Enrollment;
import java.util.List;

public interface EnrollmentDAO {

    boolean insert(Enrollment enrollment);

    Enrollment get(int studentId, int sectionId);

    List<Enrollment> getByStudentId(int studentId);

    List<Enrollment> getBySectionId(int sectionId);

    boolean updateStatus(int studentId, int sectionId, String status);

    boolean delete(int studentId, int sectionId);
}
