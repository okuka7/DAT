import React, { useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Tabs({ isLoggedIn, setIsLoggedIn, setShowLoginModal }) {
  const navigate = useNavigate();

  // Spring Boot API에서 로그인 상태 확인
  useEffect(() => {
    axios
      .get("/api/auth/status") // Spring Boot 로그인 상태 확인 엔드포인트
      .then((response) => {
        setIsLoggedIn(response.data.isLoggedIn);
      })
      .catch((error) => {
        console.error("Failed to check login status:", error);
      });
  }, [setIsLoggedIn]);

  const handleUploadClick = () => {
    if (isLoggedIn) {
      navigate("/upload");
    } else {
      setShowLoginModal(true); // 로그인 모달 표시
    }
  };

  return (
    <div className="tabs">
      <button className="tab upload-button" onClick={handleUploadClick}>
        글쓰기
      </button>
    </div>
  );
}

export default Tabs;
