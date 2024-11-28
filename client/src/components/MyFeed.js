// src/components/MyFeed.js

import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useDispatch } from "react-redux"; // useDispatch 임포트
import { getCurrentUser } from "../slices/authSlice"; // getCurrentUser Thunk 임포트
import API from "../api";
import Tabs from "./Tabs";
import "./MyFeed.css";

function MyFeed({ setShowLoginModal }) {
  const [posts, setPosts] = useState([]);
  const [allTags, setAllTags] = useState([]);
  const [filterTag, setFilterTag] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch(); // dispatch 선언

  useEffect(() => {
    // URL에서 태그 추출
    const queryParams = new URLSearchParams(location.search);
    const tag = queryParams.get("tag");
    setFilterTag(tag);
  }, [location.search]);

  // 컴포넌트 마운트 시 현재 사용자 정보 가져오기
  useEffect(() => {
    dispatch(getCurrentUser());
  }, [dispatch]);

  // 모든 태그 가져오기
  useEffect(() => {
    const fetchTags = async () => {
      try {
        const response = await API.get("/tags");
        setAllTags(response.data);
      } catch (error) {
        console.error("Failed to fetch tags:", error);
        setAllTags([]);
      }
    };
    fetchTags();
  }, []);

  // 포스트 가져오기
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        let response;
        if (filterTag) {
          response = await API.get(
            `/posts?tag=${encodeURIComponent(filterTag)}`
          );
        } else {
          response = await API.get("/posts");
        }
        setPosts(Array.isArray(response.data) ? response.data : []);
      } catch (error) {
        console.error("Failed to fetch posts:", error);
        setPosts([]);
      }
    };
    fetchPosts();
  }, [filterTag]);

  const handlePostClick = (postId) => {
    navigate(`/posts/${postId}`);
  };

  const handleTagClick = (tag) => {
    if (filterTag === tag) {
      navigate("/myfeed");
    } else {
      navigate(`/myfeed?tag=${encodeURIComponent(tag)}`);
    }
  };

  return (
    <div className="myfeed-container">
      <Tabs setShowLoginModal={setShowLoginModal} />

      {/* 태그 리스트 표시 */}
      <div className="tag-list-container">
        {allTags.map((tag) => (
          <span
            key={tag}
            className={`tag-item ${filterTag === tag ? "active" : ""}`}
            onClick={() => handleTagClick(tag)}
          >
            #{tag}
          </span>
        ))}
      </div>

      {/* 필터 정보 영역 제거 */}

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
                    loading="lazy"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = "/path/to/placeholder-image.png";
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
                {/* 태그 표시 */}
                {post.tags && post.tags.length > 0 && (
                  <div className="post-tags">
                    {post.tags.map((tag) => (
                      <span
                        key={tag}
                        className="post-tag"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleTagClick(tag);
                        }}
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}
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
