package com.Tennis_EMS.DAO;

import com.Tennis_EMS.Entity.MatchSummary;

public interface MatchSummaryDAO {

    boolean insert(MatchSummary summary);

    MatchSummary getByMatchId(int matchId);

    boolean update(MatchSummary summary);

    boolean delete(int matchId);
}
