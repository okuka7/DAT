// API 인스턴스 파일 (api.js)
import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:8080/api",
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem("authToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
    console.log("Authorization 헤더 추가됨:", config.headers.Authorization); // 확인용 로그
  } else {
    console.log("토큰 없음");
  }
  return config;
});

export default API;
