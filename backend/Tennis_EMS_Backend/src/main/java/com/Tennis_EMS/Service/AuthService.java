package com.Tennis_EMS.Service;

import com.Tennis_EMS.DAO.UserDAO;
import com.Tennis_EMS.DTO.CurrentUserDTO;
import com.Tennis_EMS.DTO.LoginResponseDTO;
import com.Tennis_EMS.Entity.User;
import com.Tennis_EMS.Exception.BadRequestException;
import com.Tennis_EMS.Exception.ForbiddenException;
import com.Tennis_EMS.Exception.UnauthorizedException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import jakarta.servlet.http.HttpSession;

@Service
public class AuthService {

    public static final String SESSION_USER_ID = "EMS_USER_ID";
    public static final String SESSION_ROLE = "EMS_ROLE";

    private final UserDAO userDAO;
    private final PasswordEncoder passwordEncoder;
    private final IdentityService identityService;

    public AuthService(UserDAO userDAO,
                       PasswordEncoder passwordEncoder,
                       IdentityService identityService) {
        this.userDAO = userDAO;
        this.passwordEncoder = passwordEncoder;
        this.identityService = identityService;
    }

    public LoginResponseDTO login(String email, String password, HttpSession session) {
        if (session == null) {
            throw new BadRequestException("VALIDATION_ERROR", "Session cannot be null or empty.");
        }
        if (email == null || email.trim().isEmpty()) {
            throw new BadRequestException("VALIDATION_ERROR", "Email cannot be null or empty.");
        }
        if (password == null || password.trim().isEmpty()) {
            throw new BadRequestException("VALIDATION_ERROR", "Password cannot be null or empty.");
        }

        User user = userDAO.getByEmail(email.trim());
        if (user == null) {
            throw new UnauthorizedException("AUTH_INVALID_CREDENTIALS", "The email entered has not signed up yet.");
        }

        if (user.getIsActive() != null && !user.getIsActive()) {
            throw new ForbiddenException("AUTH_INACTIVE_ACCOUNT", "User account is inactive.");
        }

        String hash = user.getPasswordHash();
        if (hash == null || hash.trim().isEmpty()) {
            throw new BadRequestException("VALIDATION_ERROR", "User passwordHash cannot be null or empty.");
        }

        boolean ok = passwordEncoder.matches(password, hash);
        if (!ok) {
            throw new UnauthorizedException("AUTH_INVALID_CREDENTIALS", "Password Incorrect");
        }

        if (user.getUserId() == null) {
            throw new UnauthorizedException("AUTH_INVALID_CREDENTIALS", "UserId is missing.");
        }
        if (user.getRole() == null) {
            throw new UnauthorizedException("AUTH_INVALID_CREDENTIALS", "User role is missing.");
        }

        int userId = user.getUserId();
        User.Role role = user.getRole();

        session.setAttribute(SESSION_USER_ID, userId);
        session.setAttribute(SESSION_ROLE, role.name());

        Integer profileId = identityService.getProfileId(userId, role);
        String displayName = identityService.getDisplayName(userId, role);

        return new LoginResponseDTO(
                userId,
                user.getEmail(),
                role.name(),
                profileId,
                displayName
        );
    }

    public void logout(HttpSession session) {
        if (session == null) {
            return;
        }
        session.invalidate();
    }

    public CurrentUserDTO currentUser(HttpSession session) {
        if (session == null) {
            return null;
        }

        Object userIdObj = session.getAttribute(SESSION_USER_ID);
        Object roleObj = session.getAttribute(SESSION_ROLE);

        if (!(userIdObj instanceof Integer) || !(roleObj instanceof String)) {
            return null;
        }

        int userId = (Integer) userIdObj;
        String roleStr = (String) roleObj;
        User.Role role = User.Role.parse(roleStr);

        if (role == null) {
            return null;
        }

        User user = userDAO.getById(userId);
        if (user == null) {
            return null;
        }

        Integer profileId = identityService.getProfileId(userId, role);
        String displayName = identityService.getDisplayName(userId, role);

        return new CurrentUserDTO(
                userId,
                user.getEmail(),
                role.name(),
                profileId,
                displayName
        );
    }
}
