// src/components/LoginModal.js
import React, { useState, useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
import { loginUser, registerUser } from "../slices/authSlice";
import "./LoginModal.css";

function LoginModal({ closeModal }) {
  const dispatch = useDispatch();

  // 상태 변수들
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [email, setEmail] = useState("");
  const [isRegistering, setIsRegistering] = useState(false);

  // 오류 메시지 상태
  const [errorMessage, setErrorMessage] = useState("");

  // 퀴즈 관련 상태 변수들
  const [quizQuestion, setQuizQuestion] = useState("");
  const [quizAnswer, setQuizAnswer] = useState("");
  const [userAnswer, setUserAnswer] = useState("");

  const modalRef = useRef(null);

  // 문제 목록과 정답
  const quizzes = [
    {
      question: "쓰기는 분명히 썼는데 읽을 수 없는 것은?",
      answer: "모자",
    },
    {
      question: "네 마리의 고양이가 괴물이 되면?",
      answer: "포켓몬스터",
    },
    {
      question: "세상에서 가장 더러운 강은?",
      answer: "요강",
    },
    {
      question: "비가 빅뱅에 들어가지 않은 이유는?",
      answer: "태양을 피하고 싶어서",
    },
  ];

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        closeModal();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [closeModal]);

  // 회원가입 모드로 전환될 때 랜덤한 퀴즈 선택
  useEffect(() => {
    if (isRegistering) {
      const randomQuiz = quizzes[Math.floor(Math.random() * quizzes.length)];
      setQuizQuestion(randomQuiz.question);
      setQuizAnswer(randomQuiz.answer);
      setUserAnswer(""); // 사용자 입력 초기화
      setErrorMessage(""); // 오류 메시지 초기화
    } else {
      setErrorMessage(""); // 오류 메시지 초기화
    }
  }, [isRegistering]);

  const handleLogin = () => {
    dispatch(loginUser({ username, password }))
      .unwrap()
      .then(() => {
        closeModal();
      })
      .catch((error) => {
        setErrorMessage("아이디 또는 비밀번호가 일치하지 않습니다.");
        console.error("로그인 오류:", error);
      });
  };

  const handleRegister = () => {
    setErrorMessage(""); // 오류 메시지 초기화

    if (password !== confirmPassword) {
      setErrorMessage("비밀번호가 일치하지 않습니다.");
      return;
    }

    if (userAnswer.trim() !== quizAnswer.trim()) {
      setErrorMessage("정답이 틀렸습니다.");
      return;
    }

    dispatch(
      registerUser({ username, password, email, quizQuestion, userAnswer })
    )
      .unwrap()
      .then(() => {
        alert("회원가입이 완료되었습니다. 로그인해 주세요.");
        setIsRegistering(false);
      })
      .catch((error) => {
        // 서버로부터 받은 오류 메시지 처리
        if (error && error.message) {
          setErrorMessage(error.message);
        } else {
          setErrorMessage("회원가입에 실패했습니다.");
        }
        console.error("회원가입 오류:", error);
      });
  };

  return (
    <div className="modal-background">
      <div className="modal-content" ref={modalRef}>
        <h2>{isRegistering ? "회원가입" : "로그인"}</h2>
        <input
          type="text"
          placeholder="아이디"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="login-input"
        />
        {isRegistering && (
          <>
            <input
              type="email"
              placeholder="이메일"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="login-input"
            />
            <input
              type="password"
              placeholder="비밀번호 확인"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="login-input"
            />
          </>
        )}
        <input
          type="password"
          placeholder="비밀번호"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="login-input"
        />
        {isRegistering && (
          <div className="quiz-section">
            <p className="quiz-question">{quizQuestion}</p>
            <input
              type="text"
              placeholder="퀴즈 정답 입력"
              value={userAnswer}
              onChange={(e) => setUserAnswer(e.target.value)}
              className="login-input"
            />
          </div>
        )}
        {/* 오류 메시지 표시 */}
        {errorMessage && <p className="error-message">{errorMessage}</p>}
        <button
          onClick={isRegistering ? handleRegister : handleLogin}
          className="login-button"
        >
          {isRegistering ? "회원가입" : "로그인"}
        </button>
        <button
          onClick={() => setIsRegistering((prev) => !prev)}
          className="toggle-button"
        >
          {isRegistering ? "로그인 화면으로" : "회원가입"}
        </button>
      </div>
    </div>
  );
}

export default LoginModal;
