// src/components/Tabs.js

import React from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { selectUserRole } from "../slices/authSlice"; // role 셀렉터 임포트

function Tabs({ setShowLoginModal }) {
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn); // 로그인 상태
  const userRole = useSelector(selectUserRole); // 사용자 등급
  const navigate = useNavigate();

  const handleUploadClick = () => {
    console.log("User role:", userRole);
    if (isLoggedIn) {
      if (userRole === "GOLD") {
        navigate("/upload");
      } else {
        alert("GOLD 등급 사용자만 글쓰기가 가능합니다.");
      }
    } else {
      setShowLoginModal(true); // 로그인 모달 표시
    }
  };

  return (
    <div className="tabs">
      <button
        className="tab upload-button"
        onClick={handleUploadClick}
        disabled={isLoggedIn && userRole !== "GOLD"}
        title={
          isLoggedIn && userRole !== "GOLD"
            ? "GOLD 등급 사용자만 글쓰기가 가능합니다."
            : "글쓰기"
        }
      >
        글쓰기
      </button>
    </div>
  );
}

export default Tabs;
