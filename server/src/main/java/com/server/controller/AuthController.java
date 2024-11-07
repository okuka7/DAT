package com.server.controller;

import com.server.dto.UserLoginDto;
import com.server.dto.response.ApiResponse;
import com.server.security.JwtTokenProvider;
import com.server.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth")
public class AuthController {
    @Autowired
    private UserService userService;

    @Autowired
    private JwtTokenProvider jwtTokenProvider;

    @PostMapping("/login")
    public ResponseEntity<ApiResponse<String>> login(@RequestBody UserLoginDto userLoginDto){
        if(userService.authenticate(userLoginDto.getUsername(),userLoginDto.getPassword())){
            String token = jwtTokenProvider.generateToken(userLoginDto.getUsername());
            return ResponseEntity.ok(new ApiResponse<>(true,"로그인 성공",token));
        }else {
            return ResponseEntity.status(401).body(new ApiResponse<>(false,"로그인 실패",null));
        }
    }
}
