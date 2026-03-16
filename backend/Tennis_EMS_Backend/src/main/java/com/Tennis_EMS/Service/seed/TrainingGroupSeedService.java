package com.Tennis_EMS.Service.seed;

import com.Tennis_EMS.DAO.TrainingGroupDAO;
import com.Tennis_EMS.DAO.TrainingGroupMemberDAO;
import com.Tennis_EMS.DTO.SeedResultDTO;
import com.Tennis_EMS.Entity.TrainingGroup;
import com.Tennis_EMS.Entity.TrainingGroupMember;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
public class TrainingGroupSeedService {

    private final TrainingGroupDAO trainingGroupDAO;
    private final TrainingGroupMemberDAO trainingGroupMemberDAO;
    private final UserSeedService userSeedService;

    public TrainingGroupSeedService(TrainingGroupDAO trainingGroupDAO,
                                    TrainingGroupMemberDAO trainingGroupMemberDAO,
                                    UserSeedService userSeedService) {
        this.trainingGroupDAO = trainingGroupDAO;
        this.trainingGroupMemberDAO = trainingGroupMemberDAO;
        this.userSeedService = userSeedService;
    }

    public void seedTrainingGroupSystem(SeedResultDTO result) {
        int studentId = userSeedService.getRequiredStudentIdByEmail("student@test.com");

        int groupId = seedTrainingGroupBeginner(result);
        seedTrainingGroupMember(result, groupId, studentId);
    }

    private int seedTrainingGroupBeginner(SeedResultDTO result) {
        final String groupName = "Beginner Training Group A";
        final TrainingGroup.GroupType groupType = TrainingGroup.GroupType.TRAINING_GROUP;

        List<TrainingGroup> groups = trainingGroupDAO.getAll();
        if (groups != null) {
            for (TrainingGroup existing : groups) {
                if (existing != null
                        && groupName.equals(existing.getName())
                        && existing.getGroupType() == groupType) {
                    result.addMessage("TrainingGroup already exists: " + groupName);
                    return existing.getGroupId();
                }
            }
        }

        TrainingGroup group = new TrainingGroup();
        group.setName(groupName);
        group.setGroupType(groupType);
        group.setDescription("Seeded training group for local development.");
        group.setIsActive(true);

        int groupId = trainingGroupDAO.insert(group);
        result.incrementTrainingGroupsCreated();
        result.addMessage("TrainingGroup seed created: " + groupName);
        return groupId;
    }

    private void seedTrainingGroupMember(SeedResultDTO result, int groupId, int studentId) {
        TrainingGroupMember existing = trainingGroupMemberDAO.get(groupId, studentId);
        if (existing != null) {
            result.addMessage("TrainingGroupMember already exists: groupId = " + groupId
                    + ", studentId = " + studentId);
            return;
        }

        TrainingGroupMember member = new TrainingGroupMember();
        member.setGroupId(groupId);
        member.setStudentId(studentId);
        member.setStartDate(LocalDate.now());
        member.setEndDate(null);

        boolean inserted = trainingGroupMemberDAO.insert(member);
        if (!inserted) {
            throw new IllegalStateException("Failed to create TrainingGroupMember.");
        }

        result.incrementTrainingGroupMembersCreated();
        result.addMessage("TrainingGroupMember seed created.");
    }
}
