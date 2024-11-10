// src/components/MyPage.js
import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { logout, getCurrentUser } from "../slices/authSlice";
import { useNavigate } from "react-router-dom";
import "./MyPage.css";
import API from "../api";

function MyPage() {
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  const user = useSelector((state) => state.auth.user);
  const dispatch = useDispatch();
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const navigate = useNavigate();

  useEffect(() => {
    console.log("isLoggedIn:", isLoggedIn, "user:", user);
    if (isLoggedIn && !user) {
      dispatch(getCurrentUser())
        .unwrap()
        .then((res) => console.log("getCurrentUser success:", res))
        .catch((error) => {
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
      <p className="greeting">Hi {user ? user.username : "User"}</p>
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
    </div>
  );
}

export default MyPage;
