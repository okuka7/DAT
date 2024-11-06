import React, { useState, useEffect } from "react";
import axios from "axios"; // Axios for API requests
import Header from "./Header";
import "./Main.css";

function Main() {
  const [isCheckingTime, setIsCheckingTime] = useState(false);
  const [attendanceStatus, setAttendanceStatus] = useState("퇴근한 상태");
  const [accumulatedTime, setAccumulatedTime] = useState(0);
  const [resettableTime, setResettableTime] = useState(0);
  const [intervalId, setIntervalId] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const latestPosts = [
    { id: 1, title: "최신 글 제목 1", content: "최신 글 내용 1" },
    { id: 2, title: "최신 글 제목 2", content: "최신 글 내용 2" },
    { id: 3, title: "최신 글 제목 3", content: "최신 글 내용 3" },
  ];

  useEffect(() => {
    // 로그인 상태 확인 및 이전 출석 시간 불러오기
    axios
      .get("/api/user/status")
      .then((response) => {
        setIsLoggedIn(response.data.isLoggedIn);
        setAccumulatedTime(response.data.accumulatedTime);
      })
      .catch((error) => console.error(error));
  }, []);

  const handleStart = () => {
    setAttendanceStatus("출근한 상태");
    setIsCheckingTime(true);

    const id = setInterval(() => {
      setResettableTime((prev) => prev + 1000);
    }, 1000);
    setIntervalId(id);

    axios
      .post("/api/attendance/start")
      .then((response) => console.log(response.data))
      .catch((error) => console.error(error));
  };

  const handlePauseOrResume = () => {
    if (isCheckingTime) {
      clearInterval(intervalId);
      setIsCheckingTime(false);
      setAttendanceStatus("정지한 상태");

      axios
        .post("/api/attendance/pause")
        .then((response) => console.log(response.data))
        .catch((error) => console.error(error));
    } else {
      setAttendanceStatus("출근한 상태");
      const id = setInterval(() => {
        setResettableTime((prev) => prev + 1000);
      }, 1000);
      setIntervalId(id);
      setIsCheckingTime(true);

      axios
        .post("/api/attendance/resume")
        .then((response) => console.log(response.data))
        .catch((error) => console.error(error));
    }
  };

  const handleEnd = () => {
    clearInterval(intervalId);
    setIsCheckingTime(false);
    setAttendanceStatus("퇴근한 상태");

    setAccumulatedTime((prev) => prev + resettableTime);
    setResettableTime(0);

    axios
      .post("/api/attendance/end", { resettableTime })
      .then((response) => console.log(response.data))
      .catch((error) => console.error(error));
  };

  const formatTime = (milliseconds) => {
    const totalMinutes = Math.floor(milliseconds / 60000);
    const days = Math.floor(totalMinutes / 1440);
    const hours = Math.floor((totalMinutes % 1440) / 60);
    const minutes = totalMinutes % 60;
    return `${days}일 ${hours}시간 ${minutes}분`;
  };

  const formatTimeWithSeconds = (milliseconds) => {
    const totalSeconds = Math.floor(milliseconds / 1000);
    const days = Math.floor(totalSeconds / 86400);
    const hours = Math.floor((totalSeconds % 86400) / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    return `${days}일 ${hours}시간 ${minutes}분 ${seconds}초`;
  };

  const formatTotalHoursAndMinutes = (milliseconds) => {
    const totalMinutes = Math.floor(milliseconds / 60000);
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    return `${hours}시간 ${minutes}분`;
  };

  return (
    <div className="main-container">
      <Header isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />

      <section className="latest-posts">
        <h2>최신 글</h2>
        {latestPosts.map((post) => (
          <div key={post.id} className="post-card">
            <h3>{post.title}</h3>
            <p>{post.content}</p>
          </div>
        ))}
      </section>

      {isLoggedIn && (
        <div className="attendance-container">
          <section className="attendance-tracker">
            <h2>출석 시간</h2>
            <p>현재 상태: {attendanceStatus}</p>
            <p>경과 시간: {formatTime(accumulatedTime)}</p>
            <p>
              퇴근 시 초기화되는 시간: {formatTimeWithSeconds(resettableTime)}
            </p>
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
