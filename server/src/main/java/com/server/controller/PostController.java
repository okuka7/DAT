package com.server.controller;

import com.server.dto.PostDTO;
import com.server.entity.Post;
import com.server.entity.User;
import com.server.service.FileUploadService;
import com.server.service.PostService;
import com.server.service.UserService;
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

    @Autowired
    private PostService postService;

    @Autowired
    private FileUploadService fileUploadService;

    @Autowired
    private UserService userService;

    // 게시물 생성
    @PostMapping
    public ResponseEntity<PostDTO> createPost(
            @RequestParam("title") String title,
            @RequestParam("content") String content,
            @RequestParam(value = "image", required = false) MultipartFile image,
            @RequestParam(value = "tags", required = false) List<String> tags,
            @AuthenticationPrincipal UserDetails userDetails) {
        try {
            // 현재 로그인한 사용자 정보 조회
            String username = userDetails.getUsername();
            Optional<User> userOpt = userService.getUserByUsername(username);
            if (!userOpt.isPresent()) {
                return ResponseEntity.status(404).body(null);
            }
            User author = userOpt.get();

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

            // 태그 리스트를 Set으로 변환
            Set<String> tagNames = tags != null ? new HashSet<>(tags) : new HashSet<>();

            // 글 생성
            PostDTO newPost = postService.createPost(author.getId(), post, tagNames);

            return ResponseEntity.ok(newPost);
        } catch (Exception e) {
            e.printStackTrace(); // 예외 스택 추적 로그 출력
            return ResponseEntity.status(500).body(null);
        }
    }

    // 특정 게시물 조회
    @GetMapping("/{id}")
    public ResponseEntity<PostDTO> getPost(@PathVariable Long id) {
        Optional<PostDTO> postOpt = postService.getPostById(id);
        return postOpt.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    // 게시물 수정
    @PutMapping("/{id}")
    public ResponseEntity<PostDTO> updatePost(
            @PathVariable Long id,
            @RequestBody PostDTO updatedPost,
            @AuthenticationPrincipal UserDetails userDetails) {
        try {
            // 현재 로그인한 사용자 정보 조회
            String username = userDetails.getUsername();
            Optional<User> userOpt = userService.getUserByUsername(username);

            if (!userOpt.isPresent()) {
                return ResponseEntity.status(404).build();
            }

            User currentUser = userOpt.get();
            Optional<PostDTO> postOpt = postService.getPostById(id);

            if (!postOpt.isPresent()) {
                return ResponseEntity.status(404).build();
            }

            PostDTO existingPost = postOpt.get();

            // 작성자 검증
            if (!existingPost.getAuthorId().equals(currentUser.getId())) {
                return ResponseEntity.status(403).build();
            }

            // 게시물 수정
            updatedPost.setId(id); // ID 설정
            PostDTO post = postService.updatePost(id, updatedPost);
            return ResponseEntity.ok(post);

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body(null);
        }
    }

    // 게시물 삭제
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePost(
            @PathVariable Long id,
            @AuthenticationPrincipal UserDetails userDetails) {
        try {
            String username = userDetails.getUsername();
            Optional<User> userOpt = userService.getUserByUsername(username);

            if (!userOpt.isPresent()) {
                return ResponseEntity.status(404).build();
            }

            User currentUser = userOpt.get();
            Optional<PostDTO> postOpt = postService.getPostById(id);

            if (!postOpt.isPresent()) {
                return ResponseEntity.status(404).build();
            }

            PostDTO post = postOpt.get();

            // 작성자 검증
            if (!post.getAuthorId().equals(currentUser.getId())) {
                return ResponseEntity.status(403).build();
            }

            postService.deletePost(id);
            return ResponseEntity.noContent().build();

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).build();
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
