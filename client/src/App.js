// App.js
import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { Provider, useDispatch, useSelector } from "react-redux";
import store from "./store.js";
import { getCurrentUser } from "./slices/authSlice"; // 현재 사용자 가져오기 액션
import Header from "./components/Header";
import Main from "./components/Main";
import Feed from "./components/Feed";
import MyFeed from "./components/MyFeed";
import MyPage from "./components/MyPage";
import UploadPage from "./components/UploadPage";
import LoginModal from "./components/LoginModal";
import PostDetailPage from "./components/PostDetailPage";

function App() {
  const [showLoginModal, setShowLoginModal] = useState(false);
  const dispatch = useDispatch();
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);

  useEffect(() => {
    if (isLoggedIn) {
      dispatch(getCurrentUser());
    }
  }, [dispatch, isLoggedIn]);

  return (
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
        <Route path="/posts/:postId" element={<PostDetailPage />} />
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
  );
}

export default () => (
  <Provider store={store}>
    <App />
  </Provider>
);
