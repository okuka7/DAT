// src/components/Main.js

import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  getStatus,
  selectStatusData,
  selectStatusState,
} from "../slices/authSlice";
import {
  getLatestPosts,
  selectLatestPosts,
  selectPostsStatus,
  selectPostsError,
} from "../slices/postSlice";
import "./Main.css";
import { useNavigate } from "react-router-dom";

function Main({ setShowLoginModal }) {
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  const statusData = useSelector(selectStatusData);
  const statusState = useSelector(selectStatusState);
  const latestPosts = useSelector(selectLatestPosts);
  const postsStatus = useSelector(selectPostsStatus);
  const postsError = useSelector(selectPostsError);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isCheckingTime, setIsCheckingTime] = useState(false);
  const [attendanceStatus, setAttendanceStatus] = useState("퇴근한 상태");
  const [accumulatedTime, setAccumulatedTime] = useState(0);
  const [resettableTime, setResettableTime] = useState(0);
  const [intervalId, setIntervalId] = useState(null);

  // 출석 상태 가져오기
  useEffect(() => {
    if (isLoggedIn && statusState === "idle") {
      dispatch(getStatus());
    }
  }, [isLoggedIn, statusState, dispatch]);

  // 출석 상태가 변경될 때 누적 시간을 업데이트
  useEffect(() => {
    if (statusData) {
      setAccumulatedTime(statusData.accumulatedTime || 0);
    }
  }, [statusData]);

  // 최신 글 데이터 가져오기 (컴포넌트가 마운트될 때마다 실행)
  useEffect(() => {
    dispatch(getLatestPosts());
  }, [dispatch]);

  // 출근 시작
  const handleStart = () => {
    setAttendanceStatus("출근한 상태");
    setIsCheckingTime(true);

    const id = setInterval(() => {
      setResettableTime((prev) => prev + 1000);
    }, 1000);
    setIntervalId(id);
  };

  // 출근 정지 및 재개
  const handlePauseOrResume = () => {
    if (isCheckingTime) {
      clearInterval(intervalId);
      setIsCheckingTime(false);
      setAttendanceStatus("정지한 상태");
    } else {
      setAttendanceStatus("출근한 상태");
      const id = setInterval(() => {
        setResettableTime((prev) => prev + 1000);
      }, 1000);
      setIntervalId(id);
      setIsCheckingTime(true);
    }
  };

  // 퇴근 처리
  const handleEnd = () => {
    clearInterval(intervalId);
    setIsCheckingTime(false);
    setAttendanceStatus("퇴근한 상태");

    setAccumulatedTime((prev) => prev + resettableTime);
    setResettableTime(0);
  };

  // 시간을 일/시간/분으로 포맷
  const formatTime = (milliseconds) => {
    const totalMinutes = Math.floor(milliseconds / 60000);
    const days = Math.floor(totalMinutes / 1440);
    const hours = Math.floor((totalMinutes % 1440) / 60);
    const minutes = totalMinutes % 60;
    return `${days}일 ${hours}시간 ${minutes}분`;
  };

  // 누적 시간을 시간/분으로 포맷
  const formatTotalHoursAndMinutes = (milliseconds) => {
    const totalMinutes = Math.floor(milliseconds / 60000);
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    return `${hours}시간 ${minutes}분`;
  };

  return (
    <div className="main-container">
      {/* Header 컴포넌트 제거 */}

      <section className="latest-posts">
        <h2>최신 글</h2>
        {postsStatus === "loading" && <p>로딩 중...</p>}
        {postsStatus === "failed" && <p>Error: {postsError}</p>}
        {postsStatus === "succeeded" &&
        Array.isArray(latestPosts) &&
        latestPosts.length > 0 ? (
          latestPosts.map((post) => (
            <div
              key={post.id}
              className="latest-post-card"
              onClick={() => navigate(`/posts/${post.id}`)}
            >
              {post.imageUrl && (
                <img
                  src={post.imageUrl}
                  alt={`Post ${post.id}`}
                  className="latest-post-image"
                  loading="lazy"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "/placeholder.png"; // 실제 플레이스홀더 이미지 경로로 수정
                  }}
                />
              )}
              <div className="latest-post-content">
                <h3 className="latest-post-title">{post.title}</h3>
                <p
                  className="latest-post-preview"
                  dangerouslySetInnerHTML={{ __html: post.content }}
                ></p>
                <p className="latest-post-date">
                  {new Date(post.createdAt)
                    .toLocaleDateString("ko-KR", {
                      year: "numeric",
                      month: "2-digit",
                      day: "2-digit",
                    })
                    .replace(/\./g, " .")
                    .replace(/ \.$/, "")}
                </p>
              </div>
            </div>
          ))
        ) : postsStatus === "succeeded" ? (
          <p className="no-posts-message">게시물이 없습니다</p>
        ) : null}
      </section>

      {/* 출석 추적 섹션은 로그인된 사용자에게만 표시 */}
      {isLoggedIn && (
        <div className="attendance-container">
          <section className="attendance-tracker">
            <h2>출석 시간</h2>
            <p>현재 상태: {attendanceStatus}</p>
            <p>경과 시간: {formatTime(accumulatedTime)}</p>
            <p>퇴근 시 초기화되는 시간: {formatTime(resettableTime)}</p>
            {!isCheckingTime ? (
              <button onClick={handleStart}>출근</button>
            ) : (
              <button onClick={handlePauseOrResume}>
                {isCheckingTime ? "정지" : "시작"}
              </button>
            )}
            <button onClick={handleEnd}>퇴근</button>
          </section>
          <div className="total-time-display">
            <strong>{formatTotalHoursAndMinutes(accumulatedTime)}</strong>
          </div>
        </div>
      )}
    </div>
  );
}

export default Main;
