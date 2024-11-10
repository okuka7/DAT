import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // useNavigate 추가
import API from "../api";
import Tabs from "./Tabs";
import "./MyFeed.css";

function MyFeed({ setShowLoginModal }) {
  const [posts, setPosts] = useState([]);
  const navigate = useNavigate(); // useNavigate 훅 사용

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await API.get("/posts");
        console.log("Fetched posts:", response.data); // 응답 로그
        setPosts(Array.isArray(response.data) ? response.data : []);
      } catch (error) {
        console.error("Failed to fetch posts:", error);
        setPosts([]); // 오류 발생 시 빈 배열로 설정
      }
    };
    fetchPosts();
  }, []);

  const handlePostClick = (postId) => {
    navigate(`/posts/${postId}`); // 게시물 클릭 시 상세 페이지로 이동
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
              onClick={() => handlePostClick(post.id)} // 클릭 이벤트 추가
            >
              <img
                src={post.imageUrl}
                alt={`Post ${post.id}`}
                className="post-image"
              />
              <div className="post-content">
                <h3 className="post-title">{post.title}</h3>
                <p className="post-preview">{post.content}</p>
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
