// src/test/java/com/server/PostControllerTest.java

package com.server;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.server.dto.PostDTO;
import com.server.entity.Post;
import com.server.entity.User;
import com.server.service.FileUploadService;
import com.server.service.PostService;
import com.server.service.UserService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;

import java.util.*;

import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.user;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;

import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest(classes = ServerApplication.class)
@AutoConfigureMockMvc
public class PostControllerTest {


    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private PostService postService;

    @MockBean
    private UserService userService;

    @MockBean
    private FileUploadService fileUploadService;

    @Autowired
    private ObjectMapper objectMapper;

    private User mockUser;
    private PostDTO mockPostDTO;

    @BeforeEach
    void setUp() {
        // 설정된 모의 사용자 및 게시글 데이터
        mockUser = new User();
        mockUser.setId(1L);
        mockUser.setUsername("testuser");

        mockPostDTO = new PostDTO();
        mockPostDTO.setId(1L);
        mockPostDTO.setTitle("Test Post");
        mockPostDTO.setContent("Test content");
        mockPostDTO.setAuthorId(mockUser.getId());
        mockPostDTO.setAuthorName(mockUser.getUsername());
        mockPostDTO.setTags(new HashSet<>(Arrays.asList("tag1", "tag2")));
        mockPostDTO.setStatus("PUBLIC");

        when(userService.getUserByUsername("testuser")).thenReturn(Optional.of(mockUser));
    }

    @Test
    @WithMockUser(username = "testuser", roles = {"SILVER"})
    void testCreatePost() throws Exception {
        // Mock 설정
        when(fileUploadService.uploadFile(any())).thenReturn("/uploads/testimage.jpg");
        when(postService.createPost(anyLong(), any(Post.class), anySet())).thenReturn(mockPostDTO);

        MockMultipartFile image = new MockMultipartFile("image", "testimage.jpg", "image/jpeg", new byte[]{1, 2, 3});

        mockMvc.perform(multipart("/api/posts")
                        .file(image)
                        .param("title", "Test Post")
                        .param("content", "Test content")
                        .param("status", "PUBLIC")
                        .param("tags", "tag1", "tag2")
                        .contentType(MediaType.MULTIPART_FORM_DATA))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.title").value("Test Post"))
                .andExpect(jsonPath("$.content").value("Test content"))
                .andExpect(jsonPath("$.authorId").value(1))
                .andExpect(jsonPath("$.authorName").value("testuser"))
                .andExpect(jsonPath("$.tags").isArray())
                .andExpect(jsonPath("$.tags.length()").value(2))
                .andExpect(jsonPath("$.status").value("PUBLIC"));
    }

    @Test
    @WithMockUser(username = "testuser", roles = {"SILVER"})
    public void testGetPost() throws Exception {
        // Given
        PostDTO postDTO = new PostDTO();
        postDTO.setId(1L);
        postDTO.setTitle("Test Post");
        postDTO.setContent("Test content");
        postDTO.setAuthorId(1L);
        postDTO.setAuthorName("testuser");
        postDTO.setTags(new HashSet<>(Arrays.asList("tag1", "tag2")));
        postDTO.setStatus("PUBLIC");

        when(postService.getPostById(1L)).thenReturn(Optional.of(postDTO));

        // When & Then
        mockMvc.perform(get("/api/posts/{id}", 1L))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.title").value("Test Post"))
                .andExpect(jsonPath("$.content").value("Test content"))
                .andExpect(jsonPath("$.authorId").value(1))
                .andExpect(jsonPath("$.authorName").value("testuser"))
                .andExpect(jsonPath("$.tags").isArray())
                .andExpect(jsonPath("$.tags.length()").value(2))
                .andExpect(jsonPath("$.status").value("PUBLIC"));
    }

    @Test
    @WithMockUser(username = "testuser", roles = {"SILVER"})
    public void testUpdatePost() throws Exception {
        // Given
        PostDTO updatedPostDTO = new PostDTO();
        updatedPostDTO.setId(1L);
        updatedPostDTO.setTitle("Updated Post");
        updatedPostDTO.setContent("Updated content");
        updatedPostDTO.setAuthorId(1L);
        updatedPostDTO.setAuthorName("testuser");
        updatedPostDTO.setTags(new HashSet<>(Arrays.asList("tag3")));
        updatedPostDTO.setStatus("PRIVATE");

        when(postService.updatePost(eq(1L), any(PostDTO.class))).thenReturn(updatedPostDTO);

        MockMultipartFile image = new MockMultipartFile("image", "updatedimage.jpg", "image/jpeg", new byte[]{4, 5, 6});

        mockMvc.perform(multipart("/api/posts/{id}", 1L)
                        .file(image)
                        .param("title", "Updated Post")
                        .param("content", "Updated content")
                        .param("status", "PRIVATE")
                        .param("tags", "tag3")
                        .with(request -> {
                            request.setMethod("PUT");
                            return request;
                        })
                        .contentType(MediaType.MULTIPART_FORM_DATA))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.title").value("Updated Post"))
                .andExpect(jsonPath("$.content").value("Updated content"))
                .andExpect(jsonPath("$.authorId").value(1))
                .andExpect(jsonPath("$.authorName").value("testuser"))
                .andExpect(jsonPath("$.tags").isArray())
                .andExpect(jsonPath("$.tags.length()").value(1))
                .andExpect(jsonPath("$.tags[0]").value("tag3"))
                .andExpect(jsonPath("$.status").value("PRIVATE"));
    }

    @Test
    @WithMockUser(username = "testuser", roles = {"SILVER"})
    public void testUpdatePostWithInvalidStatus() throws Exception {
        // Given
        PostDTO updatedPostDTO = new PostDTO();
        updatedPostDTO.setId(1L);
        updatedPostDTO.setTitle("Updated Post");
        updatedPostDTO.setContent("Updated content");
        updatedPostDTO.setAuthorId(1L);
        updatedPostDTO.setAuthorName("testuser");
        updatedPostDTO.setTags(new HashSet<>(Arrays.asList("tag3")));
        updatedPostDTO.setStatus("INVALID_STATUS");

        when(postService.updatePost(eq(1L), any(PostDTO.class)))
                .thenThrow(new RuntimeException("Invalid or missing status value"));

        MockMultipartFile image = new MockMultipartFile("image", "updatedimage.jpg", "image/jpeg", new byte[]{4, 5, 6});

        mockMvc.perform(multipart("/api/posts/{id}", 1L)
                        .file(image)
                        .param("title", "Updated Post")
                        .param("content", "Updated content")
                        .param("status", "INVALID_STATUS")
                        .param("tags", "tag3")
                        .with(request -> {
                            request.setMethod("PUT");
                            return request;
                        })
                        .contentType(MediaType.MULTIPART_FORM_DATA))
                .andExpect(status().isInternalServerError())
                .andExpect(content().string("Invalid or missing status value"));
    }

    @Test
    @WithMockUser(username = "testuser", roles = {"SILVER"})
    public void testDeletePost() throws Exception {
        // Given
        doNothing().when(postService).deletePost(1L);

        // When & Then
        mockMvc.perform(delete("/api/posts/{id}", 1L))
                .andExpect(status().isNoContent());
    }

    @Test
    @WithMockUser(username = "testuser", roles = {"SILVER"})
    public void testDeletePostNotFound() throws Exception {
        // Given
        doThrow(new RuntimeException("Post not found")).when(postService).deletePost(1L);

        // When & Then
        mockMvc.perform(delete("/api/posts/{id}", 1L))
                .andExpect(status().isInternalServerError())
                .andExpect(content().string("Post not found"));
    }

    @Test
    @WithMockUser(username = "testuser", roles = {"SILVER"})
    public void testGetAllPosts() throws Exception {
        // Given
        PostDTO postDTO1 = new PostDTO();
        postDTO1.setId(1L);
        postDTO1.setTitle("Post 1");
        postDTO1.setContent("Content 1");
        postDTO1.setAuthorId(1L);
        postDTO1.setAuthorName("testuser");
        postDTO1.setTags(new HashSet<>(Arrays.asList("tag1")));
        postDTO1.setStatus("PUBLIC");

        PostDTO postDTO2 = new PostDTO();
        postDTO2.setId(2L);
        postDTO2.setTitle("Post 2");
        postDTO2.setContent("Content 2");
        postDTO2.setAuthorId(1L);
        postDTO2.setAuthorName("testuser");
        postDTO2.setTags(new HashSet<>(Arrays.asList("tag2")));
        postDTO2.setStatus("PRIVATE");

        when(postService.getAllPosts()).thenReturn(List.of(postDTO1, postDTO2));

        // When & Then
        mockMvc.perform(get("/api/posts"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.posts[0].title").value("Post 1"))
                .andExpect(jsonPath("$.posts[0].content").value("Content 1"))
                .andExpect(jsonPath("$.posts[0].authorId").value(1))
                .andExpect(jsonPath("$.posts[0].authorName").value("testuser"))
                .andExpect(jsonPath("$.posts[0].tags").isArray())
                .andExpect(jsonPath("$.posts[0].tags.length()").value(1))
                .andExpect(jsonPath("$.posts[0].status").value("PUBLIC"))
                .andExpect(jsonPath("$.posts[1].title").value("Post 2"))
                .andExpect(jsonPath("$.posts[1].content").value("Content 2"))
                .andExpect(jsonPath("$.posts[1].authorId").value(1))
                .andExpect(jsonPath("$.posts[1].authorName").value("testuser"))
                .andExpect(jsonPath("$.posts[1].tags").isArray())
                .andExpect(jsonPath("$.posts[1].tags.length()").value(1))
                .andExpect(jsonPath("$.posts[1].status").value("PRIVATE"));
    }

    @Test
    @WithMockUser(username = "testuser", roles = {"SILVER"})
    public void testGetPostsByTag() throws Exception {
        // Given
        PostDTO postDTO1 = new PostDTO();
        postDTO1.setId(1L);
        postDTO1.setTitle("Post 1");
        postDTO1.setContent("Content 1");
        postDTO1.setAuthorId(1L);
        postDTO1.setAuthorName("testuser");
        postDTO1.setTags(new HashSet<>(Arrays.asList("tag1")));
        postDTO1.setStatus("PUBLIC");

        when(postService.getPostsByTag("tag1")).thenReturn(List.of(postDTO1));

        // When & Then
        mockMvc.perform(get("/api/posts").param("tag", "tag1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.posts[0].title").value("Post 1"))
                .andExpect(jsonPath("$.posts[0].content").value("Content 1"))
                .andExpect(jsonPath("$.posts[0].authorId").value(1))
                .andExpect(jsonPath("$.posts[0].authorName").value("testuser"))
                .andExpect(jsonPath("$.posts[0].tags").isArray())
                .andExpect(jsonPath("$.posts[0].tags.length()").value(1))
                .andExpect(jsonPath("$.posts[0].status").value("PUBLIC"));
    }

    @Test
    @WithMockUser(username = "testuser", roles = {"SILVER"})
    public void testGetLatestPosts() throws Exception {
        // Given
        PostDTO postDTO1 = new PostDTO();
        postDTO1.setId(1L);
        postDTO1.setTitle("Latest Post 1");
        postDTO1.setContent("Latest content 1");
        postDTO1.setAuthorId(1L);
        postDTO1.setAuthorName("testuser");
        postDTO1.setTags(new HashSet<>(Arrays.asList("tag1")));
        postDTO1.setStatus("PUBLIC");

        PostDTO postDTO2 = new PostDTO();
        postDTO2.setId(2L);
        postDTO2.setTitle("Latest Post 2");
        postDTO2.setContent("Latest content 2");
        postDTO2.setAuthorId(1L);
        postDTO2.setAuthorName("testuser");
        postDTO2.setTags(new HashSet<>(Arrays.asList("tag2")));
        postDTO2.setStatus("PRIVATE");

        when(postService.getLatestPosts(5)).thenReturn(List.of(postDTO1, postDTO2));

        // When & Then
        mockMvc.perform(get("/api/posts/latest"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.posts[0].title").value("Latest Post 1"))
                .andExpect(jsonPath("$.posts[0].content").value("Latest content 1"))
                .andExpect(jsonPath("$.posts[0].authorId").value(1))
                .andExpect(jsonPath("$.posts[0].authorName").value("testuser"))
                .andExpect(jsonPath("$.posts[0].tags").isArray())
                .andExpect(jsonPath("$.posts[0].tags.length()").value(1))
                .andExpect(jsonPath("$.posts[0].status").value("PUBLIC"))
                .andExpect(jsonPath("$.posts[1].title").value("Latest Post 2"))
                .andExpect(jsonPath("$.posts[1].content").value("Latest content 2"))
                .andExpect(jsonPath("$.posts[1].authorId").value(1))
                .andExpect(jsonPath("$.posts[1].authorName").value("testuser"))
                .andExpect(jsonPath("$.posts[1].tags").isArray())
                .andExpect(jsonPath("$.posts[1].tags.length()").value(1))
                .andExpect(jsonPath("$.posts[1].status").value("PRIVATE"));
    }

    @Test
    @WithMockUser(username = "testuser", roles = {"SILVER"})
    public void testCreatePostMissingTitle() throws Exception {
        // When & Then
        MockMultipartFile image = new MockMultipartFile("image", "testimage.jpg", "image/jpeg", new byte[]{1, 2, 3});

        mockMvc.perform(multipart("/api/posts")
                        .file(image)
                        // .param("title", "Test Post") // 제목 누락
                        .param("content", "Test content")
                        .param("status", "PUBLIC")
                        .param("tags", "tag1", "tag2")
                        .contentType(MediaType.MULTIPART_FORM_DATA))
                .andExpect(status().isBadRequest())
                .andExpect(content().string("Required parameter 'title' is not present"));
    }

    @Test
    public void testUpdatePostUnauthorized() throws Exception {
        // Given
        PostDTO existingPostDTO = new PostDTO();
        existingPostDTO.setId(1L);
        existingPostDTO.setTitle("Original Post");
        existingPostDTO.setContent("Original content");
        existingPostDTO.setAuthorId(1L);
        existingPostDTO.setAuthorName("testuser");
        existingPostDTO.setTags(new HashSet<>(Arrays.asList("tag1")));
        existingPostDTO.setStatus("PUBLIC");

        when(postService.getPostById(1L)).thenReturn(Optional.of(existingPostDTO));

        // 새로운 사용자로 로그인 시도
        mockMvc.perform(multipart("/api/posts/{id}", 1L)
                        .file(new MockMultipartFile("image", "updatedimage.jpg", "image/jpeg", new byte[]{4, 5, 6}))
                        .param("title", "Updated Post")
                        .param("content", "Updated content")
                        .param("status", "PRIVATE")
                        .param("tags", "tag3")
                        .with(user("anotheruser").roles("SILVER"))
                        .with(request -> {
                            request.setMethod("PUT");
                            return request;
                        })
                        .contentType(MediaType.MULTIPART_FORM_DATA))
                .andExpect(status().isForbidden())
                .andExpect(content().string("You are not authorized to update this post."));
    }
}
