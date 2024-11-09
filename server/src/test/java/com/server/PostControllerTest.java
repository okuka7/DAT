package com.server;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.server.ServerApplication;
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
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;

import java.util.List;
import java.util.Optional;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;
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
        mockPostDTO.setTitle("Test Post");
        mockPostDTO.setContent("Test content");

        when(userService.getUserByUsername("testuser")).thenReturn(Optional.of(mockUser));
    }

    @Test
    @WithMockUser(username = "testuser", roles = {"SILVER"})
    void testCreatePost() throws Exception {
        // Mock 설정
        when(postService.createPost(anyLong(), any(Post.class))).thenReturn(mockPostDTO);

        mockMvc.perform(multipart("/api/posts")
                        .file("image", new byte[]{}) // MockMultipartFile 사용
                        .param("title", "Test Post")
                        .param("content", "Test content")
                        .contentType(MediaType.MULTIPART_FORM_DATA))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.title").value("Test Post"))
                .andExpect(jsonPath("$.content").value("Test content"));
    }

    @Test
    @WithMockUser(username = "testuser", roles = {"SILVER"})
    public void testGetPost() throws Exception {
        // Given
        PostDTO postDTO = new PostDTO(1L, "Test Post", "Test content", 1L, "testuser", null, null, null);

        when(postService.getPostById(1L)).thenReturn(Optional.of(postDTO));

        // When & Then
        mockMvc.perform(get("/api/posts/{id}", 1L))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.title").value("Test Post"))
                .andExpect(jsonPath("$.content").value("Test content"));
    }

    @Test
    @WithMockUser(username = "testuser", roles = {"SILVER"})
    public void testUpdatePost() throws Exception {
        // Given
        PostDTO updatedPostDTO = new PostDTO(1L, "Updated Post", "Updated content", 1L, "testuser", null, null, null);

        when(postService.updatePost(eq(1L), any(PostDTO.class))).thenReturn(updatedPostDTO);

        // When & Then
        mockMvc.perform(put("/api/posts/{id}", 1L)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(updatedPostDTO)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.title").value("Updated Post"))
                .andExpect(jsonPath("$.content").value("Updated content"));
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
    public void testGetAllPosts() throws Exception {
        // Given
        PostDTO postDTO1 = new PostDTO(1L, "Post 1", "Content 1", 1L, "testuser", null, null, null);
        PostDTO postDTO2 = new PostDTO(2L, "Post 2", "Content 2", 1L, "testuser", null, null, null);

        when(postService.getAllPosts()).thenReturn(List.of(postDTO1, postDTO2));

        // When & Then
        mockMvc.perform(get("/api/posts"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].title").value("Post 1"))
                .andExpect(jsonPath("$[1].title").value("Post 2"));
    }
}
