import axios from "axios";
import store from "./store"; // Redux store import

const API = axios.create({
  baseURL: "http://localhost:8080/api",
});

API.interceptors.request.use((config) => {
  const state = store.getState(); // Redux store의 현재 상태 가져오기
  const token = state.auth.token; // Redux 상태에서 토큰 가져오기

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
    if (process.env.NODE_ENV === "development") {
      console.log("Authorization 헤더 추가됨:", config.headers.Authorization);
    }
  } else if (process.env.NODE_ENV === "development") {
    console.log("토큰 없음");
  }
  return config;
});

export default API;
