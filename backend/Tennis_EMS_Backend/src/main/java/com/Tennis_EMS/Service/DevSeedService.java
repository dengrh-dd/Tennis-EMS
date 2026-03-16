package com.Tennis_EMS.Service;

import com.Tennis_EMS.DTO.SeedResultDTO;
import com.Tennis_EMS.Service.seed.CourseSeedService;
import com.Tennis_EMS.Service.seed.MatchSeedService;
import com.Tennis_EMS.Service.seed.TrainingGroupSeedService;
import com.Tennis_EMS.Service.seed.UserSeedService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class DevSeedService {

    private final UserSeedService userSeedService;
    private final CourseSeedService courseSeedService;
    private final MatchSeedService matchSeedService;
    private final TrainingGroupSeedService trainingGroupSeedService;

    public DevSeedService(UserSeedService userSeedService,
                          CourseSeedService courseSeedService,
                          MatchSeedService matchSeedService,
                          TrainingGroupSeedService trainingGroupSeedService) {
        this.userSeedService = userSeedService;
        this.courseSeedService = courseSeedService;
        this.matchSeedService = matchSeedService;
        this.trainingGroupSeedService = trainingGroupSeedService;
    }

    @Transactional
    public SeedResultDTO seedUsersOnly() {
        SeedResultDTO result = new SeedResultDTO();
        userSeedService.seedUsers(result);
        result.setSuccess(true);
        result.addMessage("User seed completed.");
        return result;
    }

    @Transactional
    public SeedResultDTO seedUsersAndCourses() {
        SeedResultDTO result = new SeedResultDTO();
        userSeedService.seedUsers(result);
        courseSeedService.seedCourseSystem(result);
        result.setSuccess(true);
        result.addMessage("User + course seed completed.");
        return result;
    }

    @Transactional
    public SeedResultDTO seedAll() {
        SeedResultDTO result = new SeedResultDTO();
        userSeedService.seedUsers(result);

        CourseSeedService.CourseSeedContext courseContext = courseSeedService.seedCourseSystem(result);

        matchSeedService.seedMatchSystem(result, courseContext.getSessionId());
        trainingGroupSeedService.seedTrainingGroupSystem(result);

        result.setSuccess(true);
        result.addMessage("Full seed completed.");
        return result;
    }
}