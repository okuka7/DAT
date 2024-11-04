import React, { useState } from "react";
import Tabs from "./Tabs";
import "./MyFeed.css";

const postsData = [
  {
    id: 1,
    imageUrl: "https://via.placeholder.com/150",
    title: "글 제목 1",
    content: "글 내용 1",
  },
  {
    id: 2,
    imageUrl: "https://via.placeholder.com/150",
    title: "사진 제목 1",
    content: "사진 내용 1",
  },
  {
    id: 3,
    imageUrl: "https://via.placeholder.com/150",
    title: "글 제목 2",
    content: "글 내용 2",
  },
  {
    id: 4,
    imageUrl: "https://via.placeholder.com/150",
    title: "사진 제목 2",
    content: "사진 내용 2",
  },
];

function MyFeed({ isLoggedIn, setIsLoggedIn }) {
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [id, setId] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = () => {
    if (id === "test" && password === "1234") {
      setIsLoggedIn(true);
      setShowLoginModal(false);
    } else {
      alert("아이디 또는 비밀번호가 일치하지 않습니다.");
    }
  };

  return (
    <div className="myfeed-container">
      <Tabs isLoggedIn={isLoggedIn} setShowLoginModal={setShowLoginModal} />
      <div className="feed-container">
        {postsData.map((post) => (
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
