import React, { useState, useEffect } from "react";
import axios from "axios"; // axios import
import "./MyPage.css";
import { useNavigate } from "react-router-dom";

function MyPage() {
  const [userNickname, setUserNickname] = useState("User");
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const navigate = useNavigate();

  // Spring Boot API에서 사용자 정보 가져오기
  useEffect(() => {
    axios
      .get("/api/user") // 사용자 정보를 가져오는 Spring Boot 엔드포인트
      .then((response) => {
        setUserNickname(response.data.nickname);
      })
      .catch((error) => {
        console.error("Failed to fetch user data:", error);
      });
  }, []);

  const handleMouseMove = (e) => {
    const { clientX, clientY } = e;
    setPosition({
      x: (clientX - window.innerWidth / 2) * -0.2,
      y: (clientY - window.innerHeight / 2) * -0.2,
    });
  };

  const handleDeleteAccount = () => {
    if (window.confirm("Are you sure you want to delete your account?")) {
      axios
        .delete("/api/user/delete") // 계정 삭제를 위한 Spring Boot 엔드포인트
        .then(() => {
          alert("Your account has been deleted.");
          navigate("/"); // 홈 페이지로 리다이렉트
        })
        .catch((error) => {
          console.error("Failed to delete account:", error);
          alert("Failed to delete account.");
        });
    }
  };

  return (
    <div className="mypage-container">
      <p className="greeting">Hi {userNickname}</p>
      <button
        className="delete-account-button"
        onClick={handleDeleteAccount}
        onMouseMove={handleMouseMove}
        style={{
          transform: `translate(${position.x}px, ${position.y}px)`,
        }}
      >
        Delete Account
      </button>
      <footer className="mypage-footer"></footer>
    </div>
  );
}

export default MyPage;
