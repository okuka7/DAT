import React, { useState, useEffect, useContext } from "react";
import { AuthContext } from "../AuthContext";
import { useNavigate } from "react-router-dom";
import API from "../api";
import "./MyPage.css";

function MyPage() {
  const { isLoggedIn, user, logout } = useContext(AuthContext); // user 상태를 가져옵니다.
  const [userNickname, setUserNickname] = useState("User");
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const navigate = useNavigate();

  useEffect(() => {
    if (isLoggedIn) {
      // 이미 로그인한 경우
      if (user) {
        // user가 AuthProvider에서 설정된 경우
        setUserNickname(user.username); // username 필드가 맞는지 확인 필요
      } else {
        // user가 null인 경우 (예: 로그인 후 상태가 변경된 경우)
        console.error("User information is not available.");
        logout();
        navigate("/login");
      }
    } else {
      navigate("/");
    }
  }, [isLoggedIn, user, navigate, logout]);

  const handleMouseMove = (e) => {
    const { clientX, clientY } = e;
    setPosition({
      x: (clientX - window.innerWidth / 2) * -0.2,
      y: (clientY - window.innerHeight / 2) * -0.2,
    });
  };

  const handleDeleteAccount = () => {
    if (window.confirm("Are you sure you want to delete your account?")) {
      API.delete("/api/users/delete", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      })
        .then(() => {
          alert("Your account has been deleted.");
          logout();
          navigate("/");
        })
        .catch((error) => {
          console.error("Failed to delete account:", error);
          alert("Failed to delete account.");
        });
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <div className="mypage-container">
      <p className="greeting">Hi {userNickname}</p>{" "}
      {/* 로그인한 유저의 username 표시 */}
      <button className="logout-button" onClick={handleLogout}>
        Logout
      </button>
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
