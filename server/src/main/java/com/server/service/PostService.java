// src/main/java/com/server/service/PostService.java

package com.server.service;

import com.server.dto.PostDTO;
import com.server.entity.Post;

import java.util.List;
import java.util.Optional;
import java.util.Set;

public interface PostService {
    PostDTO createPost(Long userId, Post post, Set<String> tagNames);
    Optional<PostDTO> getPostById(Long id);
    List<PostDTO> getPostsByTag(String tagName);
    List<PostDTO> getAllPosts();
    List<PostDTO> getLatestPosts(int limit);
    PostDTO updatePost(Long id, PostDTO updatedPostDTO);
    void deletePost(Long id);
}
