package com.server.service;

import com.server.dto.PostDTO;
import com.server.entity.Post;
import com.server.entity.User;
import com.server.repository.PostRepository;
import com.server.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class PostService {

    @Autowired
    private PostRepository postRepository;

    @Autowired
    private UserRepository userRepository;

    @Transactional
    public PostDTO createPost(Long userId, Post post) {
        System.out.println("Post imageUrl: " + post.getImageUrl()); // 이미지 URL 확인
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        post.setAuthor(user);
        Post savedPost = postRepository.save(post);

        return convertToDTO(savedPost);
    }

    public Optional<PostDTO> getPostById(Long id) {
        return postRepository.findById(id).map(this::convertToDTO);
    }

    public PostDTO updatePost(Long id, PostDTO updatedPostDTO) {
        Post existingPost = postRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Post not found"));

        existingPost.setTitle(updatedPostDTO.getTitle());
        existingPost.setContent(updatedPostDTO.getContent());
        existingPost.setImageUrl(updatedPostDTO.getImageUrl());

        Post savedPost = postRepository.save(existingPost);
        return convertToDTO(savedPost);
    }

    public void deletePost(Long id) {
        postRepository.deleteById(id);
    }

    public List<PostDTO> getAllPosts() {
        return postRepository.findAll().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    private PostDTO convertToDTO(Post post) {
        return new PostDTO(
                post.getId(),
                post.getTitle(),
                post.getContent(),
                post.getAuthor().getId(),
                post.getAuthor().getUsername(),
                post.getCreatedAt(),
                post.getUpdatedAt(),
                post.getImageUrl()
        );
    }

    public List<PostDTO> getLatestPosts(int limit) {
        List<Post> posts = postRepository.findTop10ByOrderByCreatedAtDesc(); // 최신 10개 게시물 조회
        return posts.stream().map(post -> new PostDTO(post)).collect(Collectors.toList());
    }
}
