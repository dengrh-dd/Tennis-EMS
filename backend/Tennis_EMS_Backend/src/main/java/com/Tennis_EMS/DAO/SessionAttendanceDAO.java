package com.Tennis_EMS.DAO;

import com.Tennis_EMS.Entity.SessionAttendance;
import java.util.List;

public interface SessionAttendanceDAO {

    boolean insert(SessionAttendance sa);

    SessionAttendance get(int sessionId, int studentId);

    List<SessionAttendance> getBySessionId(int sessionId);

    List<SessionAttendance> getByStudentId(int studentId);

    boolean updateStatus(int sessionId, int studentId, String status);

    boolean updateSource(int sessionId, int studentId, String source);

    boolean delete(int sessionId, int studentId);
}
