package com.Tennis_EMS.Controller;

import com.Tennis_EMS.DTO.AddTrainingGroupMemberRequestDTO;
import com.Tennis_EMS.DTO.CreateTrainingGroupRequestDTO;
import com.Tennis_EMS.DTO.TrainingGroupDTO;
import com.Tennis_EMS.DTO.TrainingGroupMemberDTO;
import com.Tennis_EMS.DTO.UpdateTrainingGroupMemberRequestDTO;
import com.Tennis_EMS.DTO.UpdateTrainingGroupRequestDTO;
import com.Tennis_EMS.Service.TrainingGroupService;
import jakarta.servlet.http.HttpSession;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/training-groups")
public class TrainingGroupController {

    private final TrainingGroupService trainingGroupService;

    public TrainingGroupController(TrainingGroupService trainingGroupService) {
        this.trainingGroupService = trainingGroupService;
    }

    @GetMapping
    public ResponseEntity<List<TrainingGroupDTO>> getAllGroups(HttpSession session) {
        List<TrainingGroupDTO> list = trainingGroupService.getAllGroups(session);
        return ResponseEntity.ok(list);
    }

    @GetMapping("/active")
    public ResponseEntity<List<TrainingGroupDTO>> getActiveGroups(HttpSession session) {
        List<TrainingGroupDTO> list = trainingGroupService.getActiveGroups(session);
        return ResponseEntity.ok(list);
    }

    @GetMapping("/type/{type}")
    public ResponseEntity<List<TrainingGroupDTO>> getGroupsByType(@PathVariable String type, HttpSession session) {
        List<TrainingGroupDTO> list = trainingGroupService.getGroupsByType(type, session);
        return ResponseEntity.ok(list);
    }

    @GetMapping("/{id}")
    public ResponseEntity<TrainingGroupDTO> getGroupById(@PathVariable int id, HttpSession session) {
        TrainingGroupDTO dto = trainingGroupService.getGroupById(id, session);
        return ResponseEntity.ok(dto);
    }

    @PostMapping
    public ResponseEntity<TrainingGroupDTO> createGroup(@RequestBody CreateTrainingGroupRequestDTO request,
                                                        HttpSession session) {
        TrainingGroupDTO created = trainingGroupService.createGroup(request, session);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @PutMapping("/{id}")
    public ResponseEntity<TrainingGroupDTO> updateGroup(@PathVariable int id,
                                                        @RequestBody UpdateTrainingGroupRequestDTO request,
                                                        HttpSession session) {
        TrainingGroupDTO updated = trainingGroupService.updateGroup(id, request, session);
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteGroup(@PathVariable int id, HttpSession session) {
        trainingGroupService.deleteGroup(id, session);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{groupId}/members")
    public ResponseEntity<List<TrainingGroupMemberDTO>> getMembersByGroup(@PathVariable int groupId,
                                                                           HttpSession session) {
        List<TrainingGroupMemberDTO> list = trainingGroupService.getMembersByGroup(groupId, session);
        return ResponseEntity.ok(list);
    }

    @GetMapping("/{groupId}/members/active")
    public ResponseEntity<List<TrainingGroupMemberDTO>> getActiveMembersByGroup(@PathVariable int groupId,
                                                                                 HttpSession session) {
        List<TrainingGroupMemberDTO> list = trainingGroupService.getActiveMembersByGroup(groupId, session);
        return ResponseEntity.ok(list);
    }

    @GetMapping("/student/{studentId}")
    public ResponseEntity<List<TrainingGroupMemberDTO>> getMembershipsByStudent(@PathVariable int studentId,
                                                                                 HttpSession session) {
        List<TrainingGroupMemberDTO> list = trainingGroupService.getMembershipsByStudent(studentId, session);
        return ResponseEntity.ok(list);
    }

    @PostMapping("/{groupId}/members")
    public ResponseEntity<TrainingGroupMemberDTO> addMemberToGroup(@PathVariable int groupId,
                                                                   @RequestBody AddTrainingGroupMemberRequestDTO request,
                                                                   HttpSession session) {
        TrainingGroupMemberDTO created = trainingGroupService.addMemberToGroup(groupId, request, session);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @PutMapping("/{groupId}/members/{studentId}")
    public ResponseEntity<TrainingGroupMemberDTO> updateMemberDates(@PathVariable int groupId,
                                                                    @PathVariable int studentId,
                                                                    @RequestBody UpdateTrainingGroupMemberRequestDTO request,
                                                                    HttpSession session) {
        TrainingGroupMemberDTO updated = trainingGroupService.updateMemberDates(groupId, studentId, request, session);
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/{groupId}/members/{studentId}")
    public ResponseEntity<Void> removeMemberFromGroup(@PathVariable int groupId,
                                                      @PathVariable int studentId,
                                                      HttpSession session) {
        trainingGroupService.removeMemberFromGroup(groupId, studentId, session);
        return ResponseEntity.noContent().build();
    }
}
