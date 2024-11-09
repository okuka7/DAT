package com.server;

import com.server.controller.PostController;
import com.server.entity.Post;
import com.server.entity.User;
import com.server.service.FileUploadService;
import com.server.service.PostService;
import com.server.service.UserService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.MediaType;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import java.util.Optional;

import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@ExtendWith(MockitoExtension.class)
public class PostControllerTest {

    @Mock
    private PostService postService;

    @Mock
    private UserService userService;

    @Mock
    private FileUploadService fileUploadService;

    @InjectMocks
    private PostController postController;

    private MockMvc mockMvc;
    private ObjectMapper objectMapper;

    private User mockUser;

    @BeforeEach
    public void setUp() {
        mockMvc = MockMvcBuilders.standaloneSetup(postController).build();
        objectMapper = new ObjectMapper();

        // Mock user setup
        mockUser = new User();
        mockUser.setId(1L);
        mockUser.setUsername("testuser");
    }

    @Test
    public void testCreatePost() throws Exception {
        // Given
        Post post = new Post();
        post.setTitle("Test Post");
        post.setContent("Test content");

        // Mock the behavior of userService and postService
        when(userService.getUserByUsername("testuser")).thenReturn(Optional.of(mockUser));
        when(postService.createPost(1L, post)).thenReturn(post);

        // When & Then
        mockMvc.perform(post("/api/posts")
                        .contentType(MediaType.MULTIPART_FORM_DATA)
                        .param("title", "Test Post")
                        .param("content", "Test content")
                        .header("Authorization", "Bearer testToken"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.title").value("Test Post"))
                .andExpect(jsonPath("$.content").value("Test content"))
                .andExpect(jsonPath("$.author.username").value("testuser"));
    }

    @Test
    public void testGetPost() throws Exception {
        // Given
        Post post = new Post();
        post.setTitle("Test Post");
        post.setContent("Test content");

        when(postService.getPostById(1L)).thenReturn(Optional.of(post));

        // When & Then
        mockMvc.perform(get("/api/posts/{id}", 1L))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.title").value("Test Post"))
                .andExpect(jsonPath("$.content").value("Test content"));
    }

    @Test
    public void testUpdatePost() throws Exception {
        // Given
        Post post = new Post();
        post.setId(1L);
        post.setTitle("Updated Post");
        post.setContent("Updated content");

        when(postService.updatePost(1L, post)).thenReturn(post);

        // When & Then
        mockMvc.perform(put("/api/posts/{id}", 1L)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(post)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.title").value("Updated Post"))
                .andExpect(jsonPath("$.content").value("Updated content"));
    }

    @Test
    public void testDeletePost() throws Exception {
        // Given
        doNothing().when(postService).deletePost(1L);

        // When & Then
        mockMvc.perform(delete("/api/posts/{id}", 1L))
                .andExpect(status().isNoContent());
    }
}
