// apiRequests.js

import API from "./api";

// 로그인 요청 함수
export const loginRequest = async (username, password) => {
  try {
    const response = await API.post("/auth/login", { username, password });
    if (response.data.success) {
      return response.data.data; // 토큰 반환
    } else {
      throw new Error(response.data.message || "로그인 실패");
    }
  } catch (error) {
    throw new Error(error.response?.data?.message || "로그인 실패");
  }
};

export const registerRequest = async (userData) => {
  const response = await API.post("/users/register", userData);
  if (!response.data.success) {
    throw new Error("회원가입 실패");
  }
  return response.data;
};

export const getCurrentUserRequest = async () => {
  const response = await API.get("/users/getLoginUser");
  const { id, username } = response.data.data; // 필요한 데이터만 추출
  return { id, username };
};

export const getStatusRequest = async () => {
  const response = await API.get("/users/status");
  return response.data;
};
