package com.server.service;

import com.server.entity.Post;
import com.server.entity.User;
import com.server.repository.PostRepository;
import com.server.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class PostService {

    @Autowired
    private PostRepository postRepository;
    @Autowired
    private UserRepository userRepository;


    public Post createPost(Long userId, Post post) {
        // 사용자 정보를 UserRepository에서 ID로 조회
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // 글의 작성자를 설정
        post.setAuthor(user);

        // Post를 저장하고 반환
        return postRepository.save(post);
    }

    public Optional<Post> getPostById(Long id) {
        return postRepository.findById(id);
    }

    public Post updatePost(Long id, Post updatedPost) {
        Post existingPost = postRepository.findById(id).orElseThrow(() -> new RuntimeException("Post not found"));
        existingPost.setTitle(updatedPost.getTitle());
        existingPost.setContent(updatedPost.getContent());
        existingPost.setImageUrl(updatedPost.getImageUrl());
        return postRepository.save(existingPost);
    }

    public void deletePost(Long id) {
        postRepository.deleteById(id);
    }
}
