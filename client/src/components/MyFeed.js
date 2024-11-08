import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import API from "../api";
import Tabs from "./Tabs";
import "./MyFeed.css";

function MyFeed({ setShowLoginModal }) {
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn); // Redux에서 로그인 상태 가져오기
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    API.get("/posts")
      .then((response) => {
        setPosts(response.data);
      })
      .catch((error) => {
        console.error("Failed to fetch posts:", error);
      });
  }, []);

  return (
    <div className="myfeed-container">
      <Tabs setShowLoginModal={setShowLoginModal} /> {/* Tabs에 함수 전달 */}
      <div className="feed-container">
        {posts.map((post) => (
          <div key={post.id} className="post-card">
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
        ))}
      </div>
    </div>
  );
}

export default MyFeed;
