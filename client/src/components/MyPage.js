import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { logout, getCurrentUser } from "../slices/authSlice";
import { useNavigate } from "react-router-dom";
import "./MyPage.css";
import API from "../api"; // API 파일 경로를 확인하고 올바르게 입력하세요

function MyPage() {
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  const user = useSelector((state) => state.auth.user); // Redux에서 유저 정보 가져오기
  const dispatch = useDispatch();
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const navigate = useNavigate();

  useEffect(() => {
    if (isLoggedIn && !user) {
      dispatch(getCurrentUser())
        .unwrap()
        .catch(() => {
          dispatch(logout());
          navigate("/login");
        });
    }
  }, [isLoggedIn, user, dispatch, navigate]);

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
          dispatch(logout());
          navigate("/");
        })
        .catch((error) => {
          console.error("Failed to delete account:", error);
          alert("Failed to delete account.");
        });
    }
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate("/");
  };

  return (
    <div className="mypage-container">
      <p className="greeting">Hi {user?.username || "User"}</p>
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
