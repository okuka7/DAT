import React, { useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { AuthProvider } from "./AuthContext"; // AuthProvider import
import Header from "./components/Header";
import Main from "./components/Main";
import Feed from "./components/Feed";
import MyFeed from "./components/MyFeed";
import MyPage from "./components/MyPage";
import UploadPage from "./components/UploadPage";
import LoginModal from "./components/LoginModal";
import Tabs from "./components/Tabs";

function App() {
  const [showLoginModal, setShowLoginModal] = useState(false);

  return (
    <AuthProvider>
      <Router>
        <Header setShowLoginModal={setShowLoginModal} /> {/* Header에 전달 */}
        <Routes>
          <Route
            path="/"
            element={<Main setShowLoginModal={setShowLoginModal} />} // Main에 전달
          />
          <Route path="/feed" element={<Feed />} />
          <Route
            path="/myfeed"
            element={<MyFeed setShowLoginModal={setShowLoginModal} />}
          />
          <Route path="/mypage" element={<MyPage />} />
          <Route path="/upload" element={<UploadPage />} />
          <Route
            path="/login"
            element={<LoginModal closeModal={() => setShowLoginModal(false)} />}
          />
        </Routes>
        {/* Modal 표시 조건을 위한 코드 */}
        {showLoginModal && (
          <LoginModal closeModal={() => setShowLoginModal(false)} />
        )}
      </Router>
    </AuthProvider>
  );
}

export default App;
