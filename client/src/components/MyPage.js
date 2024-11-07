import React, { useState, useEffect, useContext } from "react";
import { AuthContext } from "../AuthContext";
import API from "../api";
import { useNavigate } from "react-router-dom";
import "./MyPage.css";

function MyPage() {
  const { isLoggedIn, logout } = useContext(AuthContext);
  const [userNickname, setUserNickname] = useState("User");
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const navigate = useNavigate();

  useEffect(() => {
    if (isLoggedIn) {
      // 토큰을 콘솔에 출력하여 제대로 저장되었는지 확인합니다.
      const authToken = localStorage.getItem("authToken");
      console.log("Stored Token:", authToken);

      if (authToken) {
        // 서버에서 사용자 정보를 가져옵니다.
        API.get("/api/users/getLoginUser", {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        })
          .then((response) => {
            console.log("Response Data:", response.data); // 응답 데이터 구조 확인
            setUserNickname(response.data.username); // username 필드가 맞는지 확인 필요
          })
          .catch((error) => {
            console.error("Failed to fetch user data:", error);
            if (error.response && error.response.status === 403) {
              // 토큰이 유효하지 않거나 권한이 없을 경우 로그아웃 처리
              alert("Session expired or unauthorized. Please log in again.");
              logout();
              navigate("/login");
            }
          });
      } else {
        console.error("Token not found or invalid.");
        logout();
        navigate("/login");
      }
    } else {
      navigate("/");
    }
  }, [isLoggedIn, navigate, logout]);

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
