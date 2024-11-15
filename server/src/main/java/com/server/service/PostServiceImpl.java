// src/main/java/com/server/service/PostServiceImpl.java

package com.server.service;

import com.server.dto.PostDTO;
import com.server.entity.Post;
import com.server.entity.Tag;
import com.server.entity.User;
import com.server.mapper.PostMapper;
import com.server.repository.PostRepository;
import com.server.repository.TagRepository;
import com.server.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class PostServiceImpl implements PostService {

    @Autowired
    private PostRepository postRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private TagRepository tagRepository;

    @Autowired
    private PostMapper postMapper;

    /**
     * 새로운 게시물을 생성합니다.
     *
     * @param userId   작성자의 사용자 ID
     * @param post     게시물 엔티티
     * @param tagNames 태그 이름들의 집합
     * @return 생성된 게시물의 DTO
     */
    @Override
    @Transactional
    public PostDTO createPost(Long userId, Post post, Set<String> tagNames) {
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

    /**
     * 특정 ID의 게시물을 조회합니다.
     *
     * @param id 게시물 ID
     * @return 게시물의 DTO를 Optional로 반환
     */
    @Override
    public Optional<PostDTO> getPostById(Long id) {
        return postRepository.findById(id).map(PostDTO::new);
    }

    /**
     * 특정 태그를 가진 게시물들을 조회합니다.
     *
     * @param tagName 태그 이름
     * @return 게시물 DTO들의 리스트
     */
    @Override
    public List<PostDTO> getPostsByTag(String tagName) {
        Tag tag = tagRepository.findByName(tagName)
                .orElseThrow(() -> new RuntimeException("Tag not found"));

        List<Post> posts = postRepository.findByTags_Name(tagName);
        return posts.stream().map(PostDTO::new).collect(Collectors.toList());
    }

    /**
     * 모든 게시물을 조회합니다.
     *
     * @return 모든 게시물 DTO들의 리스트
     */
    @Override
    public List<PostDTO> getAllPosts() {
        return postRepository.findAll().stream()
                .map(PostDTO::new)
                .collect(Collectors.toList());
    }

    /**
     * 최신 게시물들을 조회합니다.
     *
     * @param limit 조회할 게시물의 수
     * @return 최신 게시물 DTO들의 리스트
     */
    @Override
    public List<PostDTO> getLatestPosts(int limit) {
        Pageable pageable = PageRequest.of(0, limit, Sort.by("createdAt").descending());
        List<Post> posts = postRepository.findAllByOrderByCreatedAtDesc(pageable);
        return posts.stream().map(PostDTO::new).collect(Collectors.toList());
    }

    /**
     * 기존 게시물을 수정합니다.
     *
     * @param id             게시물 ID
     * @param updatedPostDTO 수정된 게시물의 DTO
     * @return 수정된 게시물의 DTO
     */
    @Override
    @Transactional
    public PostDTO updatePost(Long id, PostDTO updatedPostDTO) {
        Post existingPost = postRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Post not found"));

        existingPost.setTitle(updatedPostDTO.getTitle());
        existingPost.setContent(updatedPostDTO.getContent());

        // Set status
        try {
            existingPost.setStatus(Post.Status.valueOf(updatedPostDTO.getStatus()));
        } catch (IllegalArgumentException | NullPointerException e) {
            throw new RuntimeException("Invalid or missing status value");
        }

        // Handle image URL
        existingPost.setImageUrl(updatedPostDTO.getImageUrl());

        // Handle tags
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

    /**
     * 특정 ID의 게시물을 삭제합니다.
     *
     * @param id 게시물 ID
     */
    @Override
    public void deletePost(Long id) {
        if (!postRepository.existsById(id)) {
            throw new RuntimeException("Post not found");
        }
        postRepository.deleteById(id);
    }
}
