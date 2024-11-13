// components/MyFeed.js

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api";
import Tabs from "./Tabs";
import "./MyFeed.css";

function MyFeed({ setShowLoginModal }) {
  const [posts, setPosts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await API.get("/posts");
        console.log("Fetched posts:", response.data);
        setPosts(Array.isArray(response.data) ? response.data : []);
      } catch (error) {
        console.error("Failed to fetch posts:", error);
        setPosts([]);
      }
    };
    fetchPosts();
  }, []);

  const handlePostClick = (postId) => {
    navigate(`/posts/${postId}`);
  };

  return (
    <div className="myfeed-container">
      <Tabs setShowLoginModal={setShowLoginModal} />
      <div className="feed-container">
        {posts.length > 0 ? (
          posts.map((post) => (
            <div
              key={post.id}
              className="post-card"
              onClick={() => handlePostClick(post.id)}
            >
              {/* 이미지가 있을 경우에만 렌더링 */}
              {post.imageUrl && (
                <div className="image-container">
                  <img
                    src={post.imageUrl}
                    alt={
                      post.title ? `Image for ${post.title}` : `Post ${post.id}`
                    }
                    className="feed-post-image"
                    loading="lazy" // 이미지 지연 로딩 추가
                    onError={(e) => {
                      e.target.onerror = null; // 무한 루프 방지
                      e.target.src = "/path/to/placeholder-image.png"; // 대체 이미지 경로로 변경
                    }}
                  />
                </div>
              )}
              <div className="post-content">
                <h3 className="post-title">{post.title}</h3>
                {/* dangerouslySetInnerHTML을 사용한 미리보기 */}
                <p
                  className="post-preview"
                  dangerouslySetInnerHTML={{ __html: post.content }}
                ></p>
                <p className="post-date">
                  {new Date(post.createdAt)
                    .toLocaleDateString("ko-KR", {
                      year: "numeric",
                      month: "2-digit",
                      day: "2-digit",
                    })
                    .replace(/\./g, " .")
                    .replace(/ \.$/, "")}
                </p>
              </div>
            </div>
          ))
        ) : (
          <p className="no-posts-message">게시물이 없습니다</p>
        )}
      </div>
    </div>
  );
}

export default MyFeed;
