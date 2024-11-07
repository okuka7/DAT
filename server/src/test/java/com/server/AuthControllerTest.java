package com.server;

import com.server.controller.AuthController;
import com.server.dto.UserLoginDto;
import com.server.dto.response.ApiResponse;
import com.server.security.JwtTokenProvider;
import com.server.service.UserService;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.when;

@SpringBootTest
public class AuthControllerTest {

    @Mock
    private UserService userService;

    @Mock
    private JwtTokenProvider jwtTokenProvider;

    @InjectMocks
    private AuthController authController;

    @Test
    public void testLoginSuccess() {
        UserLoginDto userLoginDto = new UserLoginDto();
        userLoginDto.setUsername("testuser");
        userLoginDto.setPassword("testpassword");

        when(userService.authenticate("testuser", "testpassword")).thenReturn(true);
        when(jwtTokenProvider.generateToken("testuser")).thenReturn("test-token");

        ResponseEntity<ApiResponse<String>> response = authController.login(userLoginDto);

        assertEquals(200, response.getStatusCodeValue());
        assertEquals("로그인 성공", response.getBody().getMessage());
        assertEquals("test-token", response.getBody().getData());
    }

    @Test
    public void testLoginFailure() {
        UserLoginDto userLoginDto = new UserLoginDto();
        userLoginDto.setUsername("testuser");
        userLoginDto.setPassword("wrongpassword");

        when(userService.authenticate("testuser", "wrongpassword")).thenReturn(false);

        ResponseEntity<ApiResponse<String>> response = authController.login(userLoginDto);

        assertEquals(401, response.getStatusCodeValue());
        assertEquals("로그인 실패", response.getBody().getMessage());
    }
}
