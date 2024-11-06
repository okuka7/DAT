import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { FaUser } from "react-icons/fa";
import "./Header.css";

function Header({ isLoggedIn, setIsLoggedIn }) {
  const [showSearch, setShowSearch] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [id, setId] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const searchRef = useRef(null);
  const searchButtonRef = useRef(null);

  const handleIconClick = () => {
    if (!isLoggedIn) {
      setShowLoginModal(true);
    } else {
      navigate("/mypage"); // 로그인 상태일 때 아이콘 클릭 시 마이페이지로 이동
    }
  };

  const handleLogin = () => {
    axios
      .post("/api/auth/login", { id, password })
      .then((response) => {
        if (response.data.success) {
          setIsLoggedIn(true);
          setShowLoginModal(false);
          localStorage.setItem("authToken", response.data.token);
        } else {
          alert("로그인에 실패했습니다.");
        }
      })
      .catch((error) => {
        console.error("로그인 오류:", error);
        alert("아이디 또는 비밀번호가 일치하지 않습니다.");
      });
  };

  const toggleSearch = () => {
    setShowSearch((prev) => !prev);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target) &&
        !searchButtonRef.current.contains(event.target)
      ) {
        setShowSearch(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div>
      <div className="header-container">
        <Link to="/" className="header-title">
          99
        </Link>
        <nav className="header">
          <Link to="/feed" className="header-link">
            New
          </Link>
          <Link to="/myfeed" className="header-link">
            Content
          </Link>
          <Link to="/team" className="header-link">
            99
          </Link>
          <button
            ref={searchButtonRef}
            onClick={toggleSearch}
            className="header-link"
          >
            검색
          </button>
        </nav>
        <button onClick={handleIconClick} className="login-icon">
          <FaUser />
        </button>
      </div>
      {showSearch && (
        <div ref={searchRef} className="search-bar">
          <input
            type="text"
            placeholder="검색어를 입력하세요..."
            className="search-input"
          />
        </div>
      )}

      {showLoginModal && (
        <div className="modal" onClick={() => setShowLoginModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>로그인</h2>
            <input
              type="text"
              placeholder="아이디"
              value={id}
              onChange={(e) => setId(e.target.value)}
              className="login-input"
            />
            <input
              type="password"
              placeholder="비밀번호"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="login-input"
            />
            <button onClick={handleLogin} className="login-button">
              로그인
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Header;
