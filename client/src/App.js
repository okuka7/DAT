import React, { useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { Provider } from "react-redux";
import store from "./store.js"; // Redux store import
import Header from "./components/Header";
import Main from "./components/Main";
import Feed from "./components/Feed";
import MyFeed from "./components/MyFeed";
import MyPage from "./components/MyPage";
import UploadPage from "./components/UploadPage";
import LoginModal from "./components/LoginModal";

function App() {
  const [showLoginModal, setShowLoginModal] = useState(false);

  return (
    <Provider store={store}>
      <Router>
        <Header setShowLoginModal={setShowLoginModal} />
        <Routes>
          <Route
            path="/"
            element={<Main setShowLoginModal={setShowLoginModal} />}
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
        {showLoginModal && (
          <LoginModal closeModal={() => setShowLoginModal(false)} />
        )}
      </Router>
    </Provider>
  );
}

export default App;
