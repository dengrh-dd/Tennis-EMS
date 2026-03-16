package com.Tennis_EMS.Exception;

import org.springframework.http.HttpStatus;

public class UnauthorizedException extends AppException {
    public UnauthorizedException(String code, String message) {
        super(HttpStatus.UNAUTHORIZED, code, message);
    }
}
