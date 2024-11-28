// src/components/Tabs.js

import React from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { selectUserRole } from "../slices/authSlice"; // role 셀렉터 임포트

function Tabs({ setShowLoginModal }) {
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn); // 로그인 상태
  const userRole = useSelector(selectUserRole); // 사용자 등급
  const userStatus = useSelector((state) => state.auth.userStatus); // 사용자 상태
  const navigate = useNavigate();

  console.log("isLoggedIn:", isLoggedIn);
  console.log("userRole:", userRole);
  console.log("userStatus:", userStatus);

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

  // 사용자 정보가 로드 중일 때는 버튼을 표시하지 않음
  if (userStatus === "loading") {
    return null;
  }

  return (
    <div className="tabs">
      {isLoggedIn && userRole === "GOLD" && (
        <button
          className="tab upload-button"
          onClick={handleUploadClick}
          title="글쓰기"
        >
          글쓰기
        </button>
      )}
    </div>
  );
}

export default Tabs;
