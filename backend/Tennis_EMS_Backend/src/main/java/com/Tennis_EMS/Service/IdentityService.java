package com.Tennis_EMS.Service;

import com.Tennis_EMS.DAO.AdminDAO;
import com.Tennis_EMS.DAO.CoachDAO;
import com.Tennis_EMS.DAO.StudentDAO;
import com.Tennis_EMS.Entity.Admin;
import com.Tennis_EMS.Entity.Coach;
import com.Tennis_EMS.Entity.Student;
import com.Tennis_EMS.Entity.User;
import org.springframework.stereotype.Service;

@Service
public class IdentityService {

    private final AdminDAO adminDAO;
    private final CoachDAO coachDAO;
    private final StudentDAO studentDAO;

    public IdentityService(AdminDAO adminDAO, CoachDAO coachDAO, StudentDAO studentDAO) {
        this.adminDAO = adminDAO;
        this.coachDAO = coachDAO;
        this.studentDAO = studentDAO;
    }

    public Integer getProfileId(int userId, User.Role role) {
        if (role == null) {
            throw new IllegalArgumentException("Role cannot be null.");
        }

        return switch (role) {
            case ADMIN -> {
                Admin admin = adminDAO.getByUserId(userId);
                yield admin == null ? null : admin.getAdminId();
            }
            case COACH -> {
                Coach coach = coachDAO.getByUserId(userId);
                yield coach == null ? null : coach.getCoachId();
            }
            case STUDENT -> {
                Student student = studentDAO.getByUserId(userId);
                yield student == null ? null : student.getStudentId();
            }
        };
    }

    public String getDisplayName(int userId, User.Role role) {
        if (role == null) {
            throw new IllegalArgumentException("Role cannot be null.");
        }

        return switch (role) {
            case ADMIN -> {
                Admin admin = adminDAO.getByUserId(userId);
                if (admin == null) {
                    yield null;
                }
                String first = admin.getFirstName() == null ? "" : admin.getFirstName();
                String last = admin.getLastName() == null ? "" : admin.getLastName();
                String name = (first + " " + last).trim();
                yield name.isEmpty() ? null : name;
            }
            case COACH -> {
                Coach coach = coachDAO.getByUserId(userId);
                if (coach == null) {
                    yield null;
                }
                String first = coach.getFirstName() == null ? "" : coach.getFirstName();
                String last = coach.getLastName() == null ? "" : coach.getLastName();
                String name = (first + " " + last).trim();
                yield name.isEmpty() ? null : name;
            }
            case STUDENT -> {
                Student student = studentDAO.getByUserId(userId);
                if (student == null) {
                    yield null;
                }
                String preferred = student.getPreferredName();
                if (preferred != null && !preferred.trim().isEmpty()) {
                    yield preferred.trim();
                }
                String first = student.getFirstName() == null ? "" : student.getFirstName();
                String last = student.getLastName() == null ? "" : student.getLastName();
                String name = (first + " " + last).trim();
                yield name.isEmpty() ? null : name;
            }
        };
    }
}
