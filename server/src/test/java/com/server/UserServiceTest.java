package com.server;

import com.server.dto.UserRegistrationDto;
import com.server.entity.User;
import com.server.mapper.UserMapper;
import com.server.repository.UserRepository;
import com.server.service.UserService;
import com.server.service.UserServiceImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;


class UserServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private UserMapper userMapper;

    @Mock
    private BCryptPasswordEncoder passwordEncoder;

    @InjectMocks
    private UserServiceImpl userService;

    private User user;
    private UserRegistrationDto userDto;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        user = new User();
        user.setId(1L);
        user.setUsername("testuser");
        user.setPassword("encodedpassword");
        user.setEmail("testuser@example.com");

        userDto = new UserRegistrationDto();
        userDto.setUsername("testuser");
        userDto.setPassword("Password1!");
        userDto.setEmail("testuser@example.com");
    }

    @Test
    void shouldRegisterUser() {
        // 비밀번호 암호화에 대한 mock 동작 설정
        when(passwordEncoder.encode(anyString())).thenReturn("encodedpassword");

        when(userMapper.toEntity(any(UserRegistrationDto.class))).thenReturn(user);
        when(userRepository.save(any(User.class))).thenReturn(user);

        User registeredUser = userService.registerUser(userDto);

        assertNotNull(registeredUser);
        assertEquals("encodedpassword", registeredUser.getPassword());
        verify(userRepository, times(1)).save(any(User.class));
    }

    @Test
    void shouldReturnUserById() {
        when(userRepository.findById(1L)).thenReturn(Optional.of(user));

        Optional<User> foundUser = userService.getUserById(1L);

        assertTrue(foundUser.isPresent());
        assertEquals("testuser", foundUser.get().getUsername());
        verify(userRepository, times(1)).findById(1L);
    }

    @Test
    void shouldUpdateUser() {
        when(userRepository.findById(1L)).thenReturn(Optional.of(user));
        when(userRepository.save(any(User.class))).thenReturn(user);

        User updatedUser = new User();
        updatedUser.setEmail("newemail@example.com");

        User result = userService.updateUser(1L, updatedUser);

        assertEquals("newemail@example.com", result.getEmail());
        verify(userRepository, times(1)).save(user);
    }
}
