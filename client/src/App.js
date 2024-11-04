import React, { useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Header from "./components/Header";
import Main from "./components/Main"; // Main 페이지를 import합니다.
import Feed from "./components/Feed";
import MyFeed from "./components/MyFeed";
import MyPage from "./components/MyPage";
import UploadPage from "./components/UploadPage";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  return (
    <Router>
      <Header isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />
      <Routes>
        <Route path="/" element={<Main />} /> {/* Main 페이지 라우트 추가 */}
        <Route path="/feed" element={<Feed isLoggedIn={isLoggedIn} />} />
        <Route
          path="/myfeed"
          element={
            <MyFeed isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />
          }
        />
        <Route path="/mypage" element={<MyPage />} />
        <Route path="/upload" element={<UploadPage />} />
        {/* 다른 경로 추가 */}
      </Routes>
    </Router>
  );
}

export default App;
