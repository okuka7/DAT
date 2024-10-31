import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Header from "./components/Header";
import Feed from "./components/Feed";
import MyFeed from "./components/MyFeed";
import MyPage from "./components/MyPage";
import TeamPage from "./components/TeamPage";
import UploadPage from "./components/UploadPage";

function App() {
  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<Feed />} />
        <Route path="/myfeed" element={<MyFeed />} />
        <Route path="/mypage" element={<MyPage />} />
        <Route path="/team" element={<TeamPage />} />
        <Route path="/upload" element={<UploadPage />} />
        {/* 업로드 페이지 경로 */}
      </Routes>
    </Router>
  );
}

export default App;
