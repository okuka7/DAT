// AuthContext.js
import React, { createContext, useState, useEffect } from "react";
import API from "./api";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (token) {
      API.get("/api/users/getLoginUser", {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((response) => {
          setUser(response.data);
          setIsLoggedIn(true);
        })
        .catch((error) => {
          console.error("Failed to fetch user data:", error);
          // If token is invalid, clear and logout
          logout();
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
