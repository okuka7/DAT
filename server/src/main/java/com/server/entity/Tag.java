// com.server.entity.Tag.java
package com.server.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.util.Set;

@Getter
@Setter
@Entity
public class Tag {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String name;

    // 태그와 게시물의 다대다 관계 설정
    @ManyToMany(mappedBy = "tags")
    private Set<Post> posts;
}
