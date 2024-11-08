// src/components/LoginModal.js
import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loginUser, registerUser } from "../slices/authSlice";
import "./LoginModal.css";

function LoginModal({ closeModal }) {
  const dispatch = useDispatch();
  const loginError = useSelector((state) => state.auth.error);

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [isRegistering, setIsRegistering] = useState(false);
  const modalRef = useRef(null);

  // 외부 클릭으로 모달 닫기
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        closeModal();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [closeModal]);

  const handleLogin = () => {
    dispatch(loginUser({ username, password }))
      .unwrap()
      .then(() => {
        closeModal();
      })
      .catch((error) => {
        alert("아이디 또는 비밀번호가 일치하지 않습니다.");
        console.error("로그인 오류:", error);
      });
  };

  const handleRegister = () => {
    if (password !== confirmPassword) {
      alert("비밀번호가 일치하지 않습니다.");
      return;
    }

    dispatch(registerUser({ username, password, email, name }))
      .unwrap()
      .then(() => {
        alert("회원가입이 완료되었습니다. 로그인해 주세요.");
        setIsRegistering(false);
      })
      .catch((error) => {
        alert("회원가입에 실패했습니다.");
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
              type="text"
              placeholder="이름"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="login-input"
            />
            <input
              type="email"
              placeholder="이메일"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
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
          <input
            type="password"
            placeholder="비밀번호 확인"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="login-input"
          />
        )}
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
        {loginError && <p className="error-message">{loginError}</p>}
      </div>
    </div>
  );
}

export default LoginModal;
