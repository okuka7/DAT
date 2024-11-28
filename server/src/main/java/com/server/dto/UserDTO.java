package com.server.dto;

import com.server.entity.User;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UserDTO {
    private Long id;
    private String username;
    private String email;
    private User.Role role;

    public UserDTO(Long id, String username, String email, User.Role role) {
        this.id = id;
        this.username = username;
        this.email = email;
        this.role = role;
    }
}
