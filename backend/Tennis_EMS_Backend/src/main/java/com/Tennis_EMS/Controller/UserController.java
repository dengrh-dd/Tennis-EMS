package com.Tennis_EMS.Controller;

import com.Tennis_EMS.DTO.Account.CreateAccountRequestDTO;
import com.Tennis_EMS.DTO.EnrollmentSummaryDTO;
import com.Tennis_EMS.DTO.SectionSummaryDTO;
import com.Tennis_EMS.DTO.SessionAttendanceSummaryDTO;
import com.Tennis_EMS.DTO.SessionSummaryDTO;
import com.Tennis_EMS.DTO.UpdateUserRequestDTO;
import com.Tennis_EMS.DTO.UserDTO;
import com.Tennis_EMS.Service.UserService;
import jakarta.servlet.http.HttpSession;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping
    public ResponseEntity<List<UserDTO>> getAllUsers(HttpSession session) {
        List<UserDTO> list = userService.getAllUsers(session);
        return ResponseEntity.ok(list);
    }

    @PostMapping
    public ResponseEntity<UserDTO> createUser(@Valid @RequestBody CreateAccountRequestDTO request, HttpSession session) {
        UserDTO created = userService.createUser(request, session);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @GetMapping("/{id}")
    public ResponseEntity<UserDTO> getUserById(@PathVariable int id, HttpSession session) {
        UserDTO user = userService.getUserById(id, session);
        return ResponseEntity.ok(user);
    }

    @PutMapping("/{id}")
    public ResponseEntity<UserDTO> updateUser(@PathVariable int id,
                                              @RequestBody UpdateUserRequestDTO request,
                                              HttpSession session) {
        UserDTO updated = userService.updateUser(id, request, session);
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteUser(@PathVariable int id, HttpSession session) {
        userService.deleteUser(id, session);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/role/{role}")
    public ResponseEntity<List<UserDTO>> getUsersByRole(@PathVariable String role, HttpSession session) {
        List<UserDTO> list = userService.getUsersByRole(role, session);
        return ResponseEntity.ok(list);
    }

    @GetMapping("/{id}/sections")
    public ResponseEntity<List<EnrollmentSummaryDTO>> getSectionsByStudent(
            @PathVariable int id,
            HttpSession session) {
        List<EnrollmentSummaryDTO> list = userService.getSectionsByStudent(id, session);
        return ResponseEntity.ok(list);
    }

    @GetMapping("/{id}/attendance")
    public ResponseEntity<List<SessionAttendanceSummaryDTO>> getAttendanceByStudent(
            @PathVariable int id,
            HttpSession session) {
        List<SessionAttendanceSummaryDTO> list = userService.getAttendanceByStudent(id, session);
        return ResponseEntity.ok(list);
    }

    @GetMapping("/{id}/coaching-sections")
    public ResponseEntity<List<SectionSummaryDTO>> getSectionsByCoach(
            @PathVariable int id,
            HttpSession session) {
        List<SectionSummaryDTO> list = userService.getSectionsByCoach(id, session);
        return ResponseEntity.ok(list);
    }

    @GetMapping("/{id}/coaching-sessions")
    public ResponseEntity<List<SessionSummaryDTO>> getSessionsByCoach(
            @PathVariable int id,
            HttpSession session) {
        List<SessionSummaryDTO> list = userService.getSessionsByCoach(id, session);
        return ResponseEntity.ok(list);
    }
}
