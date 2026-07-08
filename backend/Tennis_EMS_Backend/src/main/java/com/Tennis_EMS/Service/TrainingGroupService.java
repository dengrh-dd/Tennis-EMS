package com.Tennis_EMS.Service;

import com.Tennis_EMS.DAO.StudentDAO;
import com.Tennis_EMS.DAO.TrainingGroupDAO;
import com.Tennis_EMS.DAO.TrainingGroupMemberDAO;
import com.Tennis_EMS.DTO.AddTrainingGroupMemberRequestDTO;
import com.Tennis_EMS.DTO.CreateTrainingGroupRequestDTO;
import com.Tennis_EMS.DTO.TrainingGroupDTO;
import com.Tennis_EMS.DTO.TrainingGroupMemberDTO;
import com.Tennis_EMS.DTO.UpdateTrainingGroupMemberRequestDTO;
import com.Tennis_EMS.DTO.UpdateTrainingGroupRequestDTO;
import com.Tennis_EMS.Entity.Student;
import com.Tennis_EMS.Entity.TrainingGroup;
import com.Tennis_EMS.Entity.TrainingGroupMember;
import com.Tennis_EMS.Entity.User;
import com.Tennis_EMS.Exception.BadRequestException;
import com.Tennis_EMS.Exception.ForbiddenException;
import com.Tennis_EMS.Exception.NotFoundException;
import com.Tennis_EMS.Service.Authorization.AuthContextService;
import com.Tennis_EMS.Service.Authorization.AuthorizationService;
import jakarta.servlet.http.HttpSession;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.format.DateTimeParseException;
import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;

@Service
public class TrainingGroupService {

    private final TrainingGroupDAO trainingGroupDAO;
    private final TrainingGroupMemberDAO trainingGroupMemberDAO;
    private final StudentDAO studentDAO;
    private final AuthContextService authContextService;
    private final AuthorizationService authorizationService;
    private final IdentityService identityService;

    public TrainingGroupService(TrainingGroupDAO trainingGroupDAO,
                                TrainingGroupMemberDAO trainingGroupMemberDAO,
                                StudentDAO studentDAO,
                                AuthContextService authContextService,
                                AuthorizationService authorizationService,
                                IdentityService identityService) {
        this.trainingGroupDAO = trainingGroupDAO;
        this.trainingGroupMemberDAO = trainingGroupMemberDAO;
        this.studentDAO = studentDAO;
        this.authContextService = authContextService;
        this.authorizationService = authorizationService;
        this.identityService = identityService;
    }

    public List<TrainingGroupDTO> getAllGroups(HttpSession session) {
        var ctx = authContextService.requireContext(session);
        authorizationService.requireAdminOrCoach(ctx.role());

        return trainingGroupDAO.getAll().stream()
                .map(this::toTrainingGroupDTO)
                .collect(Collectors.toList());
    }

    public TrainingGroupDTO getGroupById(int groupId, HttpSession session) {
        var ctx = authContextService.requireContext(session);
        authorizationService.requireAdminOrCoach(ctx.role());

        TrainingGroup group = requireGroup(groupId);
        return toTrainingGroupDTO(group);
    }

    public List<TrainingGroupDTO> getActiveGroups(HttpSession session) {
        var ctx = authContextService.requireContext(session);
        authorizationService.requireAdminOrCoach(ctx.role());

        return trainingGroupDAO.getActive().stream()
                .map(this::toTrainingGroupDTO)
                .collect(Collectors.toList());
    }

    public List<TrainingGroupDTO> getGroupsByType(String type, HttpSession session) {
        var ctx = authContextService.requireContext(session);
        authorizationService.requireAdminOrCoach(ctx.role());

        TrainingGroup.GroupType parsedType = parseGroupType(type);
        if (parsedType == null) {
            throw new BadRequestException("VALIDATION_ERROR", "Group type is required.");
        }

        return trainingGroupDAO.getByType(parsedType).stream()
                .map(this::toTrainingGroupDTO)
                .collect(Collectors.toList());
    }

    public TrainingGroupDTO createGroup(CreateTrainingGroupRequestDTO request, HttpSession session) {
        var ctx = authContextService.requireContext(session);
        authorizationService.requireAdmin(ctx.role());

        if (request == null) {
            throw new BadRequestException("VALIDATION_ERROR", "Request body is required.");
        }
        if (request.getName() == null || request.getName().trim().isEmpty()) {
            throw new BadRequestException("VALIDATION_ERROR", "Group name is required.");
        }

        TrainingGroup.GroupType parsedType = parseGroupType(request.getGroupType());
        if (parsedType == null) {
            parsedType = TrainingGroup.GroupType.TRAINING_GROUP;
        }

        TrainingGroup entity = new TrainingGroup();
        entity.setName(request.getName().trim());
        entity.setGroupType(parsedType);
        entity.setDescription(request.getDescription());
        entity.setIsActive(true);

        int id = trainingGroupDAO.insert(entity);
        if (id <= 0) {
            throw new BadRequestException("GROUP_CREATE_FAILED", "Failed to create training group.");
        }

        TrainingGroup created = trainingGroupDAO.getById(id);
        if (created == null) {
            throw new NotFoundException("GROUP_NOT_FOUND", "Training group not found after creation.");
        }

        return toTrainingGroupDTO(created);
    }

    public TrainingGroupDTO updateGroup(int groupId, UpdateTrainingGroupRequestDTO request, HttpSession session) {
        var ctx = authContextService.requireContext(session);
        authorizationService.requireAdmin(ctx.role());

        TrainingGroup group = requireGroup(groupId);

        if (request == null) {
            throw new BadRequestException("VALIDATION_ERROR", "Request body is required.");
        }

        if (request.getName() != null) {
            if (request.getName().trim().isEmpty()) {
                throw new BadRequestException("VALIDATION_ERROR", "Group name cannot be blank.");
            }
            group.setName(request.getName().trim());
        }
        if (request.getDescription() != null) {
            group.setDescription(request.getDescription());
        }
        if (request.getIsActive() != null) {
            group.setIsActive(request.getIsActive());
        }

        boolean updated = trainingGroupDAO.update(group);
        if (!updated) {
            throw new BadRequestException("GROUP_UPDATE_FAILED", "Failed to update training group.");
        }

        TrainingGroup refreshed = requireGroup(groupId);
        return toTrainingGroupDTO(refreshed);
    }

    public void deleteGroup(int groupId, HttpSession session) {
        var ctx = authContextService.requireContext(session);
        authorizationService.requireAdmin(ctx.role());

        requireGroup(groupId);
        boolean deleted = trainingGroupDAO.delete(groupId);
        if (!deleted) {
            throw new BadRequestException("GROUP_DELETE_FAILED", "Failed to delete training group.");
        }
    }

    public List<TrainingGroupMemberDTO> getMembersByGroup(int groupId, HttpSession session) {
        var ctx = authContextService.requireContext(session);
        authorizationService.requireAdminOrCoach(ctx.role());

        requireGroup(groupId);
        return trainingGroupMemberDAO.getByGroup(groupId).stream()
                .map(this::toTrainingGroupMemberDTO)
                .collect(Collectors.toList());
    }

    public List<TrainingGroupMemberDTO> getActiveMembersByGroup(int groupId, HttpSession session) {
        var ctx = authContextService.requireContext(session);
        authorizationService.requireAdminOrCoach(ctx.role());

        requireGroup(groupId);
        return trainingGroupMemberDAO.getActiveByGroup(groupId).stream()
                .map(this::toTrainingGroupMemberDTO)
                .collect(Collectors.toList());
    }

    public List<TrainingGroupMemberDTO> getMembershipsByStudent(int studentId, HttpSession session) {
        var ctx = authContextService.requireContext(session);
        if (ctx.role() == User.Role.STUDENT) {
            Integer self = identityService.getProfileId(ctx.userId(), User.Role.STUDENT);
            if (self == null || !Objects.equals(self, studentId)) {
                throw new ForbiddenException("FORBIDDEN", "You can only view your own group memberships.");
            }
        } else {
            authorizationService.requireAdminOrCoach(ctx.role());
        }

        requireStudentExists(studentId);
        return trainingGroupMemberDAO.getByStudent(studentId).stream()
                .map(this::toTrainingGroupMemberDTO)
                .collect(Collectors.toList());
    }

    public TrainingGroupMemberDTO addMemberToGroup(int groupId,
                                                   AddTrainingGroupMemberRequestDTO request,
                                                   HttpSession session) {
        var ctx = authContextService.requireContext(session);
        authorizationService.requireAdminOrCoach(ctx.role());

        TrainingGroup group = requireGroup(groupId);
        if (!Boolean.TRUE.equals(group.getIsActive())) {
            throw new BadRequestException("GROUP_INACTIVE", "Cannot add members to an inactive group.");
        }
        if (request == null) {
            throw new BadRequestException("VALIDATION_ERROR", "Request body is required.");
        }
        if (request.getStudentId() == null) {
            throw new BadRequestException("VALIDATION_ERROR", "Student ID is required.");
        }

        requireStudentExists(request.getStudentId());

        TrainingGroupMember existing = trainingGroupMemberDAO.get(groupId, request.getStudentId());
        if (existing != null) {
            throw new BadRequestException("MEMBERSHIP_EXISTS", "Student is already a member of this group.");
        }

        LocalDate startDate = parseDate(request.getStartDate(), "startDate");
        LocalDate endDate = parseDate(request.getEndDate(), "endDate");
        if (startDate != null && endDate != null && endDate.isBefore(startDate)) {
            throw new BadRequestException("VALIDATION_ERROR", "endDate cannot be earlier than startDate.");
        }

        TrainingGroupMember member = new TrainingGroupMember();
        member.setGroupId(groupId);
        member.setStudentId(request.getStudentId());
        member.setStartDate(startDate);
        member.setEndDate(endDate);

        boolean inserted = trainingGroupMemberDAO.insert(member);
        if (!inserted) {
            throw new BadRequestException("MEMBERSHIP_CREATE_FAILED", "Failed to add member to training group.");
        }

        TrainingGroupMember created = requireMembership(groupId, request.getStudentId());
        return toTrainingGroupMemberDTO(created);
    }

    public TrainingGroupMemberDTO updateMemberDates(int groupId,
                                                    int studentId,
                                                    UpdateTrainingGroupMemberRequestDTO request,
                                                    HttpSession session) {
        var ctx = authContextService.requireContext(session);
        authorizationService.requireAdminOrCoach(ctx.role());

        requireGroup(groupId);
        TrainingGroupMember current = requireMembership(groupId, studentId);

        if (request == null) {
            throw new BadRequestException("VALIDATION_ERROR", "Request body is required.");
        }

        LocalDate startDate = request.getStartDate() != null
                ? parseDate(request.getStartDate(), "startDate")
                : current.getStartDate();
        LocalDate endDate = request.getEndDate() != null
                ? parseDate(request.getEndDate(), "endDate")
                : current.getEndDate();

        if (startDate != null && endDate != null && endDate.isBefore(startDate)) {
            throw new BadRequestException("VALIDATION_ERROR", "endDate cannot be earlier than startDate.");
        }

        boolean updated = trainingGroupMemberDAO.updateDates(groupId, studentId, startDate, endDate);
        if (!updated) {
            throw new BadRequestException("MEMBERSHIP_UPDATE_FAILED", "Failed to update membership dates.");
        }

        TrainingGroupMember refreshed = requireMembership(groupId, studentId);
        return toTrainingGroupMemberDTO(refreshed);
    }

    public void removeMemberFromGroup(int groupId, int studentId, HttpSession session) {
        var ctx = authContextService.requireContext(session);
        authorizationService.requireAdminOrCoach(ctx.role());

        requireGroup(groupId);
        requireMembership(groupId, studentId);

        boolean deleted = trainingGroupMemberDAO.delete(groupId, studentId);
        if (!deleted) {
            throw new BadRequestException("MEMBERSHIP_DELETE_FAILED", "Failed to remove member from training group.");
        }
    }

    private TrainingGroup requireGroup(int groupId) {
        TrainingGroup group = trainingGroupDAO.getById(groupId);
        if (group == null) {
            throw new NotFoundException("GROUP_NOT_FOUND", "Training group not found.");
        }
        return group;
    }

    private TrainingGroupMember requireMembership(int groupId, int studentId) {
        TrainingGroupMember member = trainingGroupMemberDAO.get(groupId, studentId);
        if (member == null) {
            throw new NotFoundException("MEMBERSHIP_NOT_FOUND", "Training group membership not found.");
        }
        return member;
    }

    private TrainingGroup.GroupType parseGroupType(String type) {
        if (type == null || type.trim().isEmpty()) {
            return null;
        }
        try {
            return TrainingGroup.GroupType.valueOf(type.trim().toUpperCase());
        } catch (IllegalArgumentException ex) {
            throw new BadRequestException("VALIDATION_ERROR",
                    "Invalid groupType. Supported: TRAINING_GROUP, CLASS_GROUP, CLUB_TEAM.");
        }
    }

    private void requireStudentExists(int studentId) {
        Student student = studentDAO.getById(studentId);
        if (student == null) {
            throw new NotFoundException("STUDENT_NOT_FOUND", "Student not found.");
        }
    }

    private LocalDate parseDate(String value, String fieldName) {
        if (value == null || value.trim().isEmpty()) {
            return null;
        }
        try {
            return LocalDate.parse(value.trim());
        } catch (DateTimeParseException ex) {
            throw new BadRequestException("VALIDATION_ERROR",
                    "Invalid date format for " + fieldName + ". Use yyyy-MM-dd.");
        }
    }

    private TrainingGroupDTO toTrainingGroupDTO(TrainingGroup group) {
        return new TrainingGroupDTO(
                group.getGroupId(),
                group.getName(),
                group.getGroupTypeStr(),
                group.getDescription(),
                group.getIsActive()
        );
    }

    private TrainingGroupMemberDTO toTrainingGroupMemberDTO(TrainingGroupMember member) {
        return new TrainingGroupMemberDTO(
                member.getGroupId(),
                member.getStudentId(),
                member.getStartDate() != null ? member.getStartDate().toString() : null,
                member.getEndDate() != null ? member.getEndDate().toString() : null,
                member.isActive()
        );
    }
}
