package com.Tennis_EMS.Service.Authorization;

import com.Tennis_EMS.Entity.User;
import com.Tennis_EMS.Exception.ForbiddenException;
import org.springframework.stereotype.Service;

import java.util.Arrays;

@Service
public class AuthorizationService {

    public void requireRole(User.Role actual, User.Role... allowed) {
        if (actual == null) {
            throw new ForbiddenException("AUTH_FORBIDDEN", "Access denied.");
        }

        if (allowed == null || allowed.length == 0) {
            throw new ForbiddenException("AUTH_FORBIDDEN", "Access denied.");
        }

        boolean ok = Arrays.asList(allowed).contains(actual);
        if (!ok) {
            throw new ForbiddenException("AUTH_FORBIDDEN", "Access denied.");
        }
    }

    public void requireSelf(int actualUserId, int ownerUserId) {
        if (actualUserId != ownerUserId) {
            throw new ForbiddenException("AUTH_NOT_OWNER", "You can only access your own resource.");
        }
    }

    public void requireAdmin(User.Role actual) {
        requireRole(actual, User.Role.ADMIN);
    }

    public void requireAdminOrSelf(User.Role actualRole, int actualUserId, int ownerUserId) {
        if (actualRole == User.Role.ADMIN) {
            return;
        }
        requireSelf(actualUserId, ownerUserId);
    }

    public void requireAdminOrCoach(User.Role actualRole) {
        requireRole(actualRole, User.Role.ADMIN, User.Role.COACH);
    }

    public void requireAdminOrCoachOrStudent(User.Role actualRole) {
        requireRole(actualRole, User.Role.ADMIN, User.Role.COACH, User.Role.STUDENT);
    }
}
