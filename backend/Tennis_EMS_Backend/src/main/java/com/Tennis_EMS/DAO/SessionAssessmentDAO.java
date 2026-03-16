package com.Tennis_EMS.DAO;

import com.Tennis_EMS.Entity.SessionAssessment;

import java.util.List;

public interface SessionAssessmentDAO {

    int insert(SessionAssessment assessment);

    SessionAssessment getById(int assessmentId);

    SessionAssessment getByUnique(int sessionId, int studentId,
                                  SessionAssessment.Metric metric);

    List<SessionAssessment> getBySession(int sessionId);

    List<SessionAssessment> getByStudent(int studentId);

    List<SessionAssessment> getBySessionAndStudent(int sessionId, int studentId);

    boolean update(SessionAssessment assessment);

    boolean delete(int assessmentId);
}
