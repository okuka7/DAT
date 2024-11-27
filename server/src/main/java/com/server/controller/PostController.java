// src/main/java/com/server/controller/PostController.java

package com.server.controller;

import com.server.dto.PostDTO;
import com.server.entity.Post;
import com.server.entity.User;
import com.server.service.FileUploadService;
import com.server.service.PostService;
import com.server.service.UserService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.*;

@RestController
@RequestMapping("/api/posts")
public class PostController {

    private static final Logger logger = LoggerFactory.getLogger(PostController.class);

    @Autowired
    private PostService postService;

    @Autowired
    private FileUploadService fileUploadService;

    @Autowired
    private UserService userService;

    // 게시물 생성
    // src/main/java/com/server/controller/PostController.java

    @PostMapping
    public ResponseEntity<?> createPost(
            @RequestParam("title") String title,
            @RequestParam("content") String content,
            @RequestParam(value = "status", required = false, defaultValue = "PUBLIC") String status,
            @RequestParam(value = "image", required = false) MultipartFile image,
            @RequestParam(value = "tags", required = false) List<String> tags,
            @AuthenticationPrincipal UserDetails userDetails) {
        try {
            // 현재 로그인한 사용자 정보 조회
            String username = userDetails.getUsername();
            Optional<User> userOpt = userService.getUserByUsername(username);
            if (!userOpt.isPresent()) {
                return ResponseEntity.status(404).body("User not found");
            }
            User author = userOpt.get();

            // 등급 확인
            if (!"GOLD".equalsIgnoreCase(author.getRole().name())) {
                return ResponseEntity.status(403).body("GOLD 등급 사용자만 글쓰기가 가능합니다.");
            }

            // 이미지 파일 업로드 처리 (optional)
            String imageUrl = null;
            if (image != null && !image.isEmpty()) {
                imageUrl = fileUploadService.uploadFile(image);
                System.out.println("업로드된 이미지 URL: " + imageUrl);
            }

            // 글 작성
            Post post = new Post();
            post.setTitle(title);
            post.setContent(content);
            post.setAuthor(author); // 작성자 설정
            post.setImageUrl(imageUrl); // 이미지 URL 설정

            // 상태 설정
            try {
                post.setStatus(Post.Status.valueOf(status));
            } catch (IllegalArgumentException e) {
                return ResponseEntity.badRequest().body("Invalid status value: " + status); // 구체적인 오류 메시지 반환
            }

            // 태그 리스트를 Set으로 변환
            Set<String> tagNames = tags != null ? new HashSet<>(tags) : new HashSet<>();

            // 글 생성
            PostDTO newPost = postService.createPost(author.getId(), post, tagNames);

            return ResponseEntity.ok(newPost);
        } catch (Exception e) {
            e.printStackTrace(); // 예외 스택 추적 로그 출력
            return ResponseEntity.status(500).body("Internal Server Error");
        }
    }



    // 특정 게시물 조회
    @GetMapping("/{id}")
    public ResponseEntity<?> getPost(
            @PathVariable Long id,
            @AuthenticationPrincipal UserDetails userDetails) {
        Optional<PostDTO> postOpt = postService.getPostById(id);
        if (!postOpt.isPresent()) {
            return ResponseEntity.notFound().build();
        }

        PostDTO post = postOpt.get();

        // 공개 게시물이거나, 현재 사용자가 작성자인지 확인
        if (post.getStatus().equals("PRIVATE")) {
            String username = userDetails.getUsername();
            Optional<User> userOpt = userService.getUserByUsername(username);
            if (!userOpt.isPresent() || !post.getAuthorId().equals(userOpt.get().getId())) {
                return ResponseEntity.status(403).body("Access Denied");
            }
        }

        return ResponseEntity.ok(post);
    }

    // 게시물 수정
    @PutMapping("/{id}")
    public ResponseEntity<?> updatePost(
            @PathVariable Long id,
            @RequestParam("title") String title,
            @RequestParam("content") String content,
            @RequestParam(value = "status", required = false) String status,
            @RequestParam(value = "image", required = false) MultipartFile image,
            @RequestParam(value = "tags", required = false) List<String> tags,
            @AuthenticationPrincipal UserDetails userDetails) {
        try {
            // 현재 로그인한 사용자 정보 조회
            String username = userDetails.getUsername();
            Optional<User> userOpt = userService.getUserByUsername(username);

            if (!userOpt.isPresent()) {
                return ResponseEntity.status(404).body("User not found");
            }

            User currentUser = userOpt.get();
            Optional<PostDTO> postOpt = postService.getPostById(id);

            if (!postOpt.isPresent()) {
                return ResponseEntity.status(404).body("Post not found");
            }

            PostDTO existingPost = postOpt.get();

            // 작성자 검증
            if (!existingPost.getAuthorId().equals(currentUser.getId())) {
                return ResponseEntity.status(403).body("Access Denied");
            }

            // 이미지 파일 업로드 처리 (optional)
            String imageUrl = existingPost.getImageUrl(); // 기존 이미지 URL
            if (image != null && !image.isEmpty()) {
                imageUrl = fileUploadService.uploadFile(image);
                System.out.println("업로드된 이미지 URL: " + imageUrl);
            }

            // 상태 설정
            String updatedStatus = existingPost.getStatus(); // 기본값은 기존 상태
            if (status != null) {
                try {
                    Post.Status.valueOf(status); // 유효성 검사
                    updatedStatus = status;
                } catch (IllegalArgumentException e) {
                    return ResponseEntity.badRequest().body("Invalid status value: " + status); // 구체적인 오류 메시지 반환
                }
            }

            // 게시물 수정
            PostDTO updatedPost = new PostDTO();
            updatedPost.setId(id);
            updatedPost.setTitle(title);
            updatedPost.setContent(content);
            updatedPost.setStatus(updatedStatus); // status 설정
            updatedPost.setImageUrl(imageUrl);
            updatedPost.setAuthorId(currentUser.getId());
            updatedPost.setTags(tags != null ? new HashSet<>(tags) : existingPost.getTags());

            PostDTO post = postService.updatePost(id, updatedPost);
            return ResponseEntity.ok(post);

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body("Internal Server Error");
        }
    }

    // 게시물 삭제
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deletePost(
            @PathVariable Long id,
            @AuthenticationPrincipal UserDetails userDetails) {
        try {
            String username = userDetails.getUsername();
            Optional<User> userOpt = userService.getUserByUsername(username);

            if (!userOpt.isPresent()) {
                return ResponseEntity.status(404).body("User not found");
            }

            User currentUser = userOpt.get();
            Optional<PostDTO> postOpt = postService.getPostById(id);

            if (!postOpt.isPresent()) {
                return ResponseEntity.status(404).body("Post not found");
            }

            PostDTO post = postOpt.get();

            // 작성자 검증
            if (!post.getAuthorId().equals(currentUser.getId())) {
                return ResponseEntity.status(403).body("Access Denied");
            }

            postService.deletePost(id);
            System.out.println("게시물 삭제 완료: " + id);
            return ResponseEntity.noContent().build();

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body("Internal Server Error");
        }
    }

    // 모든 게시물 조회 (태그 필터링 가능)
    @GetMapping
    public ResponseEntity<List<PostDTO>> getAllPosts(
            @RequestParam(value = "tag", required = false) String tagName) {
        List<PostDTO> posts;
        if (tagName != null && !tagName.isEmpty()) {
            posts = postService.getPostsByTag(tagName);
        } else {
            posts = postService.getAllPosts();
        }
        return ResponseEntity.ok(posts);
    }

    // 최신 게시물 조회
    @GetMapping("/latest")
    public ResponseEntity<List<PostDTO>> getLatestPosts() {
        List<PostDTO> latestPosts = postService.getLatestPosts(5); // 최신 5개 게시물
        return ResponseEntity.ok(latestPosts);
    }
}
