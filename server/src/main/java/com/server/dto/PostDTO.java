package com.server.dto;

import com.server.entity.Post;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
public class PostDTO {

    private Long id;
    private String title;
    private String content;
    private Long authorId;      // 작성자의 ID
    private String authorName;   // 작성자의 이름 (username)
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private String imageUrl;     // 이미지 URL

    // 기본 생성자
    public PostDTO() {}



    // Post 엔티티를 기반으로 PostDto 생성자 작성
    public PostDTO(Long id, String title, String content, Long authorId, String authorName,
                   LocalDateTime createdAt, LocalDateTime updatedAt, String imageUrl) {
        this.id = id;
        this.title = title;
        this.content = content;
        this.authorId = authorId;
        this.authorName = authorName;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
        this.imageUrl = imageUrl;
    }

    public PostDTO(Post post) {
        this.id = post.getId();
        this.title = post.getTitle();
        this.content = post.getContent();
        this.authorId = post.getAuthor().getId();
        this.imageUrl = post.getImageUrl();
        this.createdAt = post.getCreatedAt();
        this.updatedAt = post.getUpdatedAt();
        // 필요에 따라 추가 필드 초기화
    }



}
