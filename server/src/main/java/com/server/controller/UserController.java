package com.server.controller;

import com.server.dto.UserRegistrationDto;
import com.server.dto.request.UserRequestDto;
import com.server.dto.response.ApiResponse;
import com.server.entity.User;
import com.server.service.UserService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/users")
public class UserController {
    @Autowired
    private UserService userService;

    @PostMapping("/register")
    public ResponseEntity<ApiResponse<User>> registerUser(@Valid @RequestBody UserRegistrationDto userDto) {
        User newUser = userService.registerUser(userDto);
        return ResponseEntity.ok(new ApiResponse<>(true,"회원가입 성공",newUser));
    }

    @GetMapping("/{userId}")
    public ResponseEntity<ApiResponse<User>> getUser(@PathVariable Long userId) {
        Optional<User> user = userService.getUserById(userId);
        return user.map(value -> ResponseEntity.ok(new ApiResponse<>(true,"사용자 조회 성공",value)))
                .orElseGet(()-> ResponseEntity.status(404).body(new ApiResponse<>(false,"사용자 조회 실패했습니다.",null)));
    }

    public ResponseEntity<ApiResponse<User>> updateUser(@PathVariable long userId,@RequestBody User updateUser){
        try {
            User user = userService.updateUser(userId,updateUser);
            return ResponseEntity.ok(new ApiResponse<>(true,"사용자 조회성공",user));
        }catch (RuntimeException e){
            return ResponseEntity.status(404).body(new ApiResponse<>(false,"사용자를 찾을 수 없습니다.",null));
        }

    }
    @GetMapping("/getLoginUser")
    public ResponseEntity<ApiResponse<User>> getCurrentUser(@AuthenticationPrincipal UserDetails userDetails) {
        if (userDetails != null) {
            Optional<User> user = userService.getUserByUsername(userDetails.getUsername());
            return user.map(value -> ResponseEntity.ok(new ApiResponse<>(true, "사용자 정보 조회 성공", value)))
                    .orElseGet(() -> ResponseEntity.status(404).body(new ApiResponse<>(false, "사용자 정보를 찾을 수 없습니다.", null)));
        }
        return ResponseEntity.status(401).body(new ApiResponse<>(false, "로그인되지 않았습니다.", null));
    }

}
