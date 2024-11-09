package com.server.controller;

import com.server.dto.PostDTO;
import com.server.entity.Post;
import com.server.entity.User;
import com.server.service.FileUploadService;
import com.server.service.PostService;
import com.server.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/posts")
public class PostController {

    @Autowired
    private PostService postService;

    @Autowired
    private FileUploadService fileUploadService;

    @Autowired
    private UserService userService;

    @PostMapping
    public ResponseEntity<PostDTO> createPost(@RequestParam("title") String title,
                                              @RequestParam("content") String content,
                                              @RequestParam(value = "image", required = false) MultipartFile image,
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
            if (image != null) {
                imageUrl = fileUploadService.uploadFile(image);
            }

            // 글 작성
            Post post = new Post();
            post.setTitle(title);
            post.setContent(content);
            post.setAuthor(author); // 작성자 설정
            post.setImageUrl(imageUrl); // 이미지 URL 설정

            // `userId`를 넘겨서 글 작성
            PostDTO newPost = postService.createPost(author.getId(), post);

            return ResponseEntity.ok(newPost);
        } catch (Exception e) {
            e.printStackTrace(); // 예외 스택 추적 로그 출력
            return ResponseEntity.status(500).body(null);
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<PostDTO> getPost(@PathVariable Long id) {
        Optional<PostDTO> post = postService.getPostById(id);
        return post.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}")
    public ResponseEntity<PostDTO> updatePost(@PathVariable Long id, @RequestBody PostDTO updatedPost) {
        PostDTO post = postService.updatePost(id, updatedPost);
        return ResponseEntity.ok(post);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePost(@PathVariable Long id) {
        postService.deletePost(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping
    public ResponseEntity<List<PostDTO>> getAllPosts() {
        List<PostDTO> posts = postService.getAllPosts();
        return ResponseEntity.ok(posts);
    }
}
