package com.Tennis_EMS.DAO;

import com.Tennis_EMS.Entity.TrainingGroupMember;

import java.util.List;

public interface TrainingGroupMemberDAO {

    boolean insert(TrainingGroupMember member);

    boolean delete(int groupId, int studentId);

    TrainingGroupMember get(int groupId, int studentId);

    List<TrainingGroupMember> getByGroup(int groupId);

    List<TrainingGroupMember> getByStudent(int studentId);

    List<TrainingGroupMember> getActiveByGroup(int groupId);

    boolean updateDates(int groupId, int studentId,
                        java.time.LocalDate startDate,
                        java.time.LocalDate endDate);
}
