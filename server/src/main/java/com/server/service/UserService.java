package com.server.service;

import com.server.dto.UserRegistrationDto;
import com.server.entity.Post;
import com.server.entity.User;
import java.util.Optional;

public interface UserService {
    User registerUser(UserRegistrationDto userDto);
    Optional<User> getUserById(Long userId);
    User updateUser(Long userId, User updatedUser);

    boolean authenticate(String username, String password);

    Optional<User> getUserByUsername(String username);

    // 글 작성 시, 작성자를 자동으로 설정하여 글을 작성하는 메서드 추가
    Post createPost(Long userId, Post post);
}
