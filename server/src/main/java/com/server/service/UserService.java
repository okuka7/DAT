package com.server.service;

import com.server.dto.UserRegistrationDto;
import com.server.entity.User;
import java.util.Optional;

public interface UserService {
    User registerUser(UserRegistrationDto userDto);
    Optional<User> getUserById(Long userId);
    User updateUser(Long userId, User updatedUser);

    boolean authenticate(String username, String password);

    Optional<User> getUserByUsername(String username);
}
