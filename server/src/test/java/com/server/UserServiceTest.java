package com.server;

import com.server.entity.Post;
import com.server.entity.User;
import com.server.repository.PostRepository;
import com.server.repository.UserRepository;
import com.server.service.UserServiceImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.mockito.Mockito.when;

    @ExtendWith(MockitoExtension.class)
    public class UserServiceTest {

        @Mock
        private UserRepository userRepository;

        @Mock
        private PostRepository postRepository;

        @InjectMocks
        private UserServiceImpl userService;

        private User user;

        @BeforeEach
        public void setUp() {
            user = new User();
            user.setId(1L);
            user.setUsername("testuser");
            user.setEmail("testuser@example.com");
            user.setRole(User.Role.SILVER);
        }

        @Test
        public void testCreatePost() {
            // Given
            Post post = new Post();
            post.setTitle("Test Post");
            post.setContent("Test content");

            // Mock the userRepository and postRepository behavior
            when(userRepository.findById(1L)).thenReturn(Optional.of(user));
            when(postRepository.save(post)).thenReturn(post);

            // When
            Post createdPost = userService.createPost(1L, post);

            // Then
            assertNotNull(createdPost);
            assertEquals("Test Post", createdPost.getTitle());
            assertEquals("Test content", createdPost.getContent());
            assertEquals(user, createdPost.getAuthor()); // Author should be the mock user
            verify(postRepository, times(1)).save(post);  // Ensure postRepository save method was called once
        }
    }