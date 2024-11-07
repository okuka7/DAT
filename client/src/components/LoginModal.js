import React, { useState, useContext, useEffect, useRef } from "react";
import { AuthContext } from "../AuthContext";
import axios from "axios";
import "./LoginModal.css";

function LoginModal({ closeModal }) {
  const { login } = useContext(AuthContext);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [isRegistering, setIsRegistering] = useState(false); // 로그인/회원가입 모드 상태
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
    axios
      .post("/api/auth/login", { username, password })
      .then((response) => {
        if (response.data.success) {
          login(response.data.token, response.data.user);
          closeModal();
        } else {
          alert("로그인에 실패했습니다.");
        }
      })
      .catch((error) => {
        console.error("로그인 오류:", error);
        alert("아이디 또는 비밀번호가 일치하지 않습니다.");
      });
  };

  const handleRegister = () => {
    if (password !== confirmPassword) {
      alert("비밀번호가 일치하지 않습니다.");
      return;
    }

    axios
      .post("/api/users/register", { username, password, email, name })
      .then((response) => {
        if (response.data.success) {
          alert("회원가입이 완료되었습니다. 로그인해 주세요.");
          setIsRegistering(false); // 회원가입 후 로그인 모드로 전환
        } else {
          alert("회원가입에 실패했습니다.");
        }
      })
      .catch((error) => {
        console.error("회원가입 오류:", error);
        alert("회원가입에 실패했습니다.");
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
      </div>
    </div>
  );
}

export default LoginModal;
