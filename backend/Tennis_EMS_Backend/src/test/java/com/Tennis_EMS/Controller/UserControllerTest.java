package com.Tennis_EMS.Controller;

import com.Tennis_EMS.DTO.EnrollmentSummaryDTO;
import com.Tennis_EMS.DTO.SectionSummaryDTO;
import com.Tennis_EMS.DTO.SessionAttendanceSummaryDTO;
import com.Tennis_EMS.DTO.SessionSummaryDTO;
import com.Tennis_EMS.DTO.UserDTO;
import com.Tennis_EMS.Service.Authorization.AuthContextService;
import com.Tennis_EMS.Service.UserService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.webmvc.test.autoconfigure.WebMvcTest;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import static org.springframework.http.MediaType.APPLICATION_JSON;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(UserController.class)
class UserControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockitoBean
    private UserService userService;

    @MockitoBean
    private AuthContextService authContextService;

    private static final String SESSION_USER_ID = AuthContextService.SESSION_KEY_USER_ID;
    private static final String SESSION_ROLE = AuthContextService.SESSION_KEY_ROLE;

    @Test
    void getAllUsers_returnsUsers() throws Exception {
        UserDTO user = new UserDTO(1, "admin@test.com", "ADMIN", true, 1, "Admin User");
        when(userService.getAllUsers(any())).thenReturn(List.of(user));

        mockMvc.perform(get("/api/users")
                        .sessionAttr(SESSION_USER_ID, 1)
                        .sessionAttr(SESSION_ROLE, "ADMIN"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$").isArray())
                .andExpect(jsonPath("$[0].userId").value(1))
                .andExpect(jsonPath("$[0].email").value("admin@test.com"))
                .andExpect(jsonPath("$[0].role").value("ADMIN"));
    }

    @Test
    void getUserById_returnsUser() throws Exception {
        UserDTO user = new UserDTO(2, "coach@test.com", "COACH", true, 1, "Coach Name");
        when(userService.getUserById(eq(2), any())).thenReturn(user);

        mockMvc.perform(get("/api/users/2")
                        .sessionAttr(SESSION_USER_ID, 1)
                        .sessionAttr(SESSION_ROLE, "ADMIN"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.userId").value(2))
                .andExpect(jsonPath("$.email").value("coach@test.com"))
                .andExpect(jsonPath("$.role").value("COACH"))
                .andExpect(jsonPath("$.displayName").value("Coach Name"));
    }

    @Test
    void getUsersByRole_returnsFilteredUsers() throws Exception {
        UserDTO student = new UserDTO(3, "student@test.com", "STUDENT", true, 1, "Student Name");
        when(userService.getUsersByRole(eq("student"), any())).thenReturn(List.of(student));

        mockMvc.perform(get("/api/users/role/student")
                        .sessionAttr(SESSION_USER_ID, 1)
                        .sessionAttr(SESSION_ROLE, "ADMIN"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$").isArray())
                .andExpect(jsonPath("$[0].role").value("STUDENT"));
    }

    @Test
    void getSectionsByStudent_returnsEnrollments() throws Exception {
        EnrollmentSummaryDTO enrollment = new EnrollmentSummaryDTO(
                1, 10, "ENROLLED", null, null, "Section A");
        when(userService.getSectionsByStudent(eq(3), any())).thenReturn(List.of(enrollment));

        mockMvc.perform(get("/api/users/3/sections")
                        .sessionAttr(SESSION_USER_ID, 1)
                        .sessionAttr(SESSION_ROLE, "ADMIN"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$").isArray())
                .andExpect(jsonPath("$[0].studentId").value(1))
                .andExpect(jsonPath("$[0].sectionId").value(10))
                .andExpect(jsonPath("$[0].sectionName").value("Section A"));
    }

    @Test
    void getAttendanceByStudent_returnsAttendance() throws Exception {
        SessionAttendanceSummaryDTO attendance = new SessionAttendanceSummaryDTO(
                5, 1, "PRESENT", "SECTION", "Student Name", "Session 5");
        when(userService.getAttendanceByStudent(eq(3), any())).thenReturn(List.of(attendance));

        mockMvc.perform(get("/api/users/3/attendance")
                        .sessionAttr(SESSION_USER_ID, 1)
                        .sessionAttr(SESSION_ROLE, "ADMIN"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$").isArray())
                .andExpect(jsonPath("$[0].sessionId").value(5))
                .andExpect(jsonPath("$[0].status").value("PRESENT"));
    }

    @Test
    void getSectionsByCoach_returnsSections() throws Exception {
        SectionSummaryDTO section = new SectionSummaryDTO(10, 1, "Section A", "ACTIVE", true, "Course 1");
        when(userService.getSectionsByCoach(eq(2), any())).thenReturn(List.of(section));

        mockMvc.perform(get("/api/users/2/coaching-sections")
                        .sessionAttr(SESSION_USER_ID, 1)
                        .sessionAttr(SESSION_ROLE, "ADMIN"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$").isArray())
                .andExpect(jsonPath("$[0].sectionId").value(10))
                .andExpect(jsonPath("$[0].name").value("Section A"));
    }

    @Test
    void getSessionsByCoach_returnsSessions() throws Exception {
        SessionSummaryDTO session = new SessionSummaryDTO(
                5, 10, null, null, "SCHEDULED", "Section A", "Course 1");
        when(userService.getSessionsByCoach(eq(2), any())).thenReturn(List.of(session));

        mockMvc.perform(get("/api/users/2/coaching-sessions")
                        .sessionAttr(SESSION_USER_ID, 1)
                        .sessionAttr(SESSION_ROLE, "ADMIN"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$").isArray())
                .andExpect(jsonPath("$[0].sessionId").value(5))
                .andExpect(jsonPath("$[0].sectionName").value("Section A"));
    }

    @Test
    void createUser_returnsCreated() throws Exception {
        String body = """
                {"email":"new@test.com","password":"secret123","role":"STUDENT","firstName":"New","lastName":"User"}
                """;
        UserDTO created = new UserDTO(10, "new@test.com", "STUDENT", true, 1, "New User");
        when(userService.createUser(any(), any())).thenReturn(created);

        mockMvc.perform(post("/api/users")
                        .contentType(APPLICATION_JSON)
                        .content(body)
                        .sessionAttr(SESSION_USER_ID, 1)
                        .sessionAttr(SESSION_ROLE, "ADMIN"))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.userId").value(10))
                .andExpect(jsonPath("$.email").value("new@test.com"))
                .andExpect(jsonPath("$.role").value("STUDENT"));
    }

    @Test
    void updateUser_returnsUpdated() throws Exception {
        String body = "{\"email\":\"updated@test.com\",\"isActive\":false}";
        UserDTO updated = new UserDTO(2, "updated@test.com", "COACH", false, 1, "Coach Name");
        when(userService.updateUser(eq(2), any(), any())).thenReturn(updated);

        mockMvc.perform(put("/api/users/2")
                        .contentType(APPLICATION_JSON)
                        .content(body)
                        .sessionAttr(SESSION_USER_ID, 1)
                        .sessionAttr(SESSION_ROLE, "ADMIN"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.email").value("updated@test.com"))
                .andExpect(jsonPath("$.isActive").value(false));
    }

    @Test
    void deleteUser_returnsNoContent() throws Exception {
        mockMvc.perform(delete("/api/users/5")
                        .sessionAttr(SESSION_USER_ID, 1)
                        .sessionAttr(SESSION_ROLE, "ADMIN"))
                .andExpect(status().isNoContent());

        verify(userService).deleteUser(eq(5), any());
    }
}
