package com.server.service;

import com.server.entity.User;
import com.server.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class UserServiceTest {

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private UserService userService;

    private User user;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        user = new User();
        user.setId(1L);
        user.setUsername("testuser");
        user.setPassword("password");
        user.setEmail("testuser@example.com");
    }

    @Test
    void shouldReturnAllUsers() {
        List<User> users = Arrays.asList(user);
        when(userRepository.findAll()).thenReturn(users);

        List<User> result = userService.getAllUser();

        assertEquals(1, result.size());
        assertEquals("testuser", result.get(0).getUsername());
        verify(userRepository, times(1)).findAll();
    }

    @Test
    void shouldSaveUser() {
        when(userRepository.save(user)).thenReturn(user);

        User savedUser = userService.saveUser(user);

        assertNotNull(savedUser);
        assertEquals("testuser", savedUser.getUsername());
        verify(userRepository, times(1)).save(user);
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
    void shouldDeleteUserById() {
        userService.deleteUserById(1L);
        verify(userRepository, times(1)).deleteById(1L);
    }
}
