package com.server.dto;

import com.server.entity.User;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UserRegistrationDto {

    @NotBlank(message = "아이디는 필수 입력 항목입니다.")
    @Size(min = 4, max = 20, message = "아이디는 4자 이상 20자 이하로 입력해야 합니다.")
    private String username;

    @NotBlank(message = "비밀번호는 필수 입력 항목입니다.")
    @Pattern(regexp = "^(?=.*[A-Z])(?=.*[!@#$&*])(?=.*[0-9]).{8,}$",
            message = "비밀번호는 8자 이상, 대문자, 숫자 및 특수 문자를 포함해야 합니다.")
    private String password;

    @NotBlank(message = "이메일은 필수 입력 항목입니다.")
    @Email(message = "유효한 이메일 주소를 입력해야 합니다.")
    private String email;

    // role을 추가하여 등급을 받아올 수 있게 합니다.
    private User.Role role = User.Role.SILVER; // 기본값을 실버로 설정

    private String quizQuestion;
    private String userAnswer;
}
