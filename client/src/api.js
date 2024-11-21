// src/api.js

import axios from "axios";
import store from "./store"; // Redux store import

const API = axios.create({
  baseURL: process.env.REACT_APP_API_URL || "/api",
});

API.interceptors.request.use((config) => {
  const state = store.getState();
  const token = state.auth.token;

  // 토큰이 null, undefined, 빈 문자열인 경우 Authorization 헤더를 추가하지 않음
  if (
    token &&
    token !== "null" &&
    token !== "undefined" &&
    token.trim() !== ""
  ) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default API;
