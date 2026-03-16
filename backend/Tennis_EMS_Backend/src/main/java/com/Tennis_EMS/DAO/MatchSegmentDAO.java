package com.Tennis_EMS.DAO;

import com.Tennis_EMS.Entity.MatchSegment;

import java.util.List;

public interface MatchSegmentDAO {

    boolean insert(MatchSegment segment);

    boolean update(MatchSegment segment);

    boolean delete(int matchId, int segmentNo);

    boolean deleteByMatch(int matchId);

    MatchSegment get(int matchId, int segmentNo);

    List<MatchSegment> getByMatch(int matchId);
}
