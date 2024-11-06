import React, { useState, useEffect } from "react";
import axios from "axios";
import Tabs from "./Tabs";
import "./MyFeed.css";

function MyFeed({ isLoggedIn, setIsLoggedIn }) {
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [id, setId] = useState("");
  const [password, setPassword] = useState("");
  const [posts, setPosts] = useState([]);

  // Spring Boot API에서 게시물 데이터 가져오기
  useEffect(() => {
    axios
      .get("/api/posts") // Spring Boot 게시물 API 엔드포인트
      .then((response) => {
        setPosts(response.data);
      })
      .catch((error) => {
        console.error("Failed to fetch posts:", error);
      });
  }, []);

  const handleLogin = () => {
    axios
      .post("/api/auth/login", { id, password }) // Spring Boot 로그인 엔드포인트
      .then((response) => {
        if (response.data.success) {
          setIsLoggedIn(true);
          setShowLoginModal(false);
          localStorage.setItem("authToken", response.data.token); // 로그인 성공 시 토큰 저장
        } else {
          alert("아이디 또는 비밀번호가 일치하지 않습니다.");
        }
      })
      .catch((error) => {
        console.error("로그인 오류:", error);
        alert("아이디 또는 비밀번호가 일치하지 않습니다.");
      });
  };

  return (
    <div className="myfeed-container">
      <Tabs isLoggedIn={isLoggedIn} setShowLoginModal={setShowLoginModal} />
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

      {showLoginModal && (
        <div className="modal" onClick={() => setShowLoginModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>로그인</h2>
            <input
              type="text"
              placeholder="아이디"
              value={id}
              onChange={(e) => setId(e.target.value)}
              className="login-input"
            />
            <input
              type="password"
              placeholder="비밀번호"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="login-input"
            />
            <button onClick={handleLogin} className="login-button">
              로그인
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default MyFeed;
