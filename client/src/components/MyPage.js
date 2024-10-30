import React, { useState } from "react";
import "./MyPage.css";

function MyPage() {
  const userNickname = "User123";
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e) => {
    const { clientX, clientY } = e;

    setPosition({
      x: (clientX - window.innerWidth / 2) * -0.2,
      y: (clientY - window.innerHeight / 2) * -0.2,
    });
  };

  const handleDeleteAccount = () => {
    alert("Are you sure you want to delete your account?");
  };

  return (
    <div className="mypage-container">
      <p className="greeting">Hi {userNickname}</p>
      <button
        className="delete-account-button"
        onClick={handleDeleteAccount}
        onMouseMove={handleMouseMove}
        style={{
          transform: `translate(${position.x}px, ${position.y}px)`,
        }}
      >
        Delete Account
      </button>
      <footer className="mypage-footer"></footer>
    </div>
  );
}

export default MyPage;
