import React from "react";
import { useNavigate } from "react-router-dom";

function Tabs({ activeTab, setActiveTab }) {
  const navigate = useNavigate();

  const handleUploadClick = () => {
    navigate("/upload"); // 물건 올리기 버튼 클릭 시 업로드 페이지로 이동
  };

  return (
    <div className="tabs">
      <button
        className={`tab ${activeTab === "myfeed" ? "active" : ""}`}
        onClick={() => setActiveTab("myfeed")}
      >
        내 물건
      </button>
      <button
        className={`tab ${activeTab === "save" ? "active" : ""}`}
        onClick={() => setActiveTab("save")}
      >
        찜
      </button>
      <button className="tab upload-button" onClick={handleUploadClick}>
        물건 올리기
      </button>
    </div>
  );
}

export default Tabs;
