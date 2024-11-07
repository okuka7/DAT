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
public class UserServicelmpl implements UserService {
    @Autowired
    private UserRepository userRepository;

    @Autowired
    private UserMapper userMapper;
    @Autowired
    private BCryptPasswordEncoder passwordEncoder;

    @Override
    public User registerUser(UserRegistrationDto userDto){
        User user = userMapper.toEntity(userDto);
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        return userRepository.save(user);
    }

    @Override
    public Optional<User> getUserById(Long userId) {
        return userRepository.findById(userId);
    }

    @Override
    public User updateUser(Long userId,User updateUser){
        return userRepository.findById(userId)
                .map(user->{
                    user.setEmail(updateUser.getEmail());
                    return userRepository.save(user);
                }).orElseThrow(()->new RuntimeException("User not found"));
    }
}
