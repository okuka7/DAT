import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaUser } from "react-icons/fa";
import "./Header.css";

function Header() {
  const [isLoggedIn, setIsLoggedIn] = useState(true); // 로그인 상태를 예시로 설정
  const navigate = useNavigate();

  const handleIconClick = () => {
    if (isLoggedIn) {
      navigate("/mypage"); // 로그인 상태에서 마이페이지로 이동
    } else {
      // 로그인 모달을 여는 코드 (이전 코드의 모달 열기)
    }
  };

  return (
    <div className="header-container">
      <Link to="/" className="header-title">
        DAT
      </Link>
      <nav className="header">
        <Link to="/" className="header-link">
          Feed
        </Link>
        <Link to="/myfeed" className="header-link">
          MyFeed
        </Link>
        <Link to="/team" className="header-link">
          TeamPage
        </Link>
      </nav>
      <button onClick={handleIconClick} className="login-icon">
        <FaUser />
      </button>
    </div>
  );
}

export default Header;
