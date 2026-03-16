package com.Tennis_EMS.Service.seed;

import com.Tennis_EMS.DAO.AdminDAO;
import com.Tennis_EMS.DAO.CoachDAO;
import com.Tennis_EMS.DAO.StudentDAO;
import com.Tennis_EMS.DAO.UserDAO;
import com.Tennis_EMS.DTO.SeedResultDTO;
import com.Tennis_EMS.Entity.Admin;
import com.Tennis_EMS.Entity.Coach;
import com.Tennis_EMS.Entity.Student;
import com.Tennis_EMS.Entity.User;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDate;

@Service
public class UserSeedService {

    private final UserDAO userDAO;
    private final AdminDAO adminDAO;
    private final CoachDAO coachDAO;
    private final StudentDAO studentDAO;
    private final PasswordEncoder passwordEncoder;

    public UserSeedService(UserDAO userDAO,
                           AdminDAO adminDAO,
                           CoachDAO coachDAO,
                           StudentDAO studentDAO,
                           PasswordEncoder passwordEncoder) {
        this.userDAO = userDAO;
        this.adminDAO = adminDAO;
        this.coachDAO = coachDAO;
        this.studentDAO = studentDAO;
        this.passwordEncoder = passwordEncoder;
    }

    public void seedUsers(SeedResultDTO result) {
        seedAdmin(result);
        seedCoach(result);
        seedStudent(result);
    }

    public int getRequiredUserIdByEmail(String email) {
        User user = userDAO.getByEmail(email);
        if (user == null) {
            throw new IllegalStateException("Required user not found: " + email);
        }
        return user.getUserId();
    }

    public int getRequiredCoachIdByEmail(String email) {
        User user = userDAO.getByEmail(email);
        if (user == null) {
            throw new IllegalStateException("Required coach user not found: " + email);
        }

        Coach coach = coachDAO.getByUserId(user.getUserId());
        if (coach == null) {
            throw new IllegalStateException("Coach profile not found for: " + email);
        }

        return coach.getCoachId();
    }

    public int getRequiredStudentIdByEmail(String email) {
        User user = userDAO.getByEmail(email);
        if (user == null) {
            throw new IllegalStateException("Required student user not found: " + email);
        }

        Student student = studentDAO.getByUserId(user.getUserId());
        if (student == null) {
            throw new IllegalStateException("Student profile not found for: " + email);
        }

        return student.getStudentId();
    }

    private void seedAdmin(SeedResultDTO result) {
        final String email = "admin@test.com";
        final String rawPassword = "123456";

        User existingUser = userDAO.getByEmail(email);
        if (existingUser != null) {
            Admin existingAdmin = adminDAO.getByUserId(existingUser.getUserId());
            if (existingAdmin == null) {
                throw new IllegalStateException("Admin user exists but Admin profile is missing. userId = " + existingUser.getUserId());
            }
            result.addMessage("Admin already exists: " + email);
            return;
        }

        User user = new User();
        user.setEmail(email);
        user.setPasswordHash(passwordEncoder.encode(rawPassword));
        user.setRole(User.Role.ADMIN);
        user.setIsActive(true);

        int userId = userDAO.insert(user);
        result.incrementUsersCreated();

        Admin admin = new Admin();
        admin.setUserId(userId);
        admin.setFirstName("System");
        admin.setLastName("Admin");
        admin.setPhone("111-111-1111");
        admin.setAdminLevelFromString("SUPER");

        adminDAO.insert(admin);

        if (adminDAO.getByUserId(userId) == null) {
            throw new IllegalStateException("Failed to create Admin profile for userId = " + userId);
        }

        result.incrementAdminProfilesCreated();
        result.addMessage("Admin seed created: " + email);
    }

    private void seedCoach(SeedResultDTO result) {
        final String email = "coach@test.com";
        final String rawPassword = "123456";

        User existingUser = userDAO.getByEmail(email);
        if (existingUser != null) {
            Coach existingCoach = coachDAO.getByUserId(existingUser.getUserId());
            if (existingCoach == null) {
                throw new IllegalStateException("Coach user exists but Coach profile is missing. userId = " + existingUser.getUserId());
            }
            result.addMessage("Coach already exists: " + email);
            return;
        }

        User user = new User();
        user.setEmail(email);
        user.setPasswordHash(passwordEncoder.encode(rawPassword));
        user.setRole(User.Role.COACH);
        user.setIsActive(true);

        int userId = userDAO.insert(user);
        result.incrementUsersCreated();

        Coach coach = new Coach();
        coach.setUserId(userId);
        coach.setFirstName("Alex");
        coach.setLastName("Coach");
        coach.setPhone("222-222-2222");
        coach.setDateOfBirth(LocalDate.of(1990, 5, 20));
        coach.setCertification("USPTR Level 1");
        coach.setExperienceYears(6);
        coach.setBio("Seeded coach account for local development and login testing.");

        coachDAO.insert(coach);

        if (coachDAO.getByUserId(userId) == null) {
            throw new IllegalStateException("Failed to create Coach profile for userId = " + userId);
        }

        result.incrementCoachProfilesCreated();
        result.addMessage("Coach seed created: " + email);
    }

    private void seedStudent(SeedResultDTO result) {
        final String email = "student@test.com";
        final String rawPassword = "123456";

        User existingUser = userDAO.getByEmail(email);
        if (existingUser != null) {
            Student existingStudent = studentDAO.getByUserId(existingUser.getUserId());
            if (existingStudent == null) {
                throw new IllegalStateException("Student user exists but Student profile is missing. userId = " + existingUser.getUserId());
            }
            result.addMessage("Student already exists: " + email);
            return;
        }

        User user = new User();
        user.setEmail(email);
        user.setPasswordHash(passwordEncoder.encode(rawPassword));
        user.setRole(User.Role.STUDENT);
        user.setIsActive(true);

        int userId = userDAO.insert(user);
        result.incrementUsersCreated();

        Student student = new Student();
        student.setUserId(userId);
        student.setFirstName("Jamie");
        student.setLastName("Student");
        student.setPreferredName("Jamie");
        student.setPhone("333-333-3333");
        student.setDateOfBirth(LocalDate.of(2008, 8, 15));
        student.setSkillLevelFromString("BEGINNER");
        student.setNotes("Seeded student account for local development and login testing.");
        student.setEmergencyContactName("Parent Student");
        student.setEmergencyContactPhone("444-444-4444");

        studentDAO.insert(student);

        if (studentDAO.getByUserId(userId) == null) {
            throw new IllegalStateException("Failed to create Student profile for userId = " + userId);
        }

        result.incrementStudentProfilesCreated();
        result.addMessage("Student seed created: " + email);
    }
}
