package com.Tennis_EMS.Service.seed;

import com.Tennis_EMS.DAO.*;
import com.Tennis_EMS.DTO.SeedResultDTO;
import com.Tennis_EMS.Entity.*;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Service
public class CourseSeedService {

    private final CourseDAO courseDAO;
    private final CourtDAO courtDAO;
    private final SectionDAO sectionDAO;
    private final SessionDAO sessionDAO;
    private final EnrollmentDAO enrollmentDAO;
    private final SessionAttendanceDAO sessionAttendanceDAO;
    private final SessionNoteDAO sessionNoteDAO;
    private final SessionAssessmentDAO sessionAssessmentDAO;
    private final UserSeedService userSeedService;

    public CourseSeedService(CourseDAO courseDAO,
                             CourtDAO courtDAO,
                             SectionDAO sectionDAO,
                             SessionDAO sessionDAO,
                             EnrollmentDAO enrollmentDAO,
                             SessionAttendanceDAO sessionAttendanceDAO,
                             SessionNoteDAO sessionNoteDAO,
                             SessionAssessmentDAO sessionAssessmentDAO,
                             UserSeedService userSeedService) {
        this.courseDAO = courseDAO;
        this.courtDAO = courtDAO;
        this.sectionDAO = sectionDAO;
        this.sessionDAO = sessionDAO;
        this.enrollmentDAO = enrollmentDAO;
        this.sessionAttendanceDAO = sessionAttendanceDAO;
        this.sessionNoteDAO = sessionNoteDAO;
        this.sessionAssessmentDAO = sessionAssessmentDAO;
        this.userSeedService = userSeedService;
    }

    public CourseSeedContext seedCourseSystem(SeedResultDTO result) {
        int courseId = seedCourseBeginner(result);
        int courtId = seedCourtOne(result);

        int coachId = userSeedService.getRequiredCoachIdByEmail("coach@test.com");
        int studentId = userSeedService.getRequiredStudentIdByEmail("student@test.com");
        int adminUserId = userSeedService.getRequiredUserIdByEmail("admin@test.com");

        int sectionId = seedSectionBeginner(result, courseId, coachId);
        int sessionId = seedSessionOne(result, sectionId, courtId);

        seedEnrollment(result, studentId, sectionId);
        seedSessionAttendance(result, sessionId, studentId);
        seedSessionNote(result, sessionId, adminUserId);
        seedSessionAssessment(result, sessionId, studentId, adminUserId);

        return new CourseSeedContext(courseId, courtId, sectionId, sessionId);
    }

    private int seedCourseBeginner(SeedResultDTO result) {
        final String courseNumber = "TENNIS-101";

        Course existing = courseDAO.getByCourseNumber(courseNumber);
        if (existing != null) {
            result.addMessage("Course already exists: " + courseNumber);
            return existing.getCourseId();
        }

        Course course = new Course();
        course.setName("Beginner Tennis Fundamentals");
        course.setCourseNumber(courseNumber);
        course.setDescription("Seeded introductory tennis course.");
        course.setLevelFromString("BEGINNER");
        course.setIsActive(true);

        int courseId = courseDAO.insert(course);
        result.incrementCoursesCreated();
        result.addMessage("Course seed created: " + courseNumber);
        return courseId;
    }

    private int seedCourtOne(SeedResultDTO result) {
        Court existing = courtDAO.getByLocationAndName("Main Campus", "Court 1");
        if (existing != null) {
            result.addMessage("Court already exists: Main Campus / Court 1");
            return existing.getCourtId();
        }

        Court court = new Court();
        court.setName("Court 1");
        court.setLocation("Main Campus");
        court.setSurfaceTypeFromString("HARD");
        court.setIsIndoor(false);
        court.setHasLighting(true);
        court.setStatusFromString("AVAILABLE");

        int courtId = courtDAO.insert(court);
        result.incrementCourtsCreated();
        result.addMessage("Court seed created: Main Campus / Court 1");
        return courtId;
    }

    private int seedSectionBeginner(SeedResultDTO result, int courseId, int coachId) {
        Section existing = sectionDAO.getByCourseIdAndCoachIdAndName(
                courseId,
                coachId,
                "Beginner Section A"
        );

        if (existing != null) {
            result.addMessage("Section already exists: Beginner Section A");
            return existing.getSectionId();
        }

        Section section = new Section();
        section.setCourseId(courseId);
        section.setCoachId(coachId);
        section.setName("Beginner Section A");
        section.setSyllabus("Intro strokes, footwork, rally basics.");
        section.setStartDate(LocalDate.now().plusDays(1));
        section.setEndDate(LocalDate.now().plusWeeks(6));
        section.setMaxStudents(12);
        section.setEnrollmentModeFromString("FIXED");
        section.setStatusFromString("ACTIVE");

        int sectionId = sectionDAO.insert(section);
        result.incrementSectionsCreated();
        result.addMessage("Section seed created: Beginner Section A");
        return sectionId;
    }

    private int seedSessionOne(SeedResultDTO result, int sectionId, int courtId) {
        LocalDateTime startTime = LocalDateTime.now()
                .plusDays(2)
                .withHour(18)
                .withMinute(0)
                .withSecond(0)
                .withNano(0);

        Session existing = sessionDAO.getBySectionIdAndStartTime(sectionId, startTime);
        if (existing != null) {
            result.addMessage("Session already exists for sectionId = " + sectionId + " at " + startTime);
            return existing.getSessionId();
        }

        Session session = new Session();
        session.setSectionId(sectionId);
        session.setStartTime(startTime);
        session.setEndTime(startTime.plusMinutes(90));
        session.setLocation("Main Campus");
        session.setCourtId(courtId);
        session.setStatusFromString("SCHEDULED");

        int sessionId = sessionDAO.insert(session);
        result.incrementSessionsCreated();
        result.addMessage("Session seed created for sectionId = " + sectionId);
        return sessionId;
    }

    private void seedEnrollment(SeedResultDTO result, int studentId, int sectionId) {
        Enrollment existing = enrollmentDAO.get(studentId, sectionId);
        if (existing != null) {
            result.addMessage("Enrollment already exists: studentId = " + studentId + ", sectionId = " + sectionId);
            return;
        }

        Enrollment enrollment = new Enrollment();
        enrollment.setStudentId(studentId);
        enrollment.setSectionId(sectionId);
        enrollment.setStatusFromString("ENROLLED");

        boolean inserted = enrollmentDAO.insert(enrollment);
        if (!inserted) {
            throw new IllegalStateException("Failed to create Enrollment.");
        }

        result.incrementEnrollmentsCreated();
        result.addMessage("Enrollment seed created.");
    }

    private void seedSessionAttendance(SeedResultDTO result, int sessionId, int studentId) {
        SessionAttendance existing = sessionAttendanceDAO.get(sessionId, studentId);
        if (existing != null) {
            result.addMessage("SessionAttendance already exists: sessionId = " + sessionId + ", studentId = " + studentId);
            return;
        }

        SessionAttendance attendance = new SessionAttendance();
        attendance.setSessionId(sessionId);
        attendance.setStudentId(studentId);
        attendance.setStatusFromString("ENROLLED");
        attendance.setSourceFromString("SECTION");

        boolean inserted = sessionAttendanceDAO.insert(attendance);
        if (!inserted) {
            throw new IllegalStateException("Failed to create SessionAttendance.");
        }

        result.incrementSessionAttendancesCreated();
        result.addMessage("SessionAttendance seed created.");
    }

    private void seedSessionNote(SeedResultDTO result, int sessionId, int authorUserId) {
        SessionNote note = new SessionNote();
        note.setSessionId(sessionId);
        note.setAuthorUserId(authorUserId);
        note.setTitle("Seed Note");
        note.setContent("This session note was generated by the seed component.");

        int noteId = sessionNoteDAO.insert(note);
        if (noteId <= 0) {
            throw new IllegalStateException("Failed to create SessionNote.");
        }

        result.incrementSessionNotesCreated();
        result.addMessage("SessionNote seed created.");
    }

    private void seedSessionAssessment(SeedResultDTO result, int sessionId, int studentId, int assessorUserId) {
        SessionAssessment existing = sessionAssessmentDAO.getByUnique(
                sessionId,
                studentId,
                SessionAssessment.Metric.FOREHAND
        );
        if (existing != null) {
            result.addMessage("SessionAssessment already exists for FOREHAND.");
            return;
        }

        SessionAssessment assessment = new SessionAssessment();
        assessment.setSessionId(sessionId);
        assessment.setStudentId(studentId);
        assessment.setMetric(SessionAssessment.Metric.FOREHAND);
        assessment.setScore(7);
        assessment.setComment("Solid beginner forehand technique.");
        assessment.setAssessorUserId(assessorUserId);

        int assessmentId = sessionAssessmentDAO.insert(assessment);
        if (assessmentId <= 0) {
            throw new IllegalStateException("Failed to create SessionAssessment.");
        }

        result.incrementSessionAssessmentsCreated();
        result.addMessage("SessionAssessment seed created.");
    }

    public static class CourseSeedContext {
        private final int courseId;
        private final int courtId;
        private final int sectionId;
        private final int sessionId;

        public CourseSeedContext(int courseId, int courtId, int sectionId, int sessionId) {
            this.courseId = courseId;
            this.courtId = courtId;
            this.sectionId = sectionId;
            this.sessionId = sessionId;
        }

        public int getCourseId() {
            return courseId;
        }

        public int getCourtId() {
            return courtId;
        }

        public int getSectionId() {
            return sectionId;
        }

        public int getSessionId() {
            return sessionId;
        }
    }
}



