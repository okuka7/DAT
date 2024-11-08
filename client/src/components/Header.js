import React from "react";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { FaUser } from "react-icons/fa";
import "./Header.css";

function Header({ setShowLoginModal }) {
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  const navigate = useNavigate();

  const handleIconClick = () => {
    if (!isLoggedIn) {
      setShowLoginModal(true);
    } else {
      navigate("/mypage");
    }
  };

  return (
    <div className="header-container">
      <Link to="/" className="header-title">
        99
      </Link>
      <nav className="header">
        <Link to="/" className="header-link">
          New
        </Link>
        <Link to="/myfeed" className="header-link">
          Content
        </Link>
        <Link to="/team" className="header-link">
          99
        </Link>
        <button onClick={handleIconClick} className="login-icon">
          <FaUser />
        </button>
      </nav>
    </div>
  );
}

export default Header;
