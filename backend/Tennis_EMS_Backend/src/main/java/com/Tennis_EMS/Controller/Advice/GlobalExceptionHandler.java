package com.Tennis_EMS.Controller.Advice;

import com.Tennis_EMS.DTO.ErrorResponseDTO;
import com.Tennis_EMS.Exception.AppException;
import jakarta.servlet.http.HttpServletRequest;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.time.OffsetDateTime;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;

@RestControllerAdvice
public class GlobalExceptionHandler {

    private static final Logger log = LoggerFactory.getLogger(GlobalExceptionHandler.class);

    @ExceptionHandler(AppException.class)
    public ResponseEntity<ErrorResponseDTO> handleAppException(AppException ex,
                                                               HttpServletRequest request) {

        return build(
                ex.getStatus(),
                ex.getCode(),
                safeMessage(ex.getMessage(), ex.getStatus().getReasonPhrase()),
                request
        );
    }

    @ExceptionHandler(HttpMessageNotReadableException.class)
    public ResponseEntity<ErrorResponseDTO> handleBadJson(HttpMessageNotReadableException ex,
                                                          HttpServletRequest request) {

        return build(
                HttpStatus.BAD_REQUEST,
                "INVALID_JSON",
                "Request body is missing or malformed JSON.",
                request
        );
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ErrorResponseDTO> handleValidation(MethodArgumentNotValidException ex,
                                                             HttpServletRequest request) {
        String message = ex.getBindingResult().getFieldErrors().stream()
                .findFirst()
                .map(err -> err.getDefaultMessage() != null && !err.getDefaultMessage().isBlank()
                        ? err.getDefaultMessage()
                        : err.getField() + " is invalid.")
                .orElse("Validation failed.");
        return build(HttpStatus.BAD_REQUEST, "VALIDATION_ERROR", message, request);
    }

    /**
     * Surfaces DB constraint messages (e.g. MySQL 1048 {@code Column 'preferredName' cannot be null})
     * instead of mapping to a generic 500 response.
     */
    @ExceptionHandler(DataIntegrityViolationException.class)
    public ResponseEntity<ErrorResponseDTO> handleDataIntegrity(DataIntegrityViolationException ex,
                                                               HttpServletRequest request) {
        Throwable root = ex.getMostSpecificCause();
        String message = root != null && root.getMessage() != null && !root.getMessage().isBlank()
                ? root.getMessage().trim()
                : "Data constraint violation.";
        log.warn("Data integrity violation: {} — {}", request.getRequestURI(), message);
        return build(HttpStatus.BAD_REQUEST, "DATA_INTEGRITY", message, request);
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ErrorResponseDTO> handleGeneric(Exception ex,
                                                          HttpServletRequest request) {

        log.error("Unhandled exception: {} {}", request.getMethod(), request.getRequestURI(), ex);

        return build(
                HttpStatus.INTERNAL_SERVER_ERROR,
                "INTERNAL_ERROR",
                "An unexpected error occurred.",
                request
        );
    }

    private ResponseEntity<ErrorResponseDTO> build(HttpStatus status,
                                                   String code,
                                                   String message,
                                                   HttpServletRequest request) {

        String timestamp = OffsetDateTime
                .now(ZoneId.systemDefault())
                .format(DateTimeFormatter.ISO_OFFSET_DATE_TIME);

        String path = request == null ? null : request.getRequestURI();

        ErrorResponseDTO body = new ErrorResponseDTO(
                timestamp,
                status.value(),
                status.getReasonPhrase(),
                code,
                message,
                path
        );

        return ResponseEntity.status(status).body(body);
    }

    private String safeMessage(String msg, String fallback) {
        if (msg == null) return fallback;
        String trimmed = msg.trim();
        return trimmed.isEmpty() ? fallback : trimmed;
    }
}
