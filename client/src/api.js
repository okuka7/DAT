import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:8080/api", // Spring Boot 서버의 기본 URL
});

// JWT 토큰이 있을 경우 헤더에 추가
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("authToken"); // 로컬 스토리지에서 토큰을 가져옴
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default API;
