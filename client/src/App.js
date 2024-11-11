// App.js
import React, { useEffect, useState } from "react";
import $ from "jquery";
import SummerNoteLite from "./summernote-lite.js";
import SummerNoteKr from "./summernote-ko-KR.js";
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
  const userStatus = useSelector((state) => state.auth.userStatus);

  // 로그인을 확인하고, 로그인된 경우 사용자 정보를 가져오는 useEffect
  useEffect(() => {
    console.log("isLoggedIn:", isLoggedIn); // 디버깅용 로그인 상태 확인
    console.log("userStatus:", userStatus); // 디버깅용 사용자 상태 확인

    // 사용자가 로그인 상태이고, 사용자 정보를 아직 불러오지 않은 경우 getCurrentUser 호출
    if (isLoggedIn && userStatus === "idle") {
      console.log("Attempting to fetch current user");
      dispatch(getCurrentUser())
        .unwrap()
        .catch((error) =>
          console.error("Failed to fetch current user:", error)
        );
    }
  }, [dispatch, isLoggedIn, userStatus]); // userStatus 의존성 추가

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
