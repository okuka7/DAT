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
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
// 기타 import 생략

import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class PostServiceImpl implements PostService {

    private static final Logger logger = LoggerFactory.getLogger(PostServiceImpl.class);

    private final PostRepository postRepository;
    private final UserRepository userRepository;
    private final TagRepository tagRepository;
    private final TagService tagService; // TagService 주입
    private final PostMapper postMapper;

    @PersistenceContext
    private EntityManager entityManager;

    @Autowired
    public PostServiceImpl(PostRepository postRepository, UserRepository userRepository,
                           TagRepository tagRepository, TagService tagService, PostMapper postMapper) {
        this.postRepository = postRepository;
        this.userRepository = userRepository;
        this.tagRepository = tagRepository;
        this.tagService = tagService;
        this.postMapper = postMapper;
    }

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
        logger.info("게시물 생성 시작: userId={}, title={}", userId, post.getTitle());

        User user = userRepository.findById(userId)
                .orElseThrow(() -> {
                    logger.error("사용자 찾을 수 없음: userId={}", userId);
                    return new RuntimeException("User not found");
                });

        post.setAuthor(user);
        logger.debug("작성자 설정: {}", user.getUsername());

        // 태그 처리
        if (tagNames != null && !tagNames.isEmpty()) {
            logger.debug("태그 처리 시작: 태그 수={}", tagNames.size());
            Set<Tag> tags = tagNames.stream().map(tagName -> {
                return tagRepository.findByName(tagName)
                        .orElseGet(() -> {
                            Tag newTag = new Tag(tagName);
                            logger.debug("새 태그 생성 및 저장: {}", tagName);
                            return tagRepository.save(newTag);
                        });
            }).collect(Collectors.toSet());

            // 양방향 관계 설정
            for (Tag tag : tags) {
                post.addTag(tag);
                logger.debug("태그 추가: {}", tag.getName());
            }
        }

        Post savedPost = postRepository.save(post);
        logger.info("게시물 생성 완료: postId={}", savedPost.getId());

        return new PostDTO(savedPost);
    }

    /**
     * 특정 ID의 게시물을 조회합니다.
     *
     * @param id 게시물 ID
     * @return 게시물의 DTO를 Optional로 반환
     */
    @Override
    @Transactional(readOnly = true)
    public Optional<PostDTO> getPostById(Long id) {
        logger.info("게시물 조회 요청: postId={}", id);

        Optional<Post> postOpt = postRepository.findById(id);

        if (postOpt.isPresent()) {
            PostDTO postDTO = new PostDTO(postOpt.get());
            logger.debug("게시물 조회 성공: postId={}", id);
            return Optional.of(postDTO);
        } else {
            logger.warn("게시물 찾을 수 없음: postId={}", id);
            return Optional.empty();
        }
    }

    /**
     * 특정 태그를 가진 게시물들을 조회합니다.
     *
     * @param tagName 태그 이름
     * @return 게시물 DTO들의 리스트
     */
    @Override
    @Transactional(readOnly = true)
    public List<PostDTO> getPostsByTag(String tagName) {
        logger.info("태그로 게시물 조회 요청: tagName={}", tagName);
        Tag tag = tagRepository.findByName(tagName)
                .orElseThrow(() -> {
                    logger.error("태그 찾을 수 없음: tagName={}", tagName);
                    return new RuntimeException("Tag not found");
                });

        Set<Post> posts = tag.getPosts();
        logger.debug("태그에 연결된 게시물 수: {}", posts.size());
        return posts.stream().map(PostDTO::new).collect(Collectors.toList());
    }

    /**
     * 모든 게시물을 조회합니다.
     *
     * @return 모든 게시물 DTO들의 리스트
     */
    @Override
    @Transactional(readOnly = true)
    public List<PostDTO> getAllPosts() {
        logger.info("모든 게시물 조회 요청");
        List<Post> posts = postRepository.findAll();
        logger.debug("조회된 게시물 수: {}", posts.size());
        return posts.stream().map(PostDTO::new).collect(Collectors.toList());
    }

    /**
     * 최신 게시물들을 조회합니다.
     *
     * @param limit 조회할 게시물의 수
     * @return 최신 게시물 DTO들의 리스트
     */
    @Override
    @Transactional(readOnly = true)
    public List<PostDTO> getLatestPosts(int limit) {
        logger.info("최신 게시물 조회 요청: limit={}", limit);
        Pageable pageable = PageRequest.of(0, limit, Sort.by("createdAt").descending());
        List<Post> posts = postRepository.findAllByOrderByCreatedAtDesc(pageable);
        logger.debug("조회된 최신 게시물 수: {}", posts.size());
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
        logger.info("게시물 수정 시작: postId={}", id);

        Post existingPost = postRepository.findById(id)
                .orElseThrow(() -> {
                    logger.error("게시물 찾을 수 없음: postId={}", id);
                    return new RuntimeException("Post not found");
                });

        existingPost.setTitle(updatedPostDTO.getTitle());
        existingPost.setContent(updatedPostDTO.getContent());
        logger.debug("게시물 제목 및 내용 수정: title={}, content length={}", updatedPostDTO.getTitle(), updatedPostDTO.getContent().length());

        // Set status
        try {
            existingPost.setStatus(Post.Status.valueOf(updatedPostDTO.getStatus()));
            logger.debug("게시물 상태 수정: {}", updatedPostDTO.getStatus());
        } catch (IllegalArgumentException | NullPointerException e) {
            logger.error("잘못된 상태 값: {}", updatedPostDTO.getStatus(), e);
            throw new RuntimeException("Invalid or missing status value");
        }

        // Handle image URL
        existingPost.setImageUrl(updatedPostDTO.getImageUrl());
        logger.debug("게시물 이미지 URL 수정: {}", updatedPostDTO.getImageUrl());

        // Handle tags
        if (updatedPostDTO.getTags() != null) {
            logger.debug("게시물 태그 수정 시작");
            // 기존 태그 제거 (양방향 관계 관리)
            Set<Tag> existingTags = new HashSet<>(existingPost.getTags());
            for (Tag tag : existingTags) {
                existingPost.removeTag(tag);
                logger.debug("태그 제거: {}", tag.getName());
                // 태그가 다른 게시물과 연결되어 있지 않다면 삭제
                tagService.deleteTagIfUnused(tag);
            }

            // 새로운 태그 추가 (양방향 관계 관리)
            Set<String> newTagNames = updatedPostDTO.getTags();
            if (newTagNames != null && !newTagNames.isEmpty()) {
                Set<Tag> newTags = newTagNames.stream().map(tagName -> {
                    return tagRepository.findByName(tagName)
                            .orElseGet(() -> {
                                Tag newTag = new Tag(tagName);
                                logger.debug("새 태그 생성 및 저장: {}", tagName);
                                return tagRepository.save(newTag);
                            });
                }).collect(Collectors.toSet());

                for (Tag tag : newTags) {
                    existingPost.addTag(tag);
                    logger.debug("태그 추가: {}", tag.getName());
                }
            }

            logger.debug("게시물 태그 수정 완료: {}", existingPost.getTags().stream().map(Tag::getName).collect(Collectors.joining(", ")));
        }

        Post savedPost = postRepository.save(existingPost);
        entityManager.flush(); // 변경 사항 강제 반영
        logger.info("게시물 수정 완료: postId={}", savedPost.getId());

        return new PostDTO(savedPost);
    }

    /**
     * 특정 ID의 게시물을 삭제합니다.
     *
     * @param id 게시물 ID
     */
    @Override
    @Transactional
    public void deletePost(Long id) {
        logger.info("게시물 삭제 시작: postId={}", id);

        Post existingPost = postRepository.findById(id)
                .orElseThrow(() -> {
                    logger.error("게시물 찾을 수 없음: postId={}", id);
                    return new RuntimeException("Post not found");
                });

        // 게시물과 연관된 태그들을 가져옵니다.
        Set<Tag> tags = new HashSet<>(existingPost.getTags());
        logger.debug("게시물에 연결된 태그 수: {}", tags.size());

        // 게시물과 태그 간의 관계를 제거합니다.
        for (Tag tag : tags) {
            existingPost.removeTag(tag);
            logger.debug("태그 제거: {}", tag.getName());
            // 태그가 다른 게시물과 연결되어 있지 않다면 삭제
            tagService.deleteTagIfUnused(tag);
        }

        // 게시물 삭제
        postRepository.delete(existingPost);
        entityManager.flush(); // 변경 사항 강제 반영
        logger.info("게시물 삭제 완료: postId={}", id);
    }
}
