package com.Tennis_EMS.DAO;

import com.Tennis_EMS.Entity.TrainingMatch;

import java.util.List;

public interface TrainingMatchDAO {

    int insert(TrainingMatch match);

    TrainingMatch getById(int matchId);

    List<TrainingMatch> getBySession(int sessionId);

    List<TrainingMatch> getByStatus(TrainingMatch.Status status);

    List<TrainingMatch> getBySessionAndType(int sessionId,
                                            TrainingMatch.MatchType type);

    boolean update(TrainingMatch match);

    boolean delete(int matchId);
}
