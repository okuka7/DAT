package com.server.exception;

import com.server.dto.response.ApiResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

@ControllerAdvice
public class GlobalExceptionHandler {

    // SLF4J Logger 인스턴스 생성
    private static final Logger logger = LoggerFactory.getLogger(GlobalExceptionHandler.class);

    /**
     * MethodArgumentNotValidException 처리
     *
     * @param ex 예외 객체
     * @return ApiResponse 응답
     */
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ApiResponse<Object>> handleValidationExceptions(MethodArgumentNotValidException ex) {
        // 첫 번째 검증 오류 메시지 추출
        String errorMessage = ex.getBindingResult().getAllErrors().get(0).getDefaultMessage();

        // WARN 레벨로 검증 실패 로그 기록
        logger.warn("Validation failed: {}", errorMessage, ex);

        return ResponseEntity.badRequest().body(new ApiResponse<>(false, errorMessage, null));
    }

    /**
     * RuntimeException 처리
     *
     * @param ex 예외 객체
     * @return ApiResponse 응답
     */
    @ExceptionHandler(RuntimeException.class)
    public ResponseEntity<ApiResponse<Object>> handleRuntimeExceptions(RuntimeException ex) {
        // ERROR 레벨로 예외 로그 기록 (스택 트레이스 포함)
        logger.error("Runtime exception occurred: {}", ex.getMessage(), ex);

        return ResponseEntity.status(500)
                .body(new ApiResponse<>(false, "서버 오류가 발생했습니다.", null));
    }

    /**
     * 기타 모든 예외 처리
     *
     * @param ex 예외 객체
     * @return ApiResponse 응답
     */
    @ExceptionHandler(Exception.class)
    public ResponseEntity<ApiResponse<Object>> handleAllExceptions(Exception ex) {
        // ERROR 레벨로 예외 로그 기록 (스택 트레이스 포함)
        logger.error("An unexpected error occurred: {}", ex.getMessage(), ex);

        return ResponseEntity.status(500)
                .body(new ApiResponse<>(false, "예기치 않은 오류가 발생했습니다.", null));
    }
}
