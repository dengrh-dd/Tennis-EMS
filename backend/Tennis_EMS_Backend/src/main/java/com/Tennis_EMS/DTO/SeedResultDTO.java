package com.Tennis_EMS.DTO;

import java.util.ArrayList;
import java.util.List;

public class SeedResultDTO {

    private boolean success;

    // user system
    private Integer usersCreated;
    private Integer adminProfilesCreated;
    private Integer coachProfilesCreated;
    private Integer studentProfilesCreated;

    // course system
    private Integer coursesCreated;
    private Integer sectionsCreated;
    private Integer courtsCreated;
    private Integer sessionsCreated;
    private Integer enrollmentsCreated;
    private Integer sessionAttendancesCreated;
    private Integer sessionNotesCreated;
    private Integer sessionAssessmentsCreated;

    // match system
    private Integer scoringFormatsCreated;
    private Integer trainingMatchesCreated;
    private Integer matchSidePlayersCreated;
    private Integer matchSummariesCreated;
    private Integer matchSegmentsCreated;

    // group system
    private int trainingGroupsCreated;
    private int trainingGroupMembersCreated;

    private final List<String> messages = new ArrayList<>();

    public SeedResultDTO() {
        this.success = true;

        this.usersCreated = 0;
        this.adminProfilesCreated = 0;
        this.coachProfilesCreated = 0;
        this.studentProfilesCreated = 0;

        this.coursesCreated = 0;
        this.sectionsCreated = 0;
        this.courtsCreated = 0;
        this.sessionsCreated = 0;
        this.enrollmentsCreated = 0;
        this.sessionAttendancesCreated = 0;
        this.sessionNotesCreated = 0;
        this.sessionAssessmentsCreated = 0;

        this.scoringFormatsCreated = 0;
        this.trainingMatchesCreated = 0;
        this.matchSidePlayersCreated = 0;
        this.matchSummariesCreated = 0;
        this.matchSegmentsCreated = 0;
    }

    public boolean isSuccess() {
        return success;
    }

    public void setSuccess(boolean success) {
        this.success = success;
    }

    public Integer getUsersCreated() {
        return usersCreated;
    }

    public void setUsersCreated(Integer usersCreated) {
        this.usersCreated = usersCreated;
    }

    public Integer getAdminProfilesCreated() {
        return adminProfilesCreated;
    }

    public void setAdminProfilesCreated(Integer adminProfilesCreated) {
        this.adminProfilesCreated = adminProfilesCreated;
    }

    public Integer getCoachProfilesCreated() {
        return coachProfilesCreated;
    }

    public void setCoachProfilesCreated(Integer coachProfilesCreated) {
        this.coachProfilesCreated = coachProfilesCreated;
    }

    public Integer getStudentProfilesCreated() {
        return studentProfilesCreated;
    }

    public void setStudentProfilesCreated(Integer studentProfilesCreated) {
        this.studentProfilesCreated = studentProfilesCreated;
    }

    public Integer getCoursesCreated() {
        return coursesCreated;
    }

    public void setCoursesCreated(Integer coursesCreated) {
        this.coursesCreated = coursesCreated;
    }

    public Integer getSectionsCreated() {
        return sectionsCreated;
    }

    public void setSectionsCreated(Integer sectionsCreated) {
        this.sectionsCreated = sectionsCreated;
    }

    public Integer getCourtsCreated() {
        return courtsCreated;
    }

    public void setCourtsCreated(Integer courtsCreated) {
        this.courtsCreated = courtsCreated;
    }

    public Integer getSessionsCreated() {
        return sessionsCreated;
    }

    public void setSessionsCreated(Integer sessionsCreated) {
        this.sessionsCreated = sessionsCreated;
    }

    public Integer getEnrollmentsCreated() {
        return enrollmentsCreated;
    }

    public void setEnrollmentsCreated(Integer enrollmentsCreated) {
        this.enrollmentsCreated = enrollmentsCreated;
    }

    public Integer getSessionAttendancesCreated() {
        return sessionAttendancesCreated;
    }

    public void setSessionAttendancesCreated(Integer sessionAttendancesCreated) {
        this.sessionAttendancesCreated = sessionAttendancesCreated;
    }

    public Integer getSessionNotesCreated() {
        return sessionNotesCreated;
    }

    public void setSessionNotesCreated(Integer sessionNotesCreated) {
        this.sessionNotesCreated = sessionNotesCreated;
    }

    public Integer getSessionAssessmentsCreated() {
        return sessionAssessmentsCreated;
    }

    public void setSessionAssessmentsCreated(Integer sessionAssessmentsCreated) {
        this.sessionAssessmentsCreated = sessionAssessmentsCreated;
    }

    public Integer getScoringFormatsCreated() {
        return scoringFormatsCreated;
    }

    public void setScoringFormatsCreated(Integer scoringFormatsCreated) {
        this.scoringFormatsCreated = scoringFormatsCreated;
    }

    public Integer getTrainingMatchesCreated() {
        return trainingMatchesCreated;
    }

    public void setTrainingMatchesCreated(Integer trainingMatchesCreated) {
        this.trainingMatchesCreated = trainingMatchesCreated;
    }

    public Integer getMatchSidePlayersCreated() {
        return matchSidePlayersCreated;
    }

    public void setMatchSidePlayersCreated(Integer matchSidePlayersCreated) {
        this.matchSidePlayersCreated = matchSidePlayersCreated;
    }

    public Integer getMatchSummariesCreated() {
        return matchSummariesCreated;
    }

    public void setMatchSummariesCreated(Integer matchSummariesCreated) {
        this.matchSummariesCreated = matchSummariesCreated;
    }

    public Integer getMatchSegmentsCreated() {
        return matchSegmentsCreated;
    }

    public void setMatchSegmentsCreated(Integer matchSegmentsCreated) {
        this.matchSegmentsCreated = matchSegmentsCreated;
    }

    public List<String> getMessages() {
        return messages;
    }

    public void addMessage(String message) {
        this.messages.add(message);
    }

    public void incrementUsersCreated() {
        this.usersCreated++;
    }

    public void incrementAdminProfilesCreated() {
        this.adminProfilesCreated++;
    }

    public void incrementCoachProfilesCreated() {
        this.coachProfilesCreated++;
    }

    public void incrementStudentProfilesCreated() {
        this.studentProfilesCreated++;
    }

    public void incrementCoursesCreated() {
        this.coursesCreated++;
    }

    public void incrementSectionsCreated() {
        this.sectionsCreated++;
    }

    public void incrementCourtsCreated() {
        this.courtsCreated++;
    }

    public void incrementSessionsCreated() {
        this.sessionsCreated++;
    }

    public void incrementEnrollmentsCreated() {
        this.enrollmentsCreated++;
    }

    public void incrementSessionAttendancesCreated() {
        this.sessionAttendancesCreated++;
    }

    public void incrementSessionNotesCreated() {
        this.sessionNotesCreated++;
    }

    public void incrementSessionAssessmentsCreated() {
        this.sessionAssessmentsCreated++;
    }

    public void incrementScoringFormatsCreated() {
        this.scoringFormatsCreated++;
    }

    public void incrementTrainingMatchesCreated() {
        this.trainingMatchesCreated++;
    }

    public void incrementMatchSidePlayersCreated() {
        this.matchSidePlayersCreated++;
    }

    public void incrementMatchSummariesCreated() {
        this.matchSummariesCreated++;
    }

    public void incrementMatchSegmentsCreated() {
        this.matchSegmentsCreated++;
    }

    public int getTrainingGroupsCreated() {
        return trainingGroupsCreated;
    }

    public void incrementTrainingGroupsCreated() {
        this.trainingGroupsCreated++;
    }

    public int getTrainingGroupMembersCreated() {
        return trainingGroupMembersCreated;
    }

    public void incrementTrainingGroupMembersCreated() {
        this.trainingGroupMembersCreated++;
    }
}
