import React from "react";
import { useNavigate } from "react-router-dom";

function Tabs({ activeTab, setActiveTab, isLoggedIn, setShowLoginModal }) {
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
      <button
        className={`tab ${activeTab === "myfeed" ? "active" : ""}`}
        onClick={() => setActiveTab("myfeed")}
      >
        글
      </button>
      <button
        className={`tab ${activeTab === "save" ? "active" : ""}`}
        onClick={() => setActiveTab("save")}
      >
        사진
      </button>
      <button className="tab upload-button" onClick={handleUploadClick}>
        글쓰기
      </button>
    </div>
  );
}

export default Tabs;
