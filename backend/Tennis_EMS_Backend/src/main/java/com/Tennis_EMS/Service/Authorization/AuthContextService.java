package com.Tennis_EMS.Service.Authorization;

import com.Tennis_EMS.Entity.User;
import com.Tennis_EMS.Exception.UnauthorizedException;
import jakarta.servlet.http.HttpSession;
import org.springframework.stereotype.Service;

@Service
public class AuthContextService {

    public static final String SESSION_KEY_USER_ID = "EMS_USER_ID";
    public static final String SESSION_KEY_ROLE = "EMS_ROLE";

    public record AuthContext(int userId, User.Role role) {}

    public AuthContext requireContext(HttpSession session) {
        if (session == null) {
            throw new UnauthorizedException("AUTH_NOT_LOGGED_IN", "No active session.");
        }

        Object userIdObj = session.getAttribute(SESSION_KEY_USER_ID);
        Object roleObj = session.getAttribute(SESSION_KEY_ROLE);

        if (!(userIdObj instanceof Integer userId) || roleObj == null) {
            throw new UnauthorizedException("AUTH_NOT_LOGGED_IN", "You are not logged in.");
        }

        User.Role role = parseRole(roleObj);
        return new AuthContext(userId, role);
    }

    public int requireUserId(HttpSession session) {
        return requireContext(session).userId();
    }

    public User.Role requireRole(HttpSession session) {
        return requireContext(session).role();
    }

    public boolean isLoggedIn(HttpSession session) {
        if (session == null) return false;
        Object userIdObj = session.getAttribute(SESSION_KEY_USER_ID);
        Object roleObj = session.getAttribute(SESSION_KEY_ROLE);
        if (!(userIdObj instanceof Integer)) return false;
        if (roleObj == null) return false;

        try {
            parseRole(roleObj);
            return true;
        } catch (UnauthorizedException ex) {
            return false;
        }
    }

    private User.Role parseRole(Object roleObj) {
        if (roleObj instanceof User.Role r) {
            return r;
        }

        if (roleObj instanceof String s) {
            try {
                return User.Role.valueOf(s);
            } catch (IllegalArgumentException ex) {
                throw new UnauthorizedException("AUTH_INVALID_SESSION", "Invalid role in session.");
            }
        }

        throw new UnauthorizedException("AUTH_INVALID_SESSION", "Invalid role in session.");
    }
}
