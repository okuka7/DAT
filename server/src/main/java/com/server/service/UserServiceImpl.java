package com.server.service;

import com.server.dto.UserRegistrationDto;
import com.server.entity.Post;
import com.server.entity.User;
import com.server.mapper.UserMapper;
import com.server.repository.PostRepository;
import com.server.repository.UserRepository;
import com.server.service.UserService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
// 기타 import 생략

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class UserServiceImpl implements UserService {

    private static final Logger logger = LoggerFactory.getLogger(UserServiceImpl.class);

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private UserMapper userMapper;

    @Autowired
    private BCryptPasswordEncoder passwordEncoder;

    @Autowired
    private PostRepository postRepository;

    @Override
    public User registerUser(UserRegistrationDto userDto) {
        logger.info("사용자 등록 시작: username={}", userDto.getUsername());

        if (userRepository.findByUsername(userDto.getUsername()).isPresent()) {
            logger.warn("이미 존재하는 회원입니다: username={}", userDto.getUsername());
            throw new RuntimeException("이미 존재하는 회원입니다.");
        }

        // UserRegistrationDto에서 role을 가져오지 않으면 기본값인 SILVER로 설정
        if (userDto.getRole() == null) {
            userDto.setRole(User.Role.SILVER);  // 기본값을 SILVER로 설정
            logger.debug("기본 역할 설정: SILVER");
        }

        // User 엔티티로 변환
        User user = userMapper.toEntity(userDto);
        user.setPassword(passwordEncoder.encode(user.getPassword())); // 비밀번호 암호화
        logger.debug("비밀번호 암호화 완료: username={}", userDto.getUsername());

        // 엔티티에 role 설정
        user.setRole(userDto.getRole()); // DTO에서 전달된 role 값을 설정
        logger.debug("사용자 역할 설정: {}", userDto.getRole());

        // 사용자 저장
        User savedUser = userRepository.save(user);
        logger.info("사용자 등록 완료: userId={}, username={}", savedUser.getId(), savedUser.getUsername());

        return savedUser;
    }

    @Override
    public Optional<User> getUserById(Long userId) {
        logger.info("사용자 조회 요청: userId={}", userId);
        Optional<User> userOpt = userRepository.findById(userId);
        if (userOpt.isPresent()) {
            logger.debug("사용자 조회 성공: userId={}, username={}", userId, userOpt.get().getUsername());
        } else {
            logger.warn("사용자 찾을 수 없음: userId={}", userId);
        }
        return userOpt;
    }

    @Override
    public User updateUser(Long userId, User updateUser) {
        logger.info("사용자 정보 수정 시작: userId={}", userId);
        return userRepository.findById(userId)
                .map(user -> {
                    user.setEmail(updateUser.getEmail());
                    logger.debug("사용자 이메일 수정: userId={}, email={}", userId, updateUser.getEmail());
                    User savedUser = userRepository.save(user);
                    logger.info("사용자 정보 수정 완료: userId={}", userId);
                    return savedUser;
                }).orElseThrow(() -> {
                    logger.error("사용자 찾을 수 없음: userId={}", userId);
                    return new RuntimeException("User not found");
                });
    }

    @Override
    public boolean authenticate(String username, String password) {
        logger.info("사용자 인증 시도: username={}", username);
        Optional<User> user = userRepository.findByUsername(username);
        boolean isAuthenticated = user.isPresent() && passwordEncoder.matches(password, user.get().getPassword());
        if (isAuthenticated) {
            logger.info("사용자 인증 성공: username={}", username);
        } else {
            logger.warn("사용자 인증 실패: username={}", username);
        }
        return isAuthenticated;
    }

    @Override
    public Optional<User> getUserByUsername(String username) {
        logger.info("사용자 조회 요청: username={}", username);
        Optional<User> userOpt = userRepository.findByUsername(username);
        if (userOpt.isPresent()) {
            logger.debug("사용자 조회 성공: username={}", username);
        } else {
            logger.warn("사용자 찾을 수 없음: username={}", username);
        }
        return userOpt;
    }

    @Override
    public Post createPost(Long userId, Post post) {
        logger.info("게시물 생성 요청: userId={}, title={}", userId, post.getTitle());

        // 사용자를 조회하고, 해당 사용자를 글 작성자로 설정
        User user = userRepository.findById(userId)
                .orElseThrow(() -> {
                    logger.error("사용자 찾을 수 없음: userId={}", userId);
                    return new RuntimeException("User not found");
                });

        post.setAuthor(user); // 작성자 설정
        logger.debug("게시물 작성자 설정: userId={}, username={}", userId, user.getUsername());

        Post savedPost = postRepository.save(post);
        logger.info("게시물 생성 완료: postId={}", savedPost.getId());

        return savedPost;
    }
}
