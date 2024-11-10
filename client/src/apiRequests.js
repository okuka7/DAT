import axios from "axios";

export const loginRequest = async (username, password) => {
  const response = await axios.post("http://localhost:8080/api/auth/login", {
    username,
    password,
  });
  if (response.data.success) {
    localStorage.setItem("authToken", response.data.data); // 토큰 저장
    return response.data.data; // 토큰 반환
  } else {
    throw new Error("로그인 실패");
  }
};

export const registerRequest = async (userData) => {
  const response = await axios.post(
    "http://localhost:8080/api/users/register",
    userData
  );
  if (!response.data.success) {
    throw new Error("회원가입 실패");
  }
  return response.data;
};

export const getCurrentUserRequest = async () => {
  const token = localStorage.getItem("authToken");
  if (token) {
    const response = await axios.get(
      "http://localhost:8080/api/users/getLoginUser",
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    console.log("API Response:", response.data);
    const { id, username } = response.data.data; // 필요한 데이터만 추출
    return { id, username };
  } else {
    throw new Error("토큰 없음");
  }
};

export const getStatusRequest = async () => {
  const token = localStorage.getItem("authToken");
  if (token) {
    const response = await axios.get("http://localhost:8080/api/users/status", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data; // 상태 데이터 반환
  } else {
    throw new Error("토큰 없음");
  }
};
