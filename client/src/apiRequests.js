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

// 회원가입 요청 함수
export const registerRequest = async (userData) => {
  const response = await API.post("/users/register", userData);
  if (!response.data.success) {
    throw new Error("회원가입 실패");
  }
  return response.data;
};

// 현재 사용자 정보 가져오기 요청 함수
export const getCurrentUserRequest = async () => {
  try {
    const response = await API.get("/users/getLoginUser");
    // 서버 응답이 { success: true, data: { id, username, role } } 형태라고 가정
    if (response.data.success) {
      const { id, username, role } = response.data.data; // 필요한 데이터 추출
      return { id, username, role };
    } else {
      throw new Error(
        response.data.message || "현재 사용자 정보를 가져오는데 실패했습니다."
      );
    }
  } catch (error) {
    throw new Error(
      error.response?.data?.message ||
        "현재 사용자 정보를 가져오는데 실패했습니다."
    );
  }
};

// 상태 정보 가져오기 요청 함수
export const getStatusRequest = async () => {
  const response = await API.get("/users/status");
  return response.data;
};
