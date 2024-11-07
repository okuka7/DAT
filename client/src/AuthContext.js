import React, { createContext, useState, useEffect } from "react";
import API from "./api";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (token) {
      API.get("/users/getLoginUser")
        .then((response) => {
          setUser(response.data); // 사용자 정보 설정
          setIsLoggedIn(true);
        })
        .catch((error) => {
          console.error("Failed to fetch user data:", error);
          logout(); // 유효하지 않은 토큰 시 로그아웃
        });
    }
  }, []);

  const login = (token, userData) => {
    localStorage.setItem("authToken", token);
    setUser(userData);
    setIsLoggedIn(true);
  };

  const logout = () => {
    localStorage.removeItem("authToken");
    setUser(null);
    setIsLoggedIn(false);
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
