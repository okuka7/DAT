// com.server.entity.Tag.java
package com.server.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.util.HashSet;
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
    @ManyToMany(mappedBy = "tags", fetch = FetchType.LAZY)
    private Set<Post> posts = new HashSet<>();
    // 기본 생성자
    public Tag() {
        this.posts = new HashSet<>();
    }

    // 이름을 매개변수로 받는 생성자 (선택 사항)
    public Tag(String name) {
        this.name = name;
        this.posts = new HashSet<>();
    }
}
