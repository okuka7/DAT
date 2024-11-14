package com.server.service;

import com.server.dto.PostDTO;
import com.server.entity.Post;
import com.server.entity.Tag;
import com.server.entity.User;
import com.server.repository.PostRepository;
import com.server.repository.TagRepository;
import com.server.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashSet;
import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class PostService {

    @Autowired
    private PostRepository postRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private TagRepository tagRepository;

    @Transactional
    public PostDTO createPost(Long userId, Post post, Set<String> tagNames) {
        System.out.println("Post imageUrl: " + post.getImageUrl()); // 이미지 URL 확인
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        post.setAuthor(user);

        // 태그 처리
        Set<Tag> tags = tagNames.stream().map(tagName -> {
            return tagRepository.findByName(tagName)
                    .orElseGet(() -> {
                        Tag newTag = new Tag();
                        newTag.setName(tagName);
                        return tagRepository.save(newTag);
                    });
        }).collect(Collectors.toSet());

        post.setTags(tags);

        Post savedPost = postRepository.save(post);

        return new PostDTO(savedPost);
    }

    public Optional<PostDTO> getPostById(Long id) {
        return postRepository.findById(id).map(PostDTO::new);
    }

    public PostDTO updatePost(Long id, PostDTO updatedPostDTO) {
        Post existingPost = postRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Post not found"));

        existingPost.setTitle(updatedPostDTO.getTitle());
        existingPost.setContent(updatedPostDTO.getContent());
        existingPost.setImageUrl(updatedPostDTO.getImageUrl());

        // 태그 업데이트 처리
        if (updatedPostDTO.getTags() != null) {
            Set<Tag> tags = updatedPostDTO.getTags().stream().map(tagName -> {
                return tagRepository.findByName(tagName)
                        .orElseGet(() -> {
                            Tag newTag = new Tag();
                            newTag.setName(tagName);
                            return tagRepository.save(newTag);
                        });
            }).collect(Collectors.toSet());
            existingPost.setTags(tags);
        }

        Post savedPost = postRepository.save(existingPost);
        return new PostDTO(savedPost);
    }

    public void deletePost(Long id) {
        postRepository.deleteById(id);
    }

    public List<PostDTO> getAllPosts() {
        return postRepository.findAll().stream()
                .map(PostDTO::new)
                .collect(Collectors.toList());
    }

    public List<PostDTO> getPostsByTag(String tagName) {
        Tag tag = tagRepository.findByName(tagName)
                .orElseThrow(() -> new RuntimeException("Tag not found"));

        List<Post> posts = postRepository.findByTagsContaining(tag);
        return posts.stream().map(PostDTO::new).collect(Collectors.toList());
    }

    public List<PostDTO> getLatestPosts(int limit) {
        Pageable pageable = PageRequest.of(0, limit, Sort.by("createdAt").descending());
        List<Post> posts = postRepository.findAllByOrderByCreatedAtDesc(pageable);
        return posts.stream().map(PostDTO::new).collect(Collectors.toList());
    }
}
