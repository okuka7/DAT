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
              <img
                src={post.imageUrl}
                alt={`Post ${post.id}`}
                className="post-image"
              />
              <div className="post-content">
                <h3 className="post-title">{post.title}</h3>
                {/* 미리보기 부분에 dangerouslySetInnerHTML 사용 */}
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
