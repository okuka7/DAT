import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../AuthContext";
import { FaUser } from "react-icons/fa";
import "./Header.css";

function Header({ setShowLoginModal }) {
  const { isLoggedIn } = useContext(AuthContext);
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
        <Link to="/feed" className="header-link">
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
