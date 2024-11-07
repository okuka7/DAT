package com.server;

import com.server.controller.UserController;
import com.server.dto.UserRegistrationDto;
import com.server.dto.response.ApiResponse;
import com.server.entity.User;
import com.server.service.UserService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.http.ResponseEntity;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

class UserControllerTest {

    @Mock
    private UserService userService;

    @InjectMocks
    private UserController userController;

    private User user;
    private UserRegistrationDto userDto;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        user = new User();
        user.setId(1L);
        user.setUsername("testuser");
        user.setEmail("testuser@example.com");

        userDto = new UserRegistrationDto();
        userDto.setUsername("testuser");
        userDto.setPassword("Password1!");
        userDto.setEmail("testuser@example.com");
    }

    // 회원가입 테스트
    @Test
    void shouldRegisterUser() {
        when(userService.registerUser(any(UserRegistrationDto.class))).thenReturn(user);

        ResponseEntity<ApiResponse<User>> response = userController.registerUser(userDto);

        assertEquals(200, response.getStatusCodeValue());
        assertTrue(response.getBody().isSuccess());
        assertEquals("회원가입 성공", response.getBody().getMessage());
        assertEquals("testuser", response.getBody().getData().getUsername());
        verify(userService, times(1)).registerUser(any(UserRegistrationDto.class));
    }

    // 사용자 조회 성공 테스트
    @Test
    void shouldReturnUserById() {
        when(userService.getUserById(1L)).thenReturn(Optional.of(user));

        ResponseEntity<ApiResponse<User>> response = userController.getUser(1L);

        assertEquals(200, response.getStatusCodeValue());
        assertTrue(response.getBody().isSuccess());
        assertEquals("사용자 조회 성공", response.getBody().getMessage());
        assertEquals("testuser", response.getBody().getData().getUsername());
        verify(userService, times(1)).getUserById(1L);
    }

    // 사용자 조회 실패 테스트
    @Test
    void shouldReturnNotFoundForNonExistentUser() {
        when(userService.getUserById(1L)).thenReturn(Optional.empty());

        ResponseEntity<ApiResponse<User>> response = userController.getUser(1L);

        assertEquals(404, response.getStatusCodeValue());
        assertFalse(response.getBody().isSuccess());
        assertEquals("사용자 조회 실패했습니다.", response.getBody().getMessage());
        verify(userService, times(1)).getUserById(1L);
    }

    // 사용자 정보 수정 테스트
    @Test
    void shouldUpdateUser() {
        when(userService.updateUser(eq(1L), any(User.class))).thenReturn(user);

        User updatedUser = new User();
        updatedUser.setEmail("newemail@example.com");

        ResponseEntity<ApiResponse<User>> response = userController.updateUser(1L, updatedUser);

        assertEquals(200, response.getStatusCodeValue());
        assertTrue(response.getBody().isSuccess());
        assertEquals("사용자 조회성공", response.getBody().getMessage());
        assertEquals("testuser", response.getBody().getData().getUsername());
        verify(userService, times(1)).updateUser(eq(1L), any(User.class));
    }

    // 사용자 정보 수정 실패 테스트
    @Test
    void shouldReturnNotFoundWhenUpdatingNonExistentUser() {
        when(userService.updateUser(eq(1L), any(User.class))).thenThrow(new RuntimeException("User not found"));

        User updatedUser = new User();
        updatedUser.setEmail("newemail@example.com");

        ResponseEntity<ApiResponse<User>> response = userController.updateUser(1L, updatedUser);

        assertEquals(404, response.getStatusCodeValue());
        assertFalse(response.getBody().isSuccess());
        assertEquals("사용자를 찾을 수 없습니다.", response.getBody().getMessage());
        verify(userService, times(1)).updateUser(eq(1L), any(User.class));
    }
}
