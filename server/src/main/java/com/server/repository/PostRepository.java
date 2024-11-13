package com.server.repository;

import com.server.entity.Post;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface PostRepository extends JpaRepository<Post, Long> {
    List<Post> findTop10ByOrderByCreatedAtDesc();
}
