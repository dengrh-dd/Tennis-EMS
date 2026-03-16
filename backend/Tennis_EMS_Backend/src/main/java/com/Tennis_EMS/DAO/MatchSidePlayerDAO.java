package com.Tennis_EMS.DAO;

import com.Tennis_EMS.Entity.MatchSidePlayer;

import java.util.List;

public interface MatchSidePlayerDAO {

    boolean insert(MatchSidePlayer player);

    boolean delete(int matchId, MatchSidePlayer.Side side, int position);

    boolean deleteByMatch(int matchId);

    MatchSidePlayer get(int matchId,
                        MatchSidePlayer.Side side,
                        int position);

    List<MatchSidePlayer> getByMatch(int matchId);

    List<MatchSidePlayer> getByStudent(int studentId);
}