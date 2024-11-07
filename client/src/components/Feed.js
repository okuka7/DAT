import React, { useState, useEffect } from "react";
import API from "../api"; // api.js의 API 인스턴스를 import
import "./Feed.css";

function Feed() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    // Spring Boot API에서 데이터 가져오기
    API.get("/posts") // 기본 URL이 이미 설정되었으므로 "/posts"만 추가
      .then((response) => {
        setPosts(response.data); // 서버에서 받은 데이터를 상태로 설정
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
