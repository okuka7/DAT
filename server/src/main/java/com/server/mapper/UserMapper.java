package com.server.mapper;

import com.server.dto.UserRegistrationDto;
import com.server.entity.User;
import org.springframework.stereotype.Component;

@Component
public class UserMapper {

    public User toEntity(UserRegistrationDto dto) {
        User user = new User();
        user.setUsername(dto.getUsername());
        user.setPassword(dto.getPassword());
        user.setEmail(dto.getEmail());

        // role을 기본값인 SILVER로 설정
        user.setRole(User.Role.SILVER);

        return user;
    }
}
