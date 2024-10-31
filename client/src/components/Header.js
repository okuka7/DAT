import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaUser } from "react-icons/fa";
import "./Header.css";

function Header() {
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const navigate = useNavigate();

  const handleIconClick = () => {
    if (isLoggedIn) {
      navigate("/mypage");
    }
  };

  return (
    <div className="header-container">
      <Link to="/" className="header-title">
        물교
      </Link>
      <nav className="header">
        <Link to="/" className="header-link">
          물물교환
        </Link>
        <Link to="/myfeed" className="header-link">
          내 물교
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
