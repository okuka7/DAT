package com.server.exception;

import com.server.dto.response.ApiResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

@ControllerAdvice
public class GlobalExceptionHandler {
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ApiResponse<Object>> handleValidationExceptions(MethodArgumentNotValidException ex) {
        String errorMessage = ex.getBindingResult().getAllErrors().get(0).getDefaultMessage();
        return ResponseEntity.badRequest().body(new ApiResponse<>(false, errorMessage, null));
    }


    @ExceptionHandler(RuntimeException.class)
    public ResponseEntity<ApiResponse<Object>> handleRuntimeExceptions(RuntimeException ex) {
        return ResponseEntity.status(500)
                .body(new ApiResponse<>(false, "서버 오류가 발생했습니다.", null));
    }
}
