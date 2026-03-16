package com.Tennis_EMS.Service.seed;

import com.Tennis_EMS.DAO.MatchSegmentDAO;
import com.Tennis_EMS.DAO.MatchSidePlayerDAO;
import com.Tennis_EMS.DAO.MatchSummaryDAO;
import com.Tennis_EMS.DAO.ScoringFormatDAO;
import com.Tennis_EMS.DAO.TrainingMatchDAO;
import com.Tennis_EMS.DTO.SeedResultDTO;
import com.Tennis_EMS.Entity.MatchSegment;
import com.Tennis_EMS.Entity.MatchSidePlayer;
import com.Tennis_EMS.Entity.MatchSummary;
import com.Tennis_EMS.Entity.ScoringFormat;
import com.Tennis_EMS.Entity.TrainingMatch;
import org.springframework.stereotype.Service;

@Service
public class MatchSeedService {

    private final ScoringFormatDAO scoringFormatDAO;
    private final TrainingMatchDAO trainingMatchDAO;
    private final MatchSidePlayerDAO matchSidePlayerDAO;
    private final MatchSummaryDAO matchSummaryDAO;
    private final MatchSegmentDAO matchSegmentDAO;
    private final UserSeedService userSeedService;

    public MatchSeedService(ScoringFormatDAO scoringFormatDAO,
                            TrainingMatchDAO trainingMatchDAO,
                            MatchSidePlayerDAO matchSidePlayerDAO,
                            MatchSummaryDAO matchSummaryDAO,
                            MatchSegmentDAO matchSegmentDAO,
                            UserSeedService userSeedService) {
        this.scoringFormatDAO = scoringFormatDAO;
        this.trainingMatchDAO = trainingMatchDAO;
        this.matchSidePlayerDAO = matchSidePlayerDAO;
        this.matchSummaryDAO = matchSummaryDAO;
        this.matchSegmentDAO = matchSegmentDAO;
        this.userSeedService = userSeedService;
    }

    public void seedMatchSystem(SeedResultDTO result, int sessionId) {
        int studentId = userSeedService.getRequiredStudentIdByEmail("student@test.com");

        int formatId = seedScoringFormatSinglesBo3(result);
        int matchId = seedTrainingMatchSingles(result, sessionId, formatId);

        seedMatchSidePlayerA1(result, matchId, studentId);
        seedMatchSummary(result, matchId);
        seedMatchSegment1(result, matchId);
    }

    private int seedScoringFormatSinglesBo3(SeedResultDTO result) {
        final String formatName = "Singles BO3 Standard";

        ScoringFormat existing = scoringFormatDAO.getByName(formatName);
        if (existing != null) {
            result.addMessage("ScoringFormat already exists: " + formatName);
            return existing.getFormatId();
        }

        ScoringFormat format = new ScoringFormat();
        format.setName(formatName);
        format.setFormatType(ScoringFormat.FormatType.SET_MATCH);
        format.setGamesToWinSet(6);
        format.setSetsToWinMatch(2);
        format.setTiebreakAt(6);
        format.setNoAd(false);
        format.setNotes("Seeded best-of-3 singles scoring format.");
        format.setIsActive(true);

        int formatId = scoringFormatDAO.insert(format);
        result.incrementScoringFormatsCreated();
        result.addMessage("ScoringFormat seed created: " + formatName);
        return formatId;
    }

    private int seedTrainingMatchSingles(SeedResultDTO result, int sessionId, int formatId) {
        for (TrainingMatch existing : trainingMatchDAO.getBySessionAndType(
                sessionId,
                TrainingMatch.MatchType.SINGLES
        )) {
            result.addMessage("TrainingMatch already exists for sessionId = " + sessionId + " and type = SINGLES");
            return existing.getMatchId();
        }

        TrainingMatch match = new TrainingMatch();
        match.setSessionId(sessionId);
        match.setFormatId(formatId);
        match.setMatchType(TrainingMatch.MatchType.SINGLES);
        match.setTitle("Seed Singles Match");
        match.setStatus(TrainingMatch.Status.COMPLETED);
        match.setWinnerSide(TrainingMatch.WinnerSide.A);
        match.setNotes("Seeded singles training match.");

        int matchId = trainingMatchDAO.insert(match);
        result.incrementTrainingMatchesCreated();
        result.addMessage("TrainingMatch seed created for sessionId = " + sessionId);
        return matchId;
    }

    private void seedMatchSidePlayerA1(SeedResultDTO result, int matchId, int studentId) {
        MatchSidePlayer existing = matchSidePlayerDAO.get(
                matchId,
                MatchSidePlayer.Side.A,
                1
        );

        if (existing != null) {
            result.addMessage("MatchSidePlayer already exists: matchId = " + matchId + ", side = A, position = 1");
            return;
        }

        MatchSidePlayer player = new MatchSidePlayer();
        player.setMatchId(matchId);
        player.setSide(MatchSidePlayer.Side.A);
        player.setPosition(1);
        player.setStudentId(studentId);

        boolean inserted = matchSidePlayerDAO.insert(player);
        if (!inserted) {
            throw new IllegalStateException("Failed to create MatchSidePlayer A1.");
        }

        result.incrementMatchSidePlayersCreated();
        result.addMessage("MatchSidePlayer A1 seed created.");
    }

    private void seedMatchSummary(SeedResultDTO result, int matchId) {
        MatchSummary existing = matchSummaryDAO.getByMatchId(matchId);
        if (existing != null) {
            result.addMessage("MatchSummary already exists for matchId = " + matchId);
            return;
        }

        MatchSummary summary = new MatchSummary();
        summary.setMatchId(matchId);
        summary.setFinalScoreText("6-3");
        summary.setSideAScore(6);
        summary.setSideBScore(3);

        boolean inserted = matchSummaryDAO.insert(summary);
        if (!inserted) {
            throw new IllegalStateException("Failed to create MatchSummary.");
        }

        result.incrementMatchSummariesCreated();
        result.addMessage("MatchSummary seed created.");
    }

    private void seedMatchSegment1(SeedResultDTO result, int matchId) {
        MatchSegment existing = matchSegmentDAO.get(matchId, 1);
        if (existing != null) {
            result.addMessage("MatchSegment already exists: matchId = " + matchId + ", segmentNo = 1");
            return;
        }

        MatchSegment segment = new MatchSegment();
        segment.setMatchId(matchId);
        segment.setSegmentNo(1);
        segment.setSegmentType(MatchSegment.SegmentType.SET);
        segment.setSideAScore(6);
        segment.setSideBScore(3);

        boolean inserted = matchSegmentDAO.insert(segment);
        if (!inserted) {
            throw new IllegalStateException("Failed to create MatchSegment 1.");
        }

        result.incrementMatchSegmentsCreated();
        result.addMessage("MatchSegment 1 seed created.");
    }
}
