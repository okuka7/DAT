import React, { useState, useEffect } from "react";
import axios from "axios"; // axios import
import "./Feed.css";

function Feed() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    // Spring Boot API에서 데이터 가져오기
    axios
      .get("/api/posts") // API URL을 Spring Boot에 맞게 조정하세요
      .then((response) => {
        setPosts(response.data);
      })
      .catch((error) => {
        console.error("Failed to fetch posts:", error);
      });
  }, []);

  return (
    <div className="feed-container">
      {posts.map((post) => (
        <div key={post.id} className="post-card feed">
          <img
            src={post.imageUrl}
            alt={`Post ${post.id}`}
            className="post-image"
          />
          <div className="post-content">
            <p>{post.content}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

export default Feed;
