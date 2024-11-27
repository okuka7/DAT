// src/api.js

import axios from "axios";
import store from "./store"; // Redux store import

const API = axios.create({
  baseURL: process.env.REACT_APP_API_URL || "https://api.okuka99.site/api/",
});

API.interceptors.request.use(
  (config) => {
    const state = store.getState();
    const token = state.auth.token;

    // 인증이 필요 없는 경로를 정의
    const excludedPaths = [
      "/auth/login",
      "/auth/register",
      "/users/register",
      "/api/login",
      // 다른 인증 불필요 경로 추가
    ];

    // 현재 요청이 인증 불필요 경로에 해당하지 않을 경우에만 Authorization 헤더 추가
    const isExcluded = excludedPaths.some((path) =>
      config.url.startsWith(path)
    );

    if (
      !isExcluded &&
      token &&
      token !== "null" &&
      token !== "undefined" &&
      token.trim() !== ""
    ) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

API.interceptors.response.use(
  (response) => response,
  (error) => {
    // 에러 핸들링 로직 추가
    return Promise.reject(error);
  }
);

export default API;
