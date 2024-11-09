package com.server.service;

import com.server.dto.UserRegistrationDto;
import com.server.entity.User;
import com.server.mapper.UserMapper;
import com.server.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class UserServiceImpl implements UserService {
    @Autowired
    private UserRepository userRepository;

    @Autowired
    private UserMapper userMapper;

    @Autowired
    private BCryptPasswordEncoder passwordEncoder;

    @Override
    public User registerUser(UserRegistrationDto userDto) {
        // UserRegistrationDto에서 role을 가져오지 않으면 기본값인 SILVER로 설정
        if (userDto.getRole() == null) {
            userDto.setRole(User.Role.SILVER);  // 기본값을 SILVER로 설정
        }

        // User 엔티티로 변환
        User user = userMapper.toEntity(userDto);
        user.setPassword(passwordEncoder.encode(user.getPassword())); // 비밀번호 암호화

        // 엔티티에 role 설정
        user.setRole(userDto.getRole()); // DTO에서 전달된 role 값을 설정

        // 사용자 저장
        return userRepository.save(user);
    }

    @Override
    public Optional<User> getUserById(Long userId) {
        return userRepository.findById(userId);
    }

    @Override
    public User updateUser(Long userId, User updateUser) {
        return userRepository.findById(userId)
                .map(user -> {
                    user.setEmail(updateUser.getEmail());
                    return userRepository.save(user);
                }).orElseThrow(() -> new RuntimeException("User not found"));
    }

    @Override
    public boolean authenticate(String username, String password) {
        Optional<User> user = userRepository.findByUsername(username);
        return user.isPresent() && passwordEncoder.matches(password, user.get().getPassword());
    }

    @Override
    public Optional<User> getUserByUsername(String username) {
        System.out.println("Fetched user from service: " + username);
        return userRepository.findByUsername(username); // findByUsername 메서드가 UserRepository에 있어야 합니다.
    }
}
