// src/main/java/com/server/dto/PostDTO.java

package com.server.dto;

import com.server.entity.Post;
import com.server.entity.Tag;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.Set;
import java.util.stream.Collectors;

@Getter
@Setter
public class PostDTO {

    private Long id;
    private String title;
    private String content;
    private Long authorId;      // 작성자의 ID
    private String authorName;  // 작성자의 이름 (username)
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private String imageUrl;    // 이미지 URL
    private Set<String> tags;   // 태그 이름들의 집합
    private String status;      // status 필드 추가

    // 기본 생성자
    public PostDTO() {}

    // 모든 필드를 포함하는 생성자
    public PostDTO(Long id, String title, String content, Long authorId, String authorName,
                   LocalDateTime createdAt, LocalDateTime updatedAt, String imageUrl, Set<String> tags, String status) {
        this.id = id;
        this.title = title;
        this.content = content;
        this.authorId = authorId;
        this.authorName = authorName;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
        this.imageUrl = imageUrl;
        this.tags = tags;
        this.status = status;
    }

    // Post 엔티티를 기반으로 하는 생성자
    public PostDTO(Post post) {
        this.id = post.getId();
        this.title = post.getTitle();
        this.content = post.getContent();
        this.authorId = post.getAuthor().getId();
        this.authorName = post.getAuthor().getUsername(); // 추가된 부분
        this.imageUrl = post.getImageUrl();
        this.createdAt = post.getCreatedAt();
        this.updatedAt = post.getUpdatedAt();
        this.tags = post.getTags().stream()
                .map(Tag::getName)
                .collect(Collectors.toSet());
        this.status = post.getStatus().name(); // status 필드 설정
    }
}
