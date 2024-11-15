// src/main/java/com/server/mapper/PostMapper.java

package com.server.mapper;

import com.server.dto.PostDTO;
import com.server.entity.Post;
import com.server.entity.Tag;
import org.springframework.stereotype.Component;

import java.util.Set;
import java.util.stream.Collectors;

@Component
public class PostMapper {

    public PostDTO toDto(Post post) {
        PostDTO dto = new PostDTO();
        dto.setId(post.getId());
        dto.setTitle(post.getTitle());
        dto.setContent(post.getContent());
        dto.setStatus(post.getStatus().name()); // status 매핑 추가
        dto.setImageUrl(post.getImageUrl());
        dto.setAuthorId(post.getAuthor().getId());
        dto.setAuthorName(post.getAuthor().getUsername());

        if (post.getTags() != null) {
            Set<String> tagNames = post.getTags().stream()
                    .map(Tag::getName)
                    .collect(Collectors.toSet());
            dto.setTags(tagNames);
        }

        dto.setCreatedAt(post.getCreatedAt());
        dto.setUpdatedAt(post.getUpdatedAt());

        return dto;
    }

    public Post toEntity(PostDTO dto) {
        Post post = new Post();
        post.setId(dto.getId());
        post.setTitle(dto.getTitle());
        post.setContent(dto.getContent());
        post.setStatus(Post.Status.valueOf(dto.getStatus())); // status 매핑 추가
        post.setImageUrl(dto.getImageUrl());

        // Tags는 별도로 처리하거나 필요에 따라 추가합니다.

        return post;
    }
}
