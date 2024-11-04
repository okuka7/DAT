import React from "react";
import { useNavigate } from "react-router-dom";

function Tabs({ isLoggedIn, setShowLoginModal }) {
  const navigate = useNavigate();

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
